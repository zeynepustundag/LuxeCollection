import React from 'react';
import { Filter, TrendingUp, Package } from 'lucide-react';

interface HeaderProps {
  goldPrice: number;
  onToggleFilters: () => void;
  productCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  goldPrice, 
  onToggleFilters, 
  productCount, 
  totalCount 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-amber-600" />
              Luxe Collection
            </h1>
            
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">
                Gold: ${goldPrice}/g
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              Showing {productCount} of {totalCount} products
            </div>
            
            <button
              onClick={onToggleFilters}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors duration-200 text-white"
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};