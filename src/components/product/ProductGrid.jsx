import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

export const ProductGrid = ({ products = [], emptyMessage = "No products found." }) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center px-4 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No products match your criteria</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
