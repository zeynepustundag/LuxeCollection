import React, { useState, useEffect } from 'react';
import { ProductGrid } from './components/ProductGrid';
import { FilterSidebar } from './components/FilterSideBar';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { Product, FilterState } from './types';
import { productService } from './services/productService';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    popularityRange: [0, 5],
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts();
      setProducts(response.data);
      setGoldPrice(response.meta.goldPrice);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    );

    // Popularity filter
    filtered = filtered.filter(product => {
      const popularity = product.popularityScore * 5;
      return (
        popularity >= filters.popularityRange[0] &&
        popularity <= filters.popularityRange[1]
      );
    });

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      popularityRange: [0, 5],
      searchTerm: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadProducts} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header
        goldPrice={goldPrice}
        onToggleFilters={() => setShowFilters(!showFilters)}
        productCount={filteredProducts.length}
        totalCount={products.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* smaller than md */}
          {showFilters && (
            <div className="md:hidden mb-4">
              <FilterSidebar
                isOpen={showFilters}
                setShowFilters={setShowFilters}
                showFilters={showFilters}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                products={products}
              />
            </div>
          )}

          {/* md and bigger than md */}
          <div className="hidden md:block">
            <FilterSidebar
              isOpen={showFilters}
              setShowFilters={setShowFilters}
              showFilters={showFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              products={products}
            />
          </div>

          <main className="flex-1 flex flex-col items-center justify-center">
            <span className='text-[45px] font-montserrat block mx-auto mb-4 font-thin'>Product List</span>
            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;