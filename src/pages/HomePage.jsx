import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Award, Heart, Truck } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductGrid from '../components/product/ProductGrid';
import SortDropdown from '../components/filters/SortDropdown';

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Filter and sort products for homepage
  const displayedProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
      default:
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }

    return list;
  }, [selectedCategory, sortBy]);

  // Featured deal item (Product #1)
  const heroProduct = PRODUCTS[0];

  return (
    <div className="space-y-10 sm:space-y-12 pb-12">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-xl space-y-4 sm:space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/80 border border-brand-700/60 text-gold-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Festive Collection 2026
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight">
              Grace in Every <span className="text-gold-400 italic">Thread</span>
            </h1>

            <p className="text-sm sm:text-base text-brand-100/90 leading-relaxed font-normal">
              Discover authentic Indian craftsmanship — from trending embroidery kurti sets and Banarasi silk sarees to celebratory flared lehengas, straight from verified artisans.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-2">
              <Link
                to="/products"
                className="px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-brand-950 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
              >
                <span>Shop All Collections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={`/product/${heroProduct.id}`}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all border border-white/20 backdrop-blur-xs"
              >
                Trending Deal: ₹{heroProduct.price}
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-4 flex items-center justify-center md:justify-start gap-4 text-xs text-brand-200">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gold-400" /> Free Shipping
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-400" /> Cash on Delivery
              </span>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="w-full md:w-auto flex justify-center">
            <Link
              to={`/product/${heroProduct.id}`}
              className="relative group block w-64 sm:w-72 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 transform hover:scale-102 transition-transform duration-300"
            >
              <img
                src={heroProduct.images[0]}
                alt={heroProduct.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider">
                  Featured Best Seller
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {heroProduct.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-white">₹{heroProduct.price}</span>
                  <span className="text-xs text-gray-300 line-through">₹{heroProduct.mrp}</span>
                  <span className="text-xs font-bold text-emerald-400">{heroProduct.discount}% OFF</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Pills Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide">
            Explore Categories
          </h2>
          <Link
            to="/products"
            className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
          >
            View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Products Grid & Sort */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
                Trending Ethnic Collection
              </h2>
              <span className="text-xs font-semibold bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-full">
                {displayedProducts.length} Items
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Showing popular handcrafted kurtis, suits, sarees & lehengas
            </p>
          </div>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Responsive Product Grid: 4 cols Desktop, 3 Tablet, 2 Mobile */}
        <ProductGrid
          products={displayedProducts}
          emptyMessage="No products match the selected category. Try selecting 'All'."
        />
      </section>

      {/* Promotional Value Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-brand-800 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 bg-black/20 px-3 py-1 rounded-full">
              Limited Festive Discount
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black">
              Get Extra 10% Off on All Prepaid Orders
            </h3>
            <p className="text-xs sm:text-sm text-amber-50">
              Apply coupon <span className="font-mono font-bold bg-white text-brand-900 px-2 py-0.5 rounded">ETHNIC10</span> at checkout. Instant savings on UPI & cards.
            </p>
          </div>
          <Link
            to="/products"
            className="px-6 py-3 bg-white text-gray-950 hover:bg-gray-100 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-sm"
          >
            Claim Offer Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
