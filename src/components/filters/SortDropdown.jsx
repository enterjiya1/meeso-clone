import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Popularity / Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Arrivals' }
];

export const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium hidden sm:inline flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" /> Sort by:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-xl text-gray-800 outline-none focus:border-brand-700 cursor-pointer shadow-2xs hover:border-gray-300"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
