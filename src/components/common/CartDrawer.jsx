import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Minus, Plus, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import OnlinePaymentModal from '../checkout/OnlinePaymentModal';

export const CartDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { cart, cartCount, subtotal, updateQuantity, removeFromCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Selected item for single-item checkout or fallback
  const firstItem = cart[0];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
        <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#931b6e]" />
              <h3 className="font-bold text-sm text-gray-900">
                Shopping Bag ({cartCount})
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-[1.2] text-gray-300" />
                <p className="font-semibold text-gray-700">Your bag is empty</p>
                <p className="text-[11px]">Add kurtis to your bag to proceed with online payment.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 rounded-2xl border border-gray-100 flex items-center gap-3 bg-white shadow-2xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-18 object-cover rounded-xl border shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-gray-500 text-[11px]">
                      Size: <strong className="text-[#931b6e]">{item.size}</strong>
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-black text-gray-950 text-sm">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-1.5 text-gray-400 hover:text-rose-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Online Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Delivery:</span>
                  <span className="font-bold uppercase text-[10px]">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-950 pt-1 border-t border-gray-200">
                  <span>Total Amount:</span>
                  <span className="text-[#931b6e]">₹{subtotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3.5 bg-[#931b6e] hover:bg-[#771f34] text-white rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Pay Online (COD not available at your location)</span>
              </button>

              <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Safe UPI & Card Payments
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Online Payment Modal */}
      {showPaymentModal && firstItem && (
        <OnlinePaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            onClose();
          }}
          product={firstItem.product}
          selectedSize={firstItem.size}
          price={subtotal}
          quantity={1}
        />
      )}
    </>
  );
};

export default CartDrawer;
