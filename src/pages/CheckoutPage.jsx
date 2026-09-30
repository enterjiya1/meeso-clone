import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Banknote,
  Smartphone,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import OrderSummary from '../components/cart/OrderSummary';
import {
  PAYMENT_CONFIG,
  createRazorpayPaymentLink,
  getRazorpayPaymentAmount,
} from '../data/paymentConfig';

export const CheckoutPage = () => {
  const { cart, totalPayable, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Ananya Sharma',
    phone: '9876543210',
    email: 'ananya.sharma@example.com',
    address: 'B-402, Lotus Greens, Park Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const razorpayAmount = getRazorpayPaymentAmount(totalPayable);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.pincode.trim()
    ) {
      showToast('Please fill all required delivery details', 'warning');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      navigate('/products');
      return;
    }

    if (paymentMethod === 'razorpay') {
      const orderId = `ETH-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(true);
      try {
        const paymentLink = await createRazorpayPaymentLink({
          amount: razorpayAmount,
          orderId,
          customer: {
            name: formData.fullName,
            phone: formData.phone,
            email: formData.email
          },
          description: `Ethnicora order ${orderId}`
        });
        sessionStorage.setItem(
          'ethnicora_pending_razorpay_payment',
          JSON.stringify({
            orderId,
            amount: razorpayAmount,
            paymentLinkId: paymentLink.id,
            shortUrl: paymentLink.shortUrl,
            customer: formData.fullName,
            createdAt: Date.now(),
            testMode: PAYMENT_CONFIG.razorpayTestMode
          })
        );
        showToast(`Opening Razorpay with ₹${razorpayAmount} filled automatically.`, 'info');
        window.location.assign(paymentLink.shortUrl);
      } catch (error) {
        setIsSubmitting(false);
        showToast(error.message, 'error');
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `ETH-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderDetails = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
          'en-IN',
          { day: 'numeric', month: 'short', year: 'numeric' }
        ),
        total: totalPayable,
        items: [...cart],
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        paymentMethod:
          paymentMethod === 'upi'
            ? 'UPI (Google Pay / PhonePe)'
            : paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : paymentMethod === 'netbanking'
            ? 'Net Banking'
            : 'Cash on Delivery (COD)'
      };

      setOrderSuccess(orderDetails);
      clearCart();
      setIsSubmitting(false);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 1200);
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-gray-500">
            We have received your order <span className="font-mono font-bold text-gray-900">{orderSuccess.orderId}</span>. A confirmation SMS and email has been sent.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 text-left shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-[11px] text-gray-400 uppercase">Estimated Delivery</span>
              <p className="text-sm font-bold text-emerald-700">{orderSuccess.estimatedDelivery}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-400 uppercase">Total Paid</span>
              <p className="text-sm font-bold text-gray-900">₹{orderSuccess.total}</p>
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <p><strong className="text-gray-900">Delivery Address: </strong>{orderSuccess.address}</p>
            <p><strong className="text-gray-900">Payment Mode: </strong>{orderSuccess.paymentMethod}</p>
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <span className="text-xs font-bold text-gray-900 uppercase">Ordered Items:</span>
            {orderSuccess.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                <span className="truncate max-w-[70%]">
                  {item.product.name} (Size: {item.size}) × {item.quantity}
                </span>
                <span className="font-semibold">₹{item.unitPrice * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-brand-900 transition-colors shadow-md"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <span className="text-xs font-semibold text-gray-500">
          Step 2 of 2: Checkout & Payment
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Shipping + Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Box */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Truck className="w-5 h-5 text-brand-700" />
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Street Address & Flat / House No. *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-700"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-700" />
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                  Select Payment Method
                </h2>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 100% Safe & Encrypted
              </span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-brand-700 bg-brand-50/50 shadow-2xs cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="w-4 h-4 text-brand-700"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      Razorpay Secure Checkout
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      No Razorpay account needed • Choose GPay, PhonePe, UPI or card
                    </span>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-[#072654]" />
              </label>

              {paymentMethod !== 'razorpay' && paymentMethod !== 'cod' && (
                <>
              {/* UPI */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-brand-700 bg-brand-50/50 shadow-2xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="w-4 h-4 text-brand-700"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      UPI (Google Pay, PhonePe, Paytm, BHIM)
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Instant verification • Extra ₹6 off available
                    </span>
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-brand-700" />
              </label>

              {/* Cards */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-700 bg-brand-50/50 shadow-2xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-4 h-4 text-brand-700"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      Credit / Debit Cards
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Visa, MasterCard, RuPay, Diners Club
                    </span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-brand-700" />
              </label>

              {/* Net Banking */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-brand-700 bg-brand-50/50 shadow-2xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="w-4 h-4 text-brand-700"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      Net Banking
                    </span>
                    <span className="text-[11px] text-gray-500">
                      All major Indian banks supported
                    </span>
                  </div>
                </div>
                <Building className="w-5 h-5 text-brand-700" />
              </label>

                </>
              )}

              {/* Cash On Delivery */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-700 bg-brand-50/50 shadow-2xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-brand-700"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Pay cash when the courier arrives at your door
                    </span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-brand-700" />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <OrderSummary showCheckoutBtn={false} />

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-4 bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white rounded-2xl text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Processing Order...</span>
            ) : (
              <>
                <span>
                  {paymentMethod === 'razorpay'
                    ? `Continue to Secure Payment (₹${razorpayAmount})`
                    : `Place Order (₹${totalPayable})`}
                </span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-gray-400 text-center">
            By placing the order, you agree to ETHNICORA's terms of service & delivery policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
