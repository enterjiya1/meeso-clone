import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Search, Heart, ShoppingBag, Package, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { MeeshoLogo } from './BrandIcons';
import LanguageModal from './LanguageModal';
import SearchOverlay from './SearchOverlay';
import WishlistDrawer from './WishlistDrawer';
import CartDrawer from './CartDrawer';
import OrdersDrawer from './OrdersDrawer';

export const AppHeader = ({ title = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const { ordersCount } = useOrders();

  const isDetail = location.pathname.startsWith('/product');

  // Modals / Drawers state
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  return (
    <>
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-3 sm:px-4 py-2.5 flex items-center justify-between h-13 shadow-2xs">
        {/* Left Action: Official Meesho Logo and Brand Name */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {isDetail && (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-1 -ml-1 text-gray-800 hover:text-gray-950 active:scale-95 cursor-pointer"
              aria-label="Back to Kurtis"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
          )}

          {/* Official Meesho Brand Logo */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 cursor-pointer active:scale-98 transition-transform"
            aria-label="Meeso Home"
          >
            <MeeshoLogo className="h-6 sm:h-7" />
          </button>

          {title && (
            <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate max-w-[130px] sm:max-w-xs border-l border-gray-200 pl-2 hidden sm:inline-block">
              {title}
            </span>
          )}
        </div>

        {/* Right Icons: All fully functional & clickable! */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* 1. Language "अ/A" badge - opens Language Modal */}
          <button
            type="button"
            onClick={() => setLangModalOpen(true)}
            className="w-5 h-5 rounded flex items-center justify-center text-[11px] font-black text-[#931b6e] bg-fuchsia-50 border border-fuchsia-200 select-none hover:bg-fuchsia-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Change Language"
            title="Language"
          >
            <span>अ</span>
            <span className="text-[9px]">A</span>
          </button>

          {/* 2. Search - opens Search Overlay */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="text-gray-800 hover:text-[#931b6e] active:scale-95 transition-transform cursor-pointer p-0.5"
            aria-label="Search"
            title="Search Sarees & Kurtis"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Admin Dashboard */}
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="text-gray-800 hover:text-[#931b6e] active:scale-95 transition-transform cursor-pointer p-0.5"
            aria-label="Admin Dashboard"
            title="Admin Orders & Payments Panel"
          >
            <ShieldCheck className="w-5 h-5 stroke-[1.8] text-gray-700 hover:text-[#931b6e]" />
          </button>

          {/* 3. My Orders - opens Orders & Tracking Drawer */}
          <button
            type="button"
            onClick={() => setOrdersOpen(true)}
            className="text-gray-800 hover:text-[#931b6e] relative active:scale-95 transition-transform cursor-pointer p-0.5"
            aria-label="My Orders"
            title="My Orders & Tracking"
          >
            <Package className="w-5 h-5 stroke-[1.8]" />
            {ordersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#038d63] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {ordersCount}
              </span>
            )}
          </button>

          {/* 4. Wishlist - opens Wishlist Drawer */}
          <button
            type="button"
            onClick={() => setWishlistOpen(true)}
            className="text-gray-800 hover:text-rose-600 relative active:scale-95 transition-transform cursor-pointer p-0.5"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 5. Cart - opens Cart Drawer */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="text-gray-800 hover:text-[#931b6e] relative active:scale-95 transition-transform cursor-pointer p-0.5"
            aria-label="Cart"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#931b6e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Modals and Drawers */}
      <LanguageModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
      />

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <OrdersDrawer
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
};

export default AppHeader;
