import React, { useState } from 'react';
import { Ruler, Check, X } from 'lucide-react';

export const SizeSelector = ({
  sizes = [],
  sizePrices = {},
  basePrice = 0,
  selectedSize = null,
  onSelectSize,
  hasError = false
}) => {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header with Title and Size Guide */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Select Size
          </span>
          {selectedSize && (
            <span className="text-xs text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-md">
              Selected: {selectedSize}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowSizeGuide(true)}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 transition-colors"
        >
          <Ruler className="w-3.5 h-3.5" />
          Size Chart
        </button>
      </div>

      {/* Size Buttons Grid */}
      <div className="flex flex-wrap gap-2.5">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const price = sizePrices[size] || basePrice;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`flex flex-col items-center justify-center py-2 px-3.5 min-w-[70px] rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-brand-700 bg-brand-50/70 text-brand-950 font-bold shadow-xs scale-102 ring-1 ring-brand-700'
                  : 'border-gray-200 hover:border-gray-400 bg-white text-gray-800'
              } ${hasError && !selectedSize ? 'border-rose-400 ring-2 ring-rose-100 animate-pulse' : ''}`}
            >
              <span className="text-sm font-bold tracking-tight">{size}</span>
              {price > 0 && (
                <span className="text-[11px] font-semibold text-gray-500 mt-0.5">
                  ₹{price}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Validation Message */}
      {hasError && !selectedSize && (
        <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 animate-fade-in">
          ⚠️ Please select a size before proceeding
        </p>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              aria-label="Close size chart"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-800 font-bold text-base mb-4">
              <Ruler className="w-5 h-5" />
              Standard Indian Kurti & Ethnic Size Chart (Inches)
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-600 border border-gray-100">
                <thead className="bg-gray-50 text-gray-900 font-bold uppercase">
                  <tr>
                    <th className="px-3 py-2 border-b">Size</th>
                    <th className="px-3 py-2 border-b">Bust (in)</th>
                    <th className="px-3 py-2 border-b">Waist (in)</th>
                    <th className="px-3 py-2 border-b">Hip (in)</th>
                    <th className="px-3 py-2 border-b">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-3 py-2 font-bold text-gray-900">XXS</td><td className="px-3 py-2">32</td><td className="px-3 py-2">28</td><td className="px-3 py-2">34</td><td className="px-3 py-2">44</td></tr>
                  <tr><td className="px-3 py-2 font-bold text-gray-900">XS</td><td className="px-3 py-2">34</td><td className="px-3 py-2">30</td><td className="px-3 py-2">36</td><td className="px-3 py-2">44</td></tr>
                  <tr><td className="px-3 py-2 font-bold text-gray-900">S</td><td className="px-3 py-2">36</td><td className="px-3 py-2">32</td><td className="px-3 py-2">38</td><td className="px-3 py-2">45</td></tr>
                  <tr><td className="px-3 py-2 font-bold text-gray-900">M</td><td className="px-3 py-2">38</td><td className="px-3 py-2">34</td><td className="px-3 py-2">40</td><td className="px-3 py-2">45</td></tr>
                  <tr><td className="px-3 py-2 font-bold text-gray-900">L</td><td className="px-3 py-2">40</td><td className="px-3 py-2">36</td><td className="px-3 py-2">42</td><td className="px-3 py-2">46</td></tr>
                  <tr><td className="px-3 py-2 font-bold text-gray-900">XL</td><td className="px-3 py-2">42</td><td className="px-3 py-2">38</td><td className="px-3 py-2">44</td><td className="px-3 py-2">46</td></tr>
                  <tr><td className="px-3 py-2 font-bold text-gray-900">XXL</td><td className="px-3 py-2">44</td><td className="px-3 py-2">40</td><td className="px-3 py-2">46</td><td className="px-3 py-2">46</td></tr>
                  <tr><td className="px-3 py-2 font-bold text-gray-900">XXXL</td><td className="px-3 py-2">46</td><td className="px-3 py-2">42</td><td className="px-3 py-2">48</td><td className="px-3 py-2">47</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-[11px] text-gray-500 space-y-1">
              <p>• Measurements refer to body measurements, not garment measurements.</p>
              <p>• If you are between two sizes, we recommend ordering the larger size for a relaxed comfortable fit.</p>
            </div>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="mt-5 w-full py-2.5 bg-brand-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-900 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
