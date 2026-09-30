import React from 'react';
import { Sparkles } from 'lucide-react';

export const ProductHighlights = ({ highlights = {} }) => {
  if (!highlights || Object.keys(highlights).length === 0) return null;

  // Format label from camelCase (e.g. bottomwearFabric -> Bottomwear Fabric)
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const entries = Object.entries(highlights);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Sparkles className="w-4 h-4 text-brand-700" />
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Product Highlights
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-start justify-between py-1.5 border-b border-gray-50 text-xs">
            <span className="text-gray-500 font-medium">{formatKey(key)}</span>
            <span className="text-gray-900 font-semibold text-right max-w-[60%]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlights;
