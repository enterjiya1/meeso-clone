import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const WishlistDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleMoveToCart = (item) => {
    addToCart(item, item.sizes ? item.sizes[0].size : 'M', 1);
    removeFromWishlist(item.id);
    showToast(`Moved ${item.name.slice(0, 20)}... to Cart!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h3 className="font-bold text-sm text-gray-900">
              My Wishlist ({wishlist.length})
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-gray-400">
              <Heart className="w-12 h-12 mx-auto stroke-[1.2] text-gray-300" />
              <p className="text-xs font-semibold text-gray-700">Your wishlist is empty</p>
              <p className="text-[11px]">Click the heart icon on any kurti to save it here.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-gray-100 flex items-center gap-3 bg-white shadow-2xs hover:border-gray-200 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => {
                    onClose();
                    navigate(`/product/${item.id}`);
                  }}
                  className="w-14 h-16 object-cover rounded-xl border shrink-0 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      onClose();
                      navigate(`/product/${item.id}`);
                    }}
                    className="text-xs font-bold text-gray-900 truncate cursor-pointer hover:text-[#931b6e]"
                  >
                    {item.name}
                  </h4>
                  <p className="text-xs font-black text-gray-950 mt-0.5">₹{item.price}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="px-2.5 py-1 bg-[#931b6e] text-white rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 active:scale-95"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Move to Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded-lg"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
