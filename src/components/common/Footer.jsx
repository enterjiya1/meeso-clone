import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      {/* Trust Badges Bar */}
      <div className="border-b border-gray-100 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-100">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Free Shipping</h4>
                <p className="text-xs text-gray-500 mt-0.5">On all orders above ₹499</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-100">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">7 Days Return</h4>
                <p className="text-xs text-gray-500 mt-0.5">Hassle-free doorstep exchange</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">100% Genuine</h4>
                <p className="text-xs text-gray-500 mt-0.5">Verified Indian craft artisans</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-100">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Secure Payments</h4>
                <p className="text-xs text-gray-500 mt-0.5">UPI, Cards & Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-800 to-brand-600 flex items-center justify-center text-white font-serif font-black text-lg shadow-sm">
                E
              </div>
              <span className="font-serif font-black tracking-widest text-xl text-gray-900 uppercase">
                ETHNICORA
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              ETHNICORA celebrates the timeless grandeur of authentic Indian textiles, embroideries, and silhouettes. Every design is crafted with passion for the modern Indian woman.
            </p>
            <div className="pt-2 text-xs text-gray-600 space-y-1.5">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-600" /> support@ethnicora.in
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-600" /> +91 98765 43210 (10 AM - 7 PM)
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> Surat & Jaipur Textile Hubs, India
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Categories
            </h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/products?category=Kurtis" className="hover:text-brand-700 transition-colors">Kurtis & Tunics</Link></li>
              <li><Link to="/products?category=Kurta+Sets" className="hover:text-brand-700 transition-colors">Kurta Pant Sets</Link></li>
              <li><Link to="/products?category=Sarees" className="hover:text-brand-700 transition-colors">Banarasi & Silk Sarees</Link></li>
              <li><Link to="/products?category=Lehengas" className="hover:text-brand-700 transition-colors">Festive Lehengas</Link></li>
              <li><Link to="/products?category=Gowns+%26+Dresses" className="hover:text-brand-700 transition-colors">Anarkali Gowns</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Quick Links
            </h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/products" className="hover:text-brand-700 transition-colors">All Collections</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-700 transition-colors">My Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-brand-700 transition-colors">Shopping Cart</Link></li>
              <li><a href="#size-guide" onClick={(e) => { e.preventDefault(); alert("Standard Indian Sizing: S (36), M (38), L (40), XL (42), XXL (44), XXXL (46)"); }} className="hover:text-brand-700 transition-colors">Size Guide</a></li>
              <li><a href="#track-order" onClick={(e) => { e.preventDefault(); alert("Order tracking is automatically updated once your order is placed!"); }} className="hover:text-brand-700 transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Stay in Touch
            </h5>
            <p className="text-xs text-gray-500 mb-3">
              Subscribe to receive exclusive festive discounts and latest arrivals.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to ETHNICORA updates!"); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-brand-600"
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 ETHNICORA Fashion Retail India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-600 cursor-pointer">Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
