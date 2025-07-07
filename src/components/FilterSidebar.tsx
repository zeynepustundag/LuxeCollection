import React, { useState, useEffect } from 'react';
import { FilterState, Product } from '../types';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  filters: FilterState;
  products: Product[];
  onFilterChange: (newFilters: FilterState) => void;
  onClearFilters: () => void;
  showFilters: boolean,
  setShowFilters (showFilters:boolean) :  void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  filters,
  products,
  onFilterChange,
  onClearFilters,
  showFilters,
  setShowFilters
}) => {
  const [local, setLocal] = useState<FilterState>(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const handleApply = () => onFilterChange(local);

  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-white p-4 rounded-2xl shadow flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={() => setShowFilters(!showFilters)}>
          <X className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price Range ($)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              className="w-20 p-1 border rounded"
              value={local.priceRange[0]}
              onChange={e => setLocal({ ...local, priceRange: [Number(e.target.value), local.priceRange[1]] })}
            />
            <span>–</span>
            <input
              type="number"
              className="w-20 p-1 border rounded"
              value={local.priceRange[1]}
              onChange={e => setLocal({ ...local, priceRange: [local.priceRange[0], Number(e.target.value)] })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Popularity (0–5)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="w-20 p-1 border rounded"
              value={local.popularityRange[0]}
              onChange={e => setLocal({ ...local, popularityRange: [Number(e.target.value), local.popularityRange[1]] })}
            />
            <span>–</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="w-20 p-1 border rounded"
              value={local.popularityRange[1]}
              onChange={e => setLocal({ ...local, popularityRange: [local.popularityRange[0], Number(e.target.value)] })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            className="w-full p-1 border rounded"
            placeholder="Name"
            value={local.searchTerm}
            onChange={e => setLocal({ ...local, searchTerm: e.target.value })}
          />
        </div>

        <button
          onClick={handleApply}
          className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          Apply Filters
        </button>
         <button
          onClick={onClearFilters}
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black hover:border-black hover:border-[1px] transition"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
};
