import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/common/StarRating';

export const WishlistPage = () => {
  const { wishlist, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Modal for selecting size when moving to cart from wishlist
  const [sizeModalProduct, setSizeModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleOpenMoveToCart = (product) => {
    setSizeModalProduct(product);
    setSelectedSize(product.sizes ? product.sizes[0] : 'Standard');
  };

  const handleConfirmMoveToCart = () => {
    if (!sizeModalProduct) return;
    if (!selectedSize) {
      showToast('Please select a size', 'warning');
      return;
    }

    addToCart(sizeModalProduct, selectedSize, 1);
    removeFromWishlist(sizeModalProduct.id);
    setSizeModalProduct(null);
    setSelectedSize(null);
  };

  if (wishlistCount === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Your Wishlist is Empty</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Explore our curated collections and save your favorite kurtis, sarees, and lehengas by clicking the heart icon.
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            My Wishlist
          </h1>
          <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full">
            {wishlistCount} Saved Items
          </span>
        </div>

        <button
          type="button"
          onClick={clearWishlist}
          className="text-xs text-gray-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-card flex flex-col justify-between group relative hover:border-gray-200 transition-colors"
          >
            {/* Delete button top-right */}
            <button
              type="button"
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-rose-600 flex items-center justify-center shadow-xs transition-colors"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Clickable Image */}
            <Link
              to={`/product/${product.id}`}
              className="aspect-[3/4] bg-gray-100 overflow-hidden block"
            >
              <img
                src={product.images && product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Content & Actions */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  {product.category}
                </span>
                <Link
                  to={`/product/${product.id}`}
                  className="text-xs sm:text-sm font-bold text-gray-900 hover:text-brand-800 line-clamp-2 mt-0.5"
                >
                  {product.name}
                </Link>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-gray-950">₹{product.price}</span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-50 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenMoveToCart(product)}
                  className="w-full py-2 px-3 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Move to Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Size Picker Modal when moving to Cart */}
      {sizeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-slide-up space-y-4">
            <button
              onClick={() => setSizeModalProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-gray-900">Select Size</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{sizeModalProduct.name}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {sizeModalProduct.sizes &&
                sizeModalProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-3.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      selectedSize === sz
                        ? 'border-brand-700 bg-brand-50 text-brand-950 shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmMoveToCart}
                className="w-full py-3 bg-brand-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-900 transition-colors shadow-sm"
              >
                Add to Cart & Remove from Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
