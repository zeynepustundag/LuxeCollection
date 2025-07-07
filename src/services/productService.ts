import axios from 'axios';
import { ProductResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const productService = {
  async getAllProducts(filters?: {
    minPrice?: number;
    maxPrice?: number;
    minPopularity?: number;
    maxPopularity?: number;
  }): Promise<ProductResponse> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.minPopularity !== undefined) params.append('minPopularity', filters.minPopularity.toString());
      if (filters.maxPopularity !== undefined) params.append('maxPopularity', filters.maxPopularity.toString());
    }

    const url = params.toString() ? `${API_BASE_URL}/products?${params}` : `${API_BASE_URL}/products`;
    const response = await axios.get(url);
    return response.data;
  },
};