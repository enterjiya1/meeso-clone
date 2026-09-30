import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OrderContext = createContext();

const LOCAL_STORAGE_KEY = 'meeso_customer_orders';

// Audio chime generator using Web Audio API
export const playOrderNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.12);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.6);
  } catch (e) {
    // Audio might be blocked until user gesture, ignore safely
  }
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);

      // Also check legacy key if exists
      const legacy = localStorage.getItem('meesho_orders');
      if (legacy) return JSON.parse(legacy);

      return [];
    } catch (e) {
      return [];
    }
  });

  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isTrackedOrderNew, setIsTrackedOrderNew] = useState(false);

  // Cross-tab synchronization via BroadcastChannel & Storage Event
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('meeso_orders_sync_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_ORDERS') {
          const fresh = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (fresh) {
            setOrders(JSON.parse(fresh));
          }
        } else if (event.data?.type === 'NEW_ORDER_ALERT') {
          playOrderNotificationSound();
        }
      };
    } catch (e) {}

    const handleStorageChange = (e) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
    };
  }, []);

  // Save changes to localStorage and broadcast
  const persistOrders = useCallback((updatedOrders, isNewOrder = false) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOrders));
      // Cross-tab notification
      try {
        const channel = new BroadcastChannel('meeso_orders_sync_channel');
        channel.postMessage({ type: 'SYNC_ORDERS' });
        if (isNewOrder) {
          channel.postMessage({ type: 'NEW_ORDER_ALERT' });
        }
        channel.close();
      } catch (e) {}
    } catch (e) {}
  }, []);

  // Add new Customer Order
  const addOrder = (newOrder) => {
    const orderWithDetails = {
      ...newOrder,
      id: newOrder.orderId || `MEE-${Date.now().toString().slice(-6)}`,
      status: newOrder.status || 'Accepted', // Accepted | Packed | Shipped | Delivered | Cancelled
      paymentStatus: newOrder.paymentStatus || 'PAID (Verified Online)', // PAID (Verified Online) | Awaiting Verification | Failed
      placedAt: newOrder.placedAt || new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      deliveryDate:
        newOrder.deliveryDate ||
        new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      awbNumber: newOrder.awbNumber || `DEL${Math.floor(100000000 + Math.random() * 900000000)}`
    };

    setOrders((prev) => {
      const updated = [orderWithDetails, ...prev];
      persistOrders(updated, true);
      return updated;
    });

    setTrackedOrder(orderWithDetails);
    setIsTrackedOrderNew(true);
    playOrderNotificationSound();
    return orderWithDetails;
  };

  // Update Order Fulfillment Status (Accepted -> Packed -> Shipped -> Delivered)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.orderId === orderId || o.id === orderId ? { ...o, status: newStatus } : o
      );
      persistOrders(updated);
      return updated;
    });
  };

  // Update Payment Status
  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.orderId === orderId || o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o
      );
      persistOrders(updated);
      return updated;
    });
  };

  // Delete Order
  const deleteOrder = (orderId) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.orderId !== orderId && o.id !== orderId);
      persistOrders(updated);
      return updated;
    });
  };

  // Clear all demo orders
  const clearAllOrders = () => {
    setOrders([]);
    persistOrders([]);
  };

  const openTracking = (order, isNew = false) => {
    setTrackedOrder(order);
    setIsTrackedOrderNew(isNew);
  };

  const closeTracking = () => {
    setTrackedOrder(null);
    setIsTrackedOrderNew(false);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        ordersCount: orders.length,
        addOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        clearAllOrders,
        trackedOrder,
        isTrackedOrderNew,
        openTracking,
        closeTracking,
        playOrderNotificationSound
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
