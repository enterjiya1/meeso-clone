import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';

export const CartPage = () => {
  const { cart, cartCount, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Your Shopping Bag is Empty</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Looks like you haven't added any gorgeous ethnic wear items to your bag yet. Explore our latest arrivals!
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <span className="text-xs font-bold bg-brand-50 text-brand-800 px-2.5 py-0.5 rounded-full">
            {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Bag
        </button>
      </div>

      {/* Cart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-3.5">
          {cart.map((item) => (
            <CartItem key={item.cartItemId} item={item} />
          ))}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 sticky top-28">
          <OrderSummary showCheckoutBtn />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
