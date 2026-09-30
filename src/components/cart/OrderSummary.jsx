import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Tag, ArrowRight, Check, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const OrderSummary = ({ showCheckoutBtn = true }) => {
  const {
    subtotal,
    mrpTotal,
    savings,
    couponDiscount,
    deliveryFee,
    totalPayable,
    couponCode,
    couponApplied,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    applyCoupon(inputCode);
    setInputCode('');
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3">
        Price Details
      </h3>

      {/* Coupon Box */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 block">
          Apply Coupon Code
        </label>
        {couponApplied ? (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              "{couponCode}" Applied (Saved ₹{couponDiscount})
            </span>
            <button
              type="button"
              onClick={removeCoupon}
              className="text-emerald-700 hover:text-emerald-950 p-1"
              aria-label="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter ETHNIC10"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl uppercase outline-none focus:border-brand-700 font-semibold"
              />
              <Tag className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 hover:bg-brand-900 text-white rounded-xl text-xs font-bold uppercase transition-colors"
            >
              Apply
            </button>
          </form>
        )}
        <p className="text-[11px] text-gray-400">
          Tip: Use <span className="font-bold text-brand-700">ETHNIC10</span> for extra 10% discount
        </p>
      </div>

      {/* Line item breakdown */}
      <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-4">
        <div className="flex justify-between">
          <span>Total MRP:</span>
          <span>₹{mrpTotal}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Discount on MRP:</span>
            <span>-₹{savings}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Coupon Savings:</span>
            <span>-₹{couponDiscount}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Delivery Charges:</span>
          {deliveryFee === 0 ? (
            <span className="text-emerald-700 font-bold uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
              Free Delivery
            </span>
          ) : (
            <span>₹{deliveryFee}</span>
          )}
        </div>

        {/* Total row */}
        <div className="flex justify-between text-sm sm:text-base font-black text-gray-950 border-t border-gray-200 pt-3">
          <span>Total Payable:</span>
          <span className="text-brand-900">₹{totalPayable}</span>
        </div>

        {(savings > 0 || couponDiscount > 0) && (
          <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50/70 p-2 rounded-lg text-center">
            🎉 You are saving ₹{savings + couponDiscount} on this order!
          </p>
        )}
      </div>

      {/* Buttons */}
      {showCheckoutBtn && (
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            disabled={subtotal === 0}
            className="w-full py-3.5 bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/products"
            className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors block text-center"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Safe & Secure 256-bit SSL Checkout</span>
      </div>
    </div>
  );
};

export default OrderSummary;
