// High-performance image URL optimizer for Shopify CDN images
// Drastically speeds up page loading on mobile 4G/5G connections by resizing 3.5MB PNGs to optimized widths

export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url || typeof url !== 'string') return '';
  
  // Shopify CDN auto-resizing
  if (url.includes('cdn.shopify.com')) {
    if (url.includes('width=')) {
      return url.replace(/width=\d+/, `width=${width}`);
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}`;
  }
  
  return url;
};

// Fallback high-quality saree image placeholder if network stalls
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
