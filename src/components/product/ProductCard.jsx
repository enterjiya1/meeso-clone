import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);

  const handleCardClick = (e) => {
    // Avoid triggering card navigation when clicking wishlist button
    if (e.target.closest('button[data-wishlist]')) return;
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-gray-100/90 shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <img
          src={product.images && product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badge in top-left */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge text={product.badge} size="xs" />
          </div>
        )}

        {/* Wishlist Button in top-right */}
        <button
          type="button"
          data-wishlist="true"
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 shadow-sm ring-2 ring-rose-300'
              : 'bg-white/80 hover:bg-white text-gray-600 hover:text-rose-600 shadow-xs'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600 scale-110' : ''} transition-transform`} />
        </button>

        {/* Free Delivery / Tag on bottom-left of image */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
            Free Delivery
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand/Seller or Category tag */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="truncate font-medium">{product.fabric}</span>
            <span className="text-gray-400 capitalize">{product.color}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-brand-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating Section */}
          <div className="mt-2 flex items-center gap-1.5">
            <StarRating
              rating={product.rating}
              count={product.reviewsCount}
              size="xs"
              showCount
            />
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-baseline justify-between gap-1 flex-wrap">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-extrabold text-gray-950">
              ₹{product.price}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {product.discount > 0 && (
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
