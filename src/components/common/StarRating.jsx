import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, count, size = 'sm', showCount = true, className = '' }) => {
  const iconSize = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textClass = size === 'xs' ? 'text-[11px]' : size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="inline-flex items-center gap-0.5 bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded text-xs leading-none tracking-tight">
        <span>{Number(rating).toFixed(1)}</span>
        <Star className={`${iconSize} fill-white text-white`} />
      </div>
      {showCount && count !== undefined && (
        <span className={`text-gray-500 font-normal ${textClass}`}>
          ({count.toLocaleString()} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default StarRating;
