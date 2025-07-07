import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Cache for gold price (updates every 5 minutes)
let goldPriceCache = {
  price: 105.50, // Default fallback price per gram in USD
  lastUpdated: 0
};

console.log("ENV API KEY:", process.env.METALS_API_KEY);
// Load product data
const loadProducts = () => {
  try {
    const productsPath = path.join(__dirname, 'data', 'products.json');
    const data = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};


const fetchGoldPrice = async () => {
  try {
    const res = await axios.get('https://api.metalpriceapi.com/v1/latest', {
      params: {
        api_key: process.env.METALS_API_KEY,
        base: 'USD',
        currencies: 'XAU'                     // XAU = gold per ounce
      }
    });

    const usdPerOunce = 1 / res.data.rates.XAU;
    const pricePerGram = usdPerOunce / 31.1035; // ounce → gram dönüşümü

    goldPriceCache = {
      price: Number(pricePerGram.toFixed(2)),
      lastUpdated: Date.now()
    };
    console.log(`Gold price updated: $${goldPriceCache.price}/g`);
    return goldPriceCache.price;
  } catch (err) {
    console.error('Failed fetching metalpriceapi gold:', err.message);
    // Önbellekten dön
    return goldPriceCache.price;
  }
};

// Get current gold price (with caching)
const getCurrentGoldPrice = async () => {
  const fiveMinutes = 5 * 60 * 1000;
  const now = Date.now();

  if (now - goldPriceCache.lastUpdated > fiveMinutes) {
    await fetchGoldPrice();
  }

  return goldPriceCache.price;
};

// Calculate product price
const calculatePrice = (popularityScore, weight, goldPrice) => {
  return Number(((popularityScore + 1) * weight * goldPrice).toFixed(2));
};

// Convert popularity score to 5-star rating
const convertPopularityToStars = (popularityScore) => {
  return Number((popularityScore / 20).toFixed(1)); // Convert 0-100 to 0-5 scale
};

// Route
app.get('/api/products', async (req, res) => {
  try {
    const products = loadProducts();
    const goldPrice = await getCurrentGoldPrice();

    // Parse query parameters for filtering
    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;

    let processedProducts = products.map(product => ({
      ...product,
      price: calculatePrice(product.popularityScore, product.weight, goldPrice),
      popularityStars: convertPopularityToStars(product.popularityScore),
      goldPrice: goldPrice
    }));

    // Apply filters if provided
    if (minPrice || maxPrice || minPopularity || maxPopularity) {
      processedProducts = processedProducts.filter(product => {
        const priceMatch = (!minPrice || product.price >= parseFloat(minPrice)) &&
          (!maxPrice || product.price <= parseFloat(maxPrice));

        const popularityMatch = (!minPopularity || product.popularityStars >= parseFloat(minPopularity)) &&
          (!maxPopularity || product.popularityStars <= parseFloat(maxPopularity));

        return priceMatch && popularityMatch;
      });
    }

    res.json({
      success: true,
      data: processedProducts,
      meta: {
        goldPrice: goldPrice,
        totalProducts: processedProducts.length,
        lastUpdated: new Date(goldPriceCache.lastUpdated).toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// Initialize gold price on startup
fetchGoldPrice();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint:`);
  console.log(`   GET /api/products - Get all products with optional filters`);
});