import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

export const RelatedProducts = ({ currentProductId, category, products = [] }) => {
  // Find related products matching category or general ethnic wear, excluding current item
  const related = products
    .filter((p) => p.id !== currentProductId)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === category && b.category !== category) return -1;
      if (b.category === category && a.category !== category) return 1;
      return 0;
    })
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-700" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Similar Products You Might Love
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Handpicked for you
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
