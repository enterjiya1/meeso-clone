import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ethnicora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('ethnicora_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Calculate totals
  const { cartCount, subtotal, mrpTotal, savings } = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const qty = item.quantity || 1;
        const price = item.unitPrice || item.product.price;
        const mrp = item.product.mrp || price;

        acc.cartCount += qty;
        acc.subtotal += price * qty;
        acc.mrpTotal += mrp * qty;
        acc.savings += (mrp - price) * qty;
        return acc;
      },
      { cartCount: 0, subtotal: 0, mrpTotal: 0, savings: 0 }
    );
  }, [cart]);

  // Coupon logic
  const couponDiscount = useMemo(() => {
    if (!couponApplied || subtotal === 0) return 0;
    if (couponCode.toUpperCase() === 'ETHNIC10') {
      return Math.round(subtotal * 0.1); // 10% off
    }
    if (couponCode.toUpperCase() === 'SAVE50') {
      return Math.min(50, subtotal);
    }
    return 0;
  }, [couponApplied, couponCode, subtotal]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0 || subtotal >= 499) return 0;
    return 49;
  }, [subtotal]);

  const totalPayable = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - couponDiscount + deliveryFee);
  }, [subtotal, couponDiscount, deliveryFee]);

  const addToCart = useCallback(
    (product, size, quantity = 1) => {
      if (!size) {
        showToast('Please select a size before adding to cart', 'warning');
        return false;
      }

      // Check unit price based on size if specified in sizePrices
      const unitPrice = (product.sizePrices && product.sizePrices[size]) || product.price;
      const cartItemId = `${product.id}-${size}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(newQty, 10),
            unitPrice
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              cartItemId,
              productId: product.id,
              product,
              size,
              quantity,
              unitPrice
            }
          ];
        }
      });

      showToast(`Added ${product.name.slice(0, 20)}... (Size: ${size}) to Cart! 🛍️`, 'success');
      return true;
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (cartItemId, newQuantity) => {
      if (newQuantity < 1) return;
      setCart((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.min(newQuantity, 10) }
            : item
        )
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (cartItemId) => {
      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
      showToast('Item removed from cart', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponApplied(false);
    setCouponCode('');
  }, []);

  const applyCoupon = useCallback(
    (code) => {
      const clean = code.trim().toUpperCase();
      if (clean === 'ETHNIC10' || clean === 'SAVE50') {
        setCouponCode(clean);
        setCouponApplied(true);
        showToast(`Coupon "${clean}" applied successfully! 🎉`, 'success');
        return true;
      } else {
        showToast('Invalid coupon code. Try "ETHNIC10"', 'error');
        return false;
      }
    },
    [showToast]
  );

  const removeCoupon = useCallback(() => {
    setCouponApplied(false);
    setCouponCode('');
    showToast('Coupon removed', 'info');
  }, [showToast]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        mrpTotal,
        savings,
        couponDiscount,
        deliveryFee,
        totalPayable,
        couponCode,
        couponApplied,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
