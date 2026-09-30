import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({ quantity = 1, onQuantityChange, min = 1, max = 10 }) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        Quantity:
      </span>
      <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= min}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-9 text-center font-bold text-sm text-gray-900 select-none">
          {quantity}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= max}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
