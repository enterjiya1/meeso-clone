import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { cartItemId, product, size, quantity, unitPrice } = item;

  const itemTotal = unitPrice * quantity;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-gray-200 transition-colors">
      {/* Product Image & Info */}
      <div className="flex gap-4 items-center flex-1 min-w-0">
        <Link
          to={`/product/${product.id}`}
          className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 block group"
        >
          <img
            src={product.images && product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
          />
        </Link>

        <div className="flex-1 min-w-0 space-y-1">
          <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded uppercase">
            {product.category}
          </span>
          <Link
            to={`/product/${product.id}`}
            className="block text-sm font-bold text-gray-900 hover:text-brand-800 line-clamp-1 transition-colors"
          >
            {product.name}
          </Link>

          <div className="flex items-center gap-3 text-xs text-gray-500 pt-0.5">
            <span>
              Size: <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{size}</strong>
            </span>
            <span>•</span>
            <span>Color: <span className="capitalize text-gray-800">{product.color}</span></span>
          </div>

          <div className="pt-1 flex items-baseline gap-2">
            <span className="text-base font-extrabold text-gray-950">₹{unitPrice}</span>
            {product.mrp && product.mrp > unitPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Stepper & Price / Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {/* Quantity Controls */}
        <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
          <button
            type="button"
            onClick={() => updateQuantity(cartItemId, quantity - 1)}
            disabled={quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-bold text-xs text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(cartItemId, quantity + 1)}
            disabled={quantity >= 10}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[70px]">
          <span className="text-sm sm:text-base font-black text-gray-900 block">
            ₹{itemTotal}
          </span>
          <span className="text-[10px] text-gray-400">Total</span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeFromCart(cartItemId)}
          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
