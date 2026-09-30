import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Tag,
  Share2,
  Sparkles
} from 'lucide-react';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import SellerCard from './SellerCard';
import ProductHighlights from './ProductHighlights';
import ProductDescription from './ProductDescription';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);
  const currentPrice =
    (product.sizePrices && selectedSize && product.sizePrices[selectedSize]) ||
    product.price;
  const totalPrice = currentPrice * quantity;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      showToast('Please select a size before adding to cart', 'warning');
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      showToast('Please select a size to proceed with Buy Now', 'warning');
      return;
    }
    // Add to cart and navigate straight to checkout
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard! 📋', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Category & Badge header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
          {product.badge && <Badge text={product.badge} size="xs" />}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'text-rose-600 bg-rose-50'
                : 'text-gray-500 hover:text-rose-600 hover:bg-gray-100'
            }`}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
          {product.name}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {product.shortDescription}
        </p>
      </div>

      {/* Rating Bar */}
      <div className="flex items-center gap-3">
        <StarRating
          rating={product.rating}
          count={product.reviewsCount}
          size="md"
        />
        <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
          Top Rated
        </span>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black text-gray-950">
            ₹{currentPrice}
          </span>
          {product.mrp && product.mrp > currentPrice && (
            <span className="text-base sm:text-lg text-gray-400 line-through">
              ₹{product.mrp}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-sm font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500">
          Inclusive of all taxes • Free Delivery on this item
        </p>

        {/* Special Offer Box */}
        {product.specialOffer && (
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
            <Tag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 block">
                Special Payment Offer Available
              </span>
              <span className="text-amber-800 font-medium">
                {product.specialOffer}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Size Selection Section */}
      <div className="pt-2">
        <SizeSelector
          sizes={product.sizes || []}
          sizePrices={product.sizePrices || {}}
          basePrice={product.price}
          selectedSize={selectedSize}
          onSelectSize={handleSizeSelect}
          hasError={sizeError}
        />
      </div>

      {/* Quantity Selector */}
      <div className="pt-1 flex items-center justify-between">
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          min={1}
          max={10}
        />
        {quantity > 1 && (
          <span className="text-xs font-semibold text-gray-600">
            Total: <span className="font-bold text-gray-900">₹{totalPrice}</span>
          </span>
        )}
      </div>

      {/* Action Buttons: Desktop & Inline */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-brand-50 text-brand-800 border-2 border-brand-700 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md active:scale-98"
        >
          <ShoppingBag className="w-4 h-4" />
          Add To Cart
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 hover:from-brand-800 hover:to-brand-950 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98"
        >
          <Zap className="w-4 h-4 text-gold-400 fill-gold-400" />
          Buy Now
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-center">
        <div className="flex flex-col items-center">
          <Truck className="w-4 h-4 text-emerald-600 mb-1" />
          <span className="text-[11px] font-bold text-gray-800">Free Delivery</span>
          <span className="text-[10px] text-gray-400">All India</span>
        </div>
        <div className="flex flex-col items-center border-x border-gray-100">
          <RotateCcw className="w-4 h-4 text-brand-600 mb-1" />
          <span className="text-[11px] font-bold text-gray-800">7-Day Returns</span>
          <span className="text-[10px] text-gray-400">Easy Doorstep</span>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-4 h-4 text-sky-600 mb-1" />
          <span className="text-[11px] font-bold text-gray-800">100% Genuine</span>
          <span className="text-[10px] text-gray-400">Direct from Maker</span>
        </div>
      </div>

      {/* Seller Section */}
      <SellerCard
        sellerName={product.seller}
        sellerRating={product.sellerRating}
        sellerFollowers={product.sellerFollowers}
        sellerProductsCount={product.sellerProductsCount}
      />

      {/* Highlights Section */}
      <ProductHighlights highlights={product.highlights} />

      {/* Description Section */}
      <ProductDescription
        description={product.description}
        details={product.details}
      />

      {/* Sticky Bottom Action Bar for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 sm:hidden shadow-lg flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-3 rounded-xl bg-white text-brand-800 border-2 border-brand-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-98"
        >
          <ShoppingBag className="w-4 h-4" />
          Add To Cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-3 px-3 rounded-xl bg-brand-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-98 shadow-md"
        >
          <Zap className="w-4 h-4 text-gold-400 fill-gold-400" />
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
