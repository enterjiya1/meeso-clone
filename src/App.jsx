import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import ScrollToTop from './components/common/ScrollToTop';
import OrderTrackingModal from './components/checkout/OrderTrackingModal';

import KurtiListingPage from './pages/KurtiListingPage';
import KurtiDetailPage from './pages/KurtiDetailPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

// Global modal to display active order tracking from any place
const GlobalOrderTracker = () => {
  const { trackedOrder, isTrackedOrderNew, closeTracking } = useOrders();
  if (!trackedOrder) return null;

  return (
    <OrderTrackingModal
      isOpen={Boolean(trackedOrder)}
      onClose={closeTracking}
      order={trackedOrder}
      isJustPlaced={isTrackedOrderNew}
    />
  );
};

function App() {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
            <BrowserRouter>
              <ScrollToTop />
              {/* Fluid responsive layout across all screen sizes */}
              <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-fuchsia-100 selection:text-fuchsia-900">
                <Routes>
                  <Route path="/" element={<KurtiListingPage />} />
                  <Route path="/product/:id" element={<KurtiDetailPage />} />
                  <Route path="/admin" element={<AdminOrdersPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              {/* Global Order Confirmation & Shipping Tracking Modal */}
              <GlobalOrderTracker />
            </BrowserRouter>
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}

export default App;
