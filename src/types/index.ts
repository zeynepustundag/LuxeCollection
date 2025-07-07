export interface Product {
  id: number;
  name: string;
  popularityScore: number;
  popularityStars: number;
  weight: number;
  price: number;
  goldPrice: number;
  images: {
    [key: string]: string;
  };
  colors: string[];
}

export interface FilterState {
  priceRange: [number, number];
  popularityRange: [number, number];
  searchTerm: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  meta: {
    goldPrice: number;
    totalProducts: number;
    lastUpdated: string;
  };
}