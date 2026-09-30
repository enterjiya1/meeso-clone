import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export const ProductImageGallery = ({ images = [], productName = "Product" }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
  ];
  const galleryImages = images && images.length > 0 ? images : fallbackImages;
  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:sticky lg:top-28">
      {/* Thumbnail Strip: Vertical on Desktop, Horizontal on Mobile */}
      <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto no-scrollbar py-1 lg:py-0 shrink-0 lg:w-20">
        {galleryImages.map((img, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all w-16 h-20 lg:w-20 lg:h-24 shrink-0 bg-gray-100 focus:outline-hidden ${
                isSelected
                  ? 'border-brand-700 ring-2 ring-brand-200 shadow-sm'
                  : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>

      {/* Main Image Viewport */}
      <div className="flex-1 relative">
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          className="relative aspect-[3/4] bg-gray-100 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-sm cursor-crosshair select-none"
        >
          {/* Main Image */}
          <img
            src={currentImage}
            alt={`${productName} - view ${selectedIndex + 1}`}
            className={`w-full h-full object-cover object-top transition-transform duration-200 ${
              isZoomed ? 'scale-150 origin-center' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                  }
                : undefined
            }
          />

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter Badge */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
            {selectedIndex + 1} / {galleryImages.length}
          </div>

          {/* Zoom Indicator */}
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-xs text-gray-700 p-1.5 rounded-full shadow-xs pointer-events-none hidden sm:flex items-center gap-1 text-[11px] font-medium">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Hover to zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
