import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchBar from './SearchBar';
import { CATEGORIES } from '../../data/products';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'All Products', path: '/products' },
    { name: 'Kurtis', path: '/products?category=Kurtis' },
    { name: 'Kurta Sets', path: '/products?category=Kurta+Sets' },
    { name: 'Sarees', path: '/products?category=Sarees' },
    { name: 'Lehengas', path: '/products?category=Lehengas' },
    { name: 'Gowns', path: '/products?category=Gowns+%26+Dresses' },
  ];

  return (
    <>
      {/* Top Notification / Trust Bar */}
      <div className="bg-brand-900 text-brand-100 text-[11px] md:text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-4 border-b border-brand-800">
        <span className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          Free Shipping on Orders Above ₹499
        </span>
        <span className="hidden sm:inline text-brand-400">|</span>
        <span className="hidden sm:flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          Easy 7-Day Hassle-Free Returns
        </span>
        <span className="hidden md:inline text-brand-400">|</span>
        <span className="hidden md:flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          100% Genuine Handcrafted Ethnic Wear
        </span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Left: Mobile Hamburger & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-gray-700 hover:text-brand-700 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-brand-800 to-brand-600 flex items-center justify-center text-white font-serif font-black text-lg md:text-xl shadow-sm group-hover:scale-105 transition-transform">
                  E
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-black tracking-widest text-lg md:text-2xl text-gray-900 group-hover:text-brand-800 transition-colors uppercase">
                    ETHNICORA
                  </span>
                  <span className="text-[9px] md:text-[10px] tracking-widest text-brand-700 font-semibold -mt-1 uppercase">
                    Modern Ethnic Studio
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Search Bar */}
            <div className="hidden lg:block flex-1 max-w-lg mx-6">
              <SearchBar />
            </div>

            {/* Right: Actions (Wishlist, Cart, Account) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Mobile Search Icon Toggle */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="p-2 text-gray-700 hover:text-brand-700 hover:bg-gray-100 rounded-full lg:hidden transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-full transition-colors group"
                aria-label={`Wishlist, ${wishlistCount} items`}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-full transition-colors group"
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-700 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountModalOpen(!accountModalOpen)}
                  className="p-2 text-gray-700 hover:text-brand-700 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Account Quick Dropdown */}
                {accountModalOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold">
                        PR
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Welcome Guest</p>
                        <p className="text-xs text-gray-500">Shopping at ETHNICORA</p>
                      </div>
                    </div>
                    <div className="py-2 space-y-1">
                      <Link
                        to="/wishlist"
                        onClick={() => setAccountModalOpen(false)}
                        className="flex items-center justify-between px-2 py-2 text-xs font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-brand-600" /> My Wishlist
                        </span>
                        <span className="text-gray-400 font-bold">{wishlistCount}</span>
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setAccountModalOpen(false)}
                        className="flex items-center justify-between px-2 py-2 text-xs font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-brand-600" /> My Bag
                        </span>
                        <span className="text-gray-400 font-bold">{cartCount}</span>
                      </Link>
                    </div>
                    <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 text-center">
                      Fast, Secure 256-bit Encrypted Checkout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Dropdown row */}
          {mobileSearchOpen && (
            <div className="pb-3 pt-1 lg:hidden animate-fade-in">
              <SearchBar isMobile onCloseMobile={() => setMobileSearchOpen(false)} />
            </div>
          )}

          {/* Desktop Categories Sub-bar */}
          <nav className="hidden lg:flex items-center space-x-8 py-2.5 border-t border-gray-100 text-xs font-semibold tracking-wide uppercase">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-brand-700 border-b-2 border-brand-700 font-bold'
                      : 'text-gray-600 hover:text-brand-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-slide-up">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-brand-900 text-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-serif font-bold text-sm">
                  E
                </div>
                <span className="font-serif font-black tracking-wider text-lg">ETHNICORA</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Shop Categories
                </p>
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-gray-800 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  My Account
                </p>
                <div className="space-y-1">
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-brand-600" /> Wishlist ({wishlistCount})
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-brand-600" /> Shopping Cart ({cartCount})
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </div>

              <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 mt-4">
                <div className="flex items-center gap-2 text-brand-800 font-bold text-xs mb-1">
                  <Sparkles className="w-4 h-4 text-brand-600" /> Special Offer
                </div>
                <p className="text-xs text-brand-900 leading-relaxed">
                  Use coupon code <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-brand-200">ETHNIC10</span> for flat 10% off on all orders!
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 text-xs text-gray-500 text-center bg-gray-50">
              © 2026 ETHNICORA Fashion. All Rights Reserved.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
