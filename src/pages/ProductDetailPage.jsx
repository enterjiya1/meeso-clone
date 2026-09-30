import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductInfo from '../components/product/ProductInfo';
import Reviews from '../components/product/Reviews';
import RelatedProducts from '../components/product/RelatedProducts';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">
          The ethnic wear design you are looking for may be out of stock or does not exist.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-800 text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto no-scrollbar py-1">
        <Link to="/" className="hover:text-brand-700 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-brand-700 whitespace-nowrap"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout: Left Gallery + Right Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Image Gallery */}
        <div className="lg:col-span-7">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Right: Product Information & Purchase Actions */}
        <div className="lg:col-span-5">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-4">
        <Reviews
          rating={product.rating}
          reviewsCount={product.reviewsCount}
          reviews={product.reviews || []}
        />
      </div>

      {/* Related Products Section */}
      <div className="pt-4">
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
          products={PRODUCTS}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
