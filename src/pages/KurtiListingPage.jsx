import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import AppHeader from '../components/common/AppHeader';
import { getOptimizedImageUrl, FALLBACK_IMAGE } from '../utils/imageOptimizer';

export const KurtiListingPage = () => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-12">
      {/* Top Header Bar matching Screenshot 1 */}
      <AppHeader />

      {/* Responsive Container: mobile full width, tablet/desktop elegant centered grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-b border-gray-100">
          {PRODUCTS.map((product, idx) => {
            const isFav = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="p-2 sm:p-2.5 flex flex-col justify-between cursor-pointer border-r border-b border-gray-100 hover:bg-gray-50/50 transition-colors relative group"
              >
                {/* Product Image - Aspect 3:4 portrait so complete saree from head to toe is displayed */}
                <div className="relative aspect-[3/4] w-full rounded-xs overflow-hidden bg-neutral-100 mb-2">
                  <img
                    src={getOptimizedImageUrl(product.image, 400)}
                    alt={product.name}
                    loading={idx < 4 ? "eager" : "lazy"}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                  />

                  {/* Wishlist Heart Icon Top-Right (semi-transparent circle) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 hover:text-[#931b6e] shadow-2xs transition-colors cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-[#931b6e] text-[#931b6e]' : 'text-gray-600 stroke-[1.6]'
                      }`}
                    />
                  </button>

                  {/* Multi-Photo Count Badge (Meesho style) */}
                  {product.galleryImages && product.galleryImages.length > 1 && (
                    <div className="absolute bottom-1.5 right-1.5 bg-black/65 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5 pointer-events-none">
                      <span>📸 {product.galleryImages.length}</span>
                    </div>
                  )}

                  {/* Floating Timer Badge if applicable */}
                  {product.timer && (
                    <div className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>⏰ {product.timer}</span>
                    </div>
                  )}
                </div>

                {/* Text Details */}
                <div className="space-y-1">
                  {/* Title with Ad badge */}
                  <div className="flex items-center gap-1 text-xs text-gray-700 leading-tight">
                    {product.isAd && (
                      <span className="text-[10px] font-medium text-gray-500 border border-gray-300 rounded px-1 py-0 leading-none shrink-0">
                        Ad
                      </span>
                    )}
                    <span className="truncate font-normal text-gray-800">{product.listingTitle}</span>
                  </div>

                  {/* Price Row: Price, MRP, Discount %, and UPI badge */}
                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <div className="flex items-baseline gap-1.5 flex-wrap leading-none">
                      <span className="text-sm sm:text-base font-bold text-gray-950">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {product.mrp}
                      </span>
                      <span className="text-xs font-semibold text-[#038d63]">
                        {product.discount}% off
                      </span>
                    </div>

                    {product.hasUpi && (
                      <span className="bg-[#e0f7fa] text-[#00838f] text-[10px] font-bold px-1.5 py-0.5 rounded">
                        UPI
                      </span>
                    )}
                  </div>

                  {/* Rating Row: Shop 4.3 ★ (373) */}
                  <div className="flex items-center gap-1.5 pt-0.5 text-xs text-gray-500">
                    {product.id === 1 && <span className="text-gray-500 text-[11px]">Shop</span>}
                    <div className="inline-flex items-center gap-0.5 bg-[#038d63] text-white font-bold px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                      <span>{product.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                    </div>
                    <span className="text-[11px] text-gray-400">
                      ({product.reviewsCount.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KurtiListingPage;
