import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Info,
  ShoppingCart,
  FastForward,
  Plus,
  Store,
  X
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import AppHeader from '../components/common/AppHeader';
import OnlinePaymentModal from '../components/checkout/OnlinePaymentModal';
import { TricolorRibbon } from '../components/common/BrandIcons';
import { getOptimizedImageUrl, FALLBACK_IMAGE } from '../utils/imageOptimizer';

export const KurtiDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];

  // Multi-image gallery state for all product photos from CSV
  const images = (product.galleryImages && product.galleryImages.length > 0)
    ? product.galleryImages
    : [product.detailImage || product.image];

  const carouselRef = useRef(null);
  const lightboxCarouselRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Variant & Image State
  const [selectedVariant, setSelectedVariant] = useState(
    product.similarProducts && product.similarProducts[0] ? product.similarProducts[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  // Reset active image when product id changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(null);
    setSelectedVariant(product.similarProducts && product.similarProducts[0] ? product.similarProducts[0] : null);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0 });
    }
  }, [id, product]);

  // Synchronize lightbox scroll position when opened
  useEffect(() => {
    if (lightboxOpen) {
      const timer = setTimeout(() => {
        if (lightboxCarouselRef.current) {
          const w = lightboxCarouselRef.current.clientWidth;
          lightboxCarouselRef.current.scrollTo({
            left: activeImageIndex * w,
            behavior: 'instant'
          });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [lightboxOpen]);

  // Real native carousel horizontal scroll event handler for main page
  const handleCarouselScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const clientWidth = e.target.clientWidth;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex >= 0 && newIndex < images.length && newIndex !== activeImageIndex) {
        setActiveImageIndex(newIndex);
      }
    }
  };

  // Real native carousel horizontal scroll event handler for fullscreen lightbox
  const handleLightboxScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const clientWidth = e.target.clientWidth;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex >= 0 && newIndex < images.length && newIndex !== activeImageIndex) {
        setActiveImageIndex(newIndex);
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            left: newIndex * carouselRef.current.clientWidth,
            behavior: 'auto'
          });
        }
      }
    }
  };

  // Smoothly scroll to a specific image index in main view
  const scrollToIndex = (index) => {
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    setActiveImageIndex(clamped);
    if (carouselRef.current) {
      const clientWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: clamped * clientWidth,
        behavior: 'smooth'
      });
    }
  };

  // Smoothly scroll to a specific image index in fullscreen lightbox
  const scrollLightboxToIndex = (index) => {
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    setActiveImageIndex(clamped);
    if (lightboxCarouselRef.current) {
      const clientWidth = lightboxCarouselRef.current.clientWidth;
      lightboxCarouselRef.current.scrollTo({
        left: clamped * clientWidth,
        behavior: 'smooth'
      });
    }
    if (carouselRef.current) {
      const clientWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: clamped * clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const nextImage = () => {
    const target = activeImageIndex < images.length - 1 ? activeImageIndex + 1 : 0;
    scrollToIndex(target);
  };

  const prevImage = () => {
    const target = activeImageIndex > 0 ? activeImageIndex - 1 : images.length - 1;
    scrollToIndex(target);
  };

  const nextLightboxImage = () => {
    const target = activeImageIndex < images.length - 1 ? activeImageIndex + 1 : 0;
    scrollLightboxToIndex(target);
  };

  const prevLightboxImage = () => {
    const target = activeImageIndex > 0 ? activeImageIndex - 1 : images.length - 1;
    scrollLightboxToIndex(target);
  };

  // Touch swipe gesture handlers for fullscreen lightbox
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndXRef.current = e.changedTouches[0].clientX;
      const deltaX = touchStartXRef.current - touchEndXRef.current;
      if (Math.abs(deltaX) > 40) {
        if (deltaX > 0) {
          nextLightboxImage();
        } else {
          prevLightboxImage();
        }
      }
    }
  };

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showPriceInfoModal, setShowPriceInfoModal] = useState(false);
  const [showSimilarSheet, setShowSimilarSheet] = useState(false);

  const isFav = isInWishlist(product.id);
  const currentImage = selectedVariant?.mainImg || product.detailImage || product.image;
  const displayPrice = selectedSize ? selectedSize.price : product.price;

  const handleSizeClick = (sizeObj) => {
    setSelectedSize(sizeObj);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    let sizeToUse = selectedSize;
    if (!sizeToUse) {
      sizeToUse = product.sizes?.find((s) => s.size === 'M') || product.sizes?.[0] || { size: 'Free Size', price: product.price };
      setSelectedSize(sizeToUse);
    }
    addToCart(product, sizeToUse.size, 1);
  };

  const handleBuyNow = () => {
    let sizeToUse = selectedSize;
    if (!sizeToUse) {
      sizeToUse = product.sizes?.find((s) => s.size === 'M') || product.sizes?.[0] || { size: 'Free Size', price: product.price };
      setSelectedSize(sizeToUse);
    }
    setShowPaymentModal(true);
  };

  const handleCopyHighlights = () => {
    const text = Object.entries(product.highlights || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    showToast('Product highlights copied to clipboard! 📋', 'info');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! 🔗', 'info');
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-24 md:pb-12">
      {/* Top Header matching Screenshot 2 */}
      <AppHeader />

      {/* Main Container - Responsive on Mobile, Tablet & Desktop */}
      <div className="max-w-5xl mx-auto px-0 sm:px-4 md:px-6 py-0 sm:py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 items-start">
          {/* Left Column: Image Viewport + Thumbnails */}
          <div className="md:col-span-6 lg:col-span-6 md:sticky md:top-16">
            {/* Main Image Viewport with Meesho styling & 3:4 portrait aspect ratio */}
            <div className="relative w-full aspect-[3/4] max-h-[580px] md:rounded-2xl overflow-hidden border-b sm:border border-gray-100 bg-neutral-100 group">
              {/* Real Native Horizontal CSS Scroll-Snap Carousel (Meesho style swipe & slide) */}
              <div
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehaviorX: 'contain'
                }}
              >
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full shrink-0 snap-center relative flex items-center justify-center bg-neutral-50 cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={getOptimizedImageUrl(imgUrl, 650)}
                      alt={`${product.name} - photo ${idx + 1}`}
                      className="w-full h-full object-contain sm:object-cover object-top select-none pointer-events-none"
                      loading={idx === 0 ? "eager" : "lazy"}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                  </div>
                ))}
              </div>

              {/* Previous / Next Desktop & Tablet Arrow Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black z-10 active:scale-95 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-auto"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black z-10 active:scale-95 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-auto"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Floating Image Counter Badge (e.g. 1/8) Bottom-Right */}
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm pointer-events-none z-10">
                <span>{activeImageIndex + 1}/{images.length}</span>
              </div>

              {/* Tap to Zoom indicator Top-Right */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all z-10 cursor-pointer pointer-events-auto"
                title="Tap to zoom"
                aria-label="Zoom image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* "+ More Like This" floating pill button */}
              <button
                type="button"
                onClick={() => setShowSimilarSheet(true)}
                className="absolute bottom-3 left-3 bg-white/95 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 active:scale-95 transition-transform cursor-pointer z-10 pointer-events-auto"
              >
                <div className="w-3.5 h-3.5 border border-gray-400 rounded flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5 text-gray-700" />
                </div>
                <span>More Like This</span>
              </button>
            </div>

            {/* Horizontal Scrollable Thumbnails Strip showing all saree part photos (Meesho style) */}
            {images.length > 1 && (
              <div className="py-2.5 px-3 sm:px-0">
                <div className="flex items-center justify-between pb-1.5 text-xs text-gray-600 font-medium">
                  <span>Product Photos ({images.length})</span>
                  <span className="text-[11px] text-gray-400">Swipe or click to view details</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {images.map((imgUrl, idx) => {
                    const isActive = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToIndex(idx)}
                        className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-neutral-100 ${
                          isActive
                            ? 'border-[#931b6e] ring-2 ring-[#931b6e]/30 scale-102 shadow-xs'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                        aria-label={`View photo ${idx + 1}`}
                      >
                        <img
                          src={getOptimizedImageUrl(imgUrl, 180)}
                          alt={`${product.name} part ${idx + 1}`}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-[9px] text-white px-1 rounded font-medium">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Similar Products / Color Variants section */}
            {product.similarProducts && product.similarProducts.length > 0 && (
              <div className="px-4 sm:px-0 py-2 border-b md:border-b-0 border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  {product.similarProducts.length} Similar Products / Colors
                </p>
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {product.similarProducts.map((sim, idx) => {
                    const isSelected = Number(id) === sim.id;
                    return (
                      <button
                        key={sim.id || idx}
                        type="button"
                        onClick={() => {
                          if (sim.id !== Number(id)) {
                            navigate(`/product/${sim.id}`);
                          }
                        }}
                        className={`w-14 h-18 rounded-md overflow-hidden border-2 shrink-0 bg-gray-100 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#931b6e] ring-1 ring-[#931b6e]'
                            : 'border-transparent opacity-85 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={getOptimizedImageUrl(sim.image, 180)}
                          alt={sim.color}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          className="w-full h-full object-cover object-top"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Prices, Offers, Sizes, Highlights, Actions */}
          <div className="md:col-span-6 lg:col-span-6 space-y-0">
            {/* Title & Wishlist/Share Row */}
            <div className="p-4 sm:p-2 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-sm sm:text-base font-normal text-gray-800 leading-snug flex-1">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 shrink-0 pt-0.5">
                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="flex flex-col items-center text-gray-600 hover:text-rose-600 transition-colors cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFav ? 'fill-[#931b6e] text-[#931b6e]' : 'stroke-[1.6]'
                      }`}
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5">Wishlist</span>
                  </button>

                  {/* Share */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex flex-col items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5 stroke-[1.6]" />
                    <span className="text-[10px] text-gray-500 mt-0.5">Share</span>
                  </button>
                </div>
              </div>

              {/* Price Row matching Screenshot 2: ₹466  501 7% off  onwards ⓘ */}
              <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
                <span className="text-2xl sm:text-3xl font-bold text-gray-950">
                  ₹{displayPrice}
                </span>
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  {product.mrp}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[#038d63]">
                  {product.discount}% off
                </span>
                <button
                  type="button"
                  onClick={() => setShowPriceInfoModal(true)}
                  className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-0.5 cursor-pointer ml-1"
                >
                  <span>onwards</span>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>

              {/* UPI Offer Banner with Indian Tricolor Ribbon */}
              <div
                onClick={() => setShowPaymentModal(true)}
                className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-100/60 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TricolorRibbon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold text-gray-800">
                    UPI Offer applied for you!
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#038d63] bg-emerald-50 px-2 py-0.5 rounded">
                  Save ₹6
                </span>
              </div>

              {/* Rating Row: Shop 4.3 ★ (373) */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
                <span className="text-gray-500 text-xs">Shop</span>
                <div className="inline-flex items-center gap-0.5 bg-[#038d63] text-white font-bold px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                  <span>{product.rating}</span>
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                </div>
                <span className="text-gray-400">({product.reviewsCount.toLocaleString()})</span>
              </div>
            </div>

            {/* Gray Divider Bar matching screenshot 3 */}
            <div className="h-2 bg-[#f4f4f6] my-2" />

            {/* Select Size Section matching screenshot 3 */}
            <div className="p-4 sm:p-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Select Size</h2>
                {sizeError && !selectedSize && (
                  <span className="text-xs font-bold text-rose-600 animate-pulse">
                    Please select a size
                  </span>
                )}
              </div>

              {/* Oval Pill Buttons in 2 Rows matching screenshot 3 */}
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((szObj) => {
                  const isSelected = selectedSize?.size === szObj.size;
                  return (
                    <button
                      key={szObj.size}
                      type="button"
                      onClick={() => handleSizeClick(szObj)}
                      className={`flex flex-col items-center justify-center py-2 px-4 rounded-full border transition-all min-w-[66px] cursor-pointer ${
                        isSelected
                          ? 'border-[#931b6e] bg-[#fbf2f7] text-[#931b6e] ring-1 ring-[#931b6e]'
                          : 'border-gray-300 text-gray-800 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <span className="text-xs font-bold leading-tight">{szObj.size}</span>
                      <span className="text-[10px] text-gray-500 mt-0.5">₹{szObj.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gray Divider Bar */}
            <div className="h-2 bg-[#f4f4f6] my-2" />

            {/* Sold By Section matching screenshot 3 */}
            <div
              onClick={() => setShowSellerModal(true)}
              className="p-4 sm:p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1967d2] flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-[#1967d2] bg-[#e8f0fe] px-1.5 py-0.5 rounded">
                      Sold By
                    </span>
                    <span className="text-xs font-bold text-gray-900">{product.seller}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="inline-flex items-center gap-0.5 bg-[#038d63] text-white font-bold px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                      <span>{product.sellerRating}</span>
                      <Star className="w-2 h-2 fill-white text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            {/* Gray Divider Bar */}
            <div className="h-2 bg-[#f4f4f6] my-2" />

            {/* Product Highlights Section matching screenshot 3 */}
            <div className="p-4 sm:p-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Product Highlights</h2>
                <button
                  type="button"
                  onClick={handleCopyHighlights}
                  className="text-xs font-bold text-[#931b6e] hover:text-[#771f34] uppercase tracking-wider cursor-pointer"
                >
                  COPY
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                {Object.entries(product.highlights || {}).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-gray-400 block text-[11px] capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-3 pt-4 px-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-4 rounded-xl bg-white border-2 border-[#931b6e] text-[#931b6e] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#fbf2f7] active:scale-98 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-[#931b6e]" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#931b6e] hover:bg-[#771f34] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <FastForward className="w-4 h-4 fill-white" />
                <span>Buy Now (Online Payment)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Buttons on Mobile matching screenshots 2 & 3 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-2.5 flex items-center gap-3 shadow-lg md:hidden">
        {/* Add to Cart: White with purple border & text */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-4 rounded-xl bg-white border-2 border-[#931b6e] text-[#931b6e] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-[#931b6e]" />
          <span>Add to Cart</span>
        </button>

        {/* Buy Now: Solid purple with white text */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-3 px-4 rounded-xl bg-[#931b6e] hover:bg-[#771f34] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-md cursor-pointer"
        >
          <FastForward className="w-4 h-4 fill-white" />
          <span>Buy Now</span>
        </button>
      </div>

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <OnlinePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          product={product}
          selectedSize={selectedSize}
          price={displayPrice}
          quantity={1}
        />
      )}

      {/* Seller Profile Modal */}
      {showSellerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl relative space-y-3 animate-slide-up">
            <button
              onClick={() => setShowSellerModal(false)}
              className="absolute top-3 right-3 text-gray-400 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <Store className="w-6 h-6 text-[#931b6e]" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">{product.seller}</h3>
                <p className="text-[11px] text-[#038d63] font-semibold">Verified Partner Seller</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Rating:</span>
                <strong className="text-[#038d63]">{product.sellerRating} ★</strong>
              </div>
              <div className="flex justify-between">
                <span>Followers:</span>
                <span>{product.sellerFollowers || '28.4k'}</span>
              </div>
              <div className="flex justify-between">
                <span>Dispatch:</span>
                <span className="font-medium text-gray-900">Within 24 Hours</span>
              </div>
            </div>
            <button
              onClick={() => setShowSellerModal(false)}
              className="w-full py-2 bg-[#931b6e] text-white font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Price Info Modal */}
      {showPriceInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl relative space-y-3 animate-slide-up text-xs">
            <button
              onClick={() => setShowPriceInfoModal(false)}
              className="absolute top-3 right-3 text-gray-400 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-sm text-gray-900">Price Breakdown</h3>
            <div className="space-y-1.5 text-gray-600">
              <div className="flex justify-between">
                <span>Maximum Retail Price (MRP):</span>
                <span>₹{product.mrp}</span>
              </div>
              <div className="flex justify-between text-[#038d63]">
                <span>Discount Applied:</span>
                <span>-₹{product.mrp - product.price}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-950 pt-1 border-t">
                <span>Final Price:</span>
                <span>₹{product.price}</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-400">
              Inclusive of all taxes. Free delivery on this item.
            </p>
          </div>
        </div>
      )}

      {/* Full-screen Lightbox Modal for HD saree photo inspection */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 select-none animate-fade-in">
          <div className="flex items-center justify-between text-white pb-2 border-b border-white/10">
            <span className="text-sm font-medium truncate max-w-[80%]">
              {activeImageIndex + 1} of {images.length} - {product.name}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative w-full h-full flex items-center justify-center overflow-hidden my-2">
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer z-20 shadow-lg border border-white/20 active:scale-95 transition-all"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Native Horizontal Scroll-Snap Container with Touch Swipe Gesture Tracking */}
            <div
              ref={lightboxCarouselRef}
              onScroll={handleLightboxScroll}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain'
              }}
            >
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="w-full h-full shrink-0 snap-center flex items-center justify-center p-2 sm:p-4 select-none"
                  style={{ minWidth: '100%', width: '100%' }}
                >
                  <img
                    src={getOptimizedImageUrl(imgUrl, 1000)}
                    alt={`${product.name} detail HD view ${idx + 1}`}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    className="max-h-[75vh] max-w-full w-auto h-auto object-contain select-none pointer-events-none rounded-lg"
                    loading={Math.abs(activeImageIndex - idx) <= 1 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer z-20 shadow-lg border border-white/20 active:scale-95 transition-all"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Touch Swipe Hint on Mobile */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-xs text-white/90 text-[11px] font-medium px-3 py-1 rounded-full pointer-events-none z-20 sm:hidden shadow-md">
                👈 Swipe to change photo 👉
              </div>
            )}
          </div>

          {/* Lightbox thumbnail row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/10 justify-center" style={{ WebkitOverflowScrolling: 'touch' }}>
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollLightboxToIndex(idx)}
                className={`w-12 h-16 rounded overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-white ring-2 ring-white/50 scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={getOptimizedImageUrl(img, 180)}
                  alt=""
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* More Like This Bottom Sheet */}
      {showSimilarSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl relative space-y-4 max-h-[80vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-sm text-gray-900">More Sarees Like This</h3>
              <button
                onClick={() => setShowSimilarSheet(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1">
              {PRODUCTS.filter((p) => p.id !== product.id).slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setShowSimilarSheet(false);
                    navigate(`/product/${item.id}`);
                  }}
                  className="p-2 border border-gray-100 rounded-2xl hover:border-[#931b6e] transition-colors cursor-pointer"
                >
                  <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl">
                    <img
                      src={getOptimizedImageUrl(item.image, 300)}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate mt-1">{item.name}</p>
                  <p className="text-xs font-black text-gray-950 mt-0.5">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KurtiDetailPage;
