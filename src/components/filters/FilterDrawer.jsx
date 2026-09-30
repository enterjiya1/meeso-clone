import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

export const FilterDrawer = ({
  isOpen,
  onClose,
  totalResults = 0,
  ...filterProps
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl z-50 flex flex-col animate-slide-up">
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 className="font-bold text-base text-gray-900">Filter Products</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar {...filterProps} />
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={filterProps.onResetFilters}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-brand-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-900 shadow-sm"
          >
            Apply ({totalResults})
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
