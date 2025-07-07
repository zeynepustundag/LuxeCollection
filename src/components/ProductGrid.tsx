import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">💎</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
        <p className="text-slate-500 max-w-md">
          Try adjusting your filters or search criteria to find the perfect piece for you.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};