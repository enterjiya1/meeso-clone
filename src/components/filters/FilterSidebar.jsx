import React from 'react';
import { Filter, RotateCcw, Star, Check } from 'lucide-react';
import { CATEGORIES, FABRICS, COLORS, SIZES } from '../../data/products';

export const FilterSidebar = ({
  selectedCategory,
  onSelectCategory,
  selectedPriceRange,
  onSelectPriceRange,
  selectedColors,
  onToggleColor,
  selectedSizes,
  onToggleSize,
  selectedFabrics,
  onToggleFabric,
  minRating,
  onSelectMinRating,
  onResetFilters,
  activeFilterCount = 0
}) => {
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹800', min: 500, max: 800 },
    { label: '₹800 - ₹1,200', min: 800, max: 1200 },
    { label: 'Above ₹1,200', min: 1200, max: 99999 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-700" />
          <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </span>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Category
        </h4>
        <div className="space-y-1 text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-brand-50 text-brand-800 font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Price Range
        </h4>
        <div className="space-y-1 text-xs">
          {priceRanges.map((range, idx) => {
            const isSelected =
              selectedPriceRange &&
              selectedPriceRange.min === range.min &&
              selectedPriceRange.max === range.max;
            return (
              <label
                key={idx}
                className="flex items-center gap-2.5 py-1 text-gray-600 hover:text-gray-900 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() =>
                    onSelectPriceRange(isSelected ? null : range)
                  }
                  className="w-3.5 h-3.5 text-brand-700 focus:ring-brand-500 border-gray-300"
                />
                <span className={isSelected ? 'font-bold text-gray-900' : ''}>
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Color
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => {
            const isSelected = selectedColors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onToggleColor(c.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? 'border-brand-700 bg-brand-50 text-brand-900 font-bold shadow-2xs'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-gray-300 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Size
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((sz) => {
            const isSelected = selectedSizes.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                onClick={() => onToggleSize(sz)}
                className={`w-9 h-8 rounded-lg text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-brand-800 text-white border-brand-800'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Fabric
        </h4>
        <div className="space-y-1 text-xs">
          {FABRICS.map((fab) => {
            const isSelected = selectedFabrics.includes(fab);
            return (
              <label
                key={fab}
                className="flex items-center gap-2 py-1 text-gray-600 hover:text-gray-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleFabric(fab)}
                  className="w-3.5 h-3.5 text-brand-700 rounded focus:ring-brand-500 border-gray-300"
                />
                <span className={isSelected ? 'font-bold text-gray-900' : ''}>
                  {fab}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Customer Rating
        </h4>
        <div className="space-y-1 text-xs">
          {[4, 4.3, 4.5].map((stars) => {
            const isSelected = minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => onSelectMinRating(isSelected ? 0 : stars)}
                className={`w-full text-left py-1.5 px-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span>{stars}★ & above</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
