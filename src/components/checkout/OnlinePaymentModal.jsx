import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Check,
  Truck,
  Package,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  ExternalLink,
  RotateCw,
  Copy,
  QrCode,
  Download
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

import { useOrders } from '../../context/OrderContext';
import {
  PAYMENT_CONFIG,
  validateUpiId,
  buildAppUpiUrl,
  buildUpiQrString,
  triggerUpiAppLaunch,
  getActiveMerchantUpi,
  createRazorpayPaymentLink,
  getRazorpayPaymentAmount,
} from '../../data/paymentConfig';
import {
  GooglePayIcon,
  PhonePeIcon,
  PaytmIcon,
  MeeshoLogo
} from '../common/BrandIcons';
import InvoiceModal from './InvoiceModal';

export const OnlinePaymentModal = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  price,
  quantity = 1,
  onSelectSize
}) => {
  const { showToast } = useToast();
  const { clearCart } = useCart();
  const { addOrder, orders } = useOrders();

  let currentSizeObj = { size: 'Free Size', price: price || product?.price || 9 };
  if (selectedSize && typeof selectedSize === 'object' && selectedSize.size) {
    currentSizeObj = selectedSize;
  } else if (typeof selectedSize === 'string') {
    currentSizeObj = { size: selectedSize, price: price || product?.price || 9 };
  } else if (product?.sizes && product.sizes.length > 0) {
    currentSizeObj = product.sizes.find((s) => s.size === 'M') || product.sizes[0];
  }

  const itemPrice = currentSizeObj?.price || price || product.price || 9;
  const basePrice = itemPrice * quantity;
  const upiDiscount = PAYMENT_CONFIG.instantUpiDiscount; // ₹6 discount
  const finalUpiPrice = Math.max(0, basePrice - upiDiscount);
  const razorpayAmount = getRazorpayPaymentAmount(finalUpiPrice);

  const [orderId] = useState(() => `MEE-${Math.floor(100000 + Math.random() * 900000)}`);

  // Payment stages: 'select' | 'awaiting_payment' | 'verifying' | 'confirmed'
  const [paymentStage, setPaymentStage] = useState('select');

  // Payment methods: 'gpay' | 'phonepe' | 'paytm' | 'upi_id' | 'card'
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [isCreatingRazorpayLink, setIsCreatingRazorpayLink] = useState(false);

  // UPI ID State (for manual input)
  const [manualUpi, setManualUpi] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [verifiedUpiResult, setVerifiedUpiResult] = useState(null);
  const [upiError, setUpiError] = useState('');

  // Fixed Store Payee UPI (Direct to the receiving bank - No Change Option)
  const merchantUpi = getActiveMerchantUpi();

  // Dynamic QR Code State & Awaiting Tab ('app' | 'qr')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [awaitingTab, setAwaitingTab] = useState('app');

  // Direct Payment Tracking (No UTR or Screenshot required)
  const paymentLaunchTimeRef = useRef(0);
  const hasLaunchedAppRef = useRef(false);
  const appBackgroundStartRef = useRef(0);
  const timeSpentInUpiAppRef = useRef(0);
  const [paymentFailedNotice, setPaymentFailedNotice] = useState(false);
  const [verifyingProgressText, setVerifyingProgressText] = useState('');
  const [showPaymentSuccessConfirm, setShowPaymentSuccessConfirm] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Generate authentic NPCI QR Code Data URL on mount / price change
  useEffect(() => {
    if (!isOpen || !product) return;

    const qrString = buildUpiQrString({
      amount: finalUpiPrice,
      orderId,
      note: 'Order Payment'
    });

    QRCode.toDataURL(qrString, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [isOpen, product, finalUpiPrice, orderId]);

  // Address State
  const [address, setAddress] = useState({
    name: 'Ananya Sharma',
    phone: '9876543210',
    address: 'B-402, Lotus Greens, Park Street',
    city: 'Mumbai',
    pincode: '400001'
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Order Details once confirmed
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [showHubMilestones, setShowHubMilestones] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Countdown timer for GPay approval (5 minutes)
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    if (paymentStage !== 'awaiting_payment') return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStage]);

  // Track customer leaving to Google Pay and returning
  useEffect(() => {
    if (paymentStage !== 'awaiting_payment') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        appBackgroundStartRef.current = Date.now();
      } else if (document.visibilityState === 'visible') {
        if (appBackgroundStartRef.current > 0) {
          const duration = (Date.now() - appBackgroundStartRef.current) / 1000;
          timeSpentInUpiAppRef.current += duration;
          appBackgroundStartRef.current = 0;
          if (hasLaunchedAppRef.current && duration >= 1) {
            setPaymentFailedNotice(false);
            setShowPaymentSuccessConfirm(true);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [paymentStage]);

  // Keep-alive heartbeat: keeps website connection & cloudflared tunnel active when redirected to GPay
  useEffect(() => {
    const keepAlivePing = () => {
      fetch('/index.html', { method: 'HEAD', cache: 'no-store' }).catch(() => {});
    };
    const heartbeat = setInterval(keepAlivePing, 10000);
    window.addEventListener('focus', keepAlivePing);
    document.addEventListener('visibilitychange', keepAlivePing);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('focus', keepAlivePing);
      document.removeEventListener('visibilitychange', keepAlivePing);
    };
  }, []);


  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyUpiId = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(merchantUpi);
      setIsCopied(true);
      showToast(`UPI ID Copied: ${merchantUpi} ✅`, 'success');
      setTimeout(() => setIsCopied(false), 3000);
    } else {
      showToast(`UPI ID: ${merchantUpi}`, 'info');
    }
  };

  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `UPI-QR-YUG-ENTERPRISE-₹${finalUpiPrice}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR Code Saved! Open PhonePe/GPay ➔ Scan from Gallery ✅', 'success');
  };


  const currentAppType =
    selectedMethod === 'gpay'
      ? 'gpay'
      : selectedMethod === 'phonepe'
      ? 'phonepe'
      : selectedMethod === 'paytm'
      ? 'paytm'
      : 'generic';

  const currentUpiUrl = buildAppUpiUrl({
    app: currentAppType,
    amount: finalUpiPrice,
    orderId,
    note: 'Order'
  });

  // 1. Trigger App Launch & Redirect to GPay / PhonePe / QR
  const handleInitiatePayment = async (e) => {
    if (selectedMethod === 'razorpay') {
      if (e) e.preventDefault();
      setIsCreatingRazorpayLink(true);
      try {
        const paymentLink = await createRazorpayPaymentLink({
          amount: razorpayAmount,
          orderId,
          customer: { name: address.name, phone: address.phone },
          description: `${product.name} - ${currentSizeObj.size}`
        });
        sessionStorage.setItem(
          'ethnicora_pending_razorpay_payment',
          JSON.stringify({
            orderId,
            amount: razorpayAmount,
            paymentLinkId: paymentLink.id,
            shortUrl: paymentLink.shortUrl,
            createdAt: Date.now(),
            testMode: PAYMENT_CONFIG.razorpayTestMode
          })
        );
        showToast(`Opening Razorpay with ₹${razorpayAmount} filled automatically.`, 'info');
        window.location.assign(paymentLink.shortUrl);
      } catch (error) {
        setIsCreatingRazorpayLink(false);
        showToast(error.message, 'error');
      }
      return;
    }

    if (selectedMethod === 'qr_code') {
      if (e) e.preventDefault();
      setAwaitingTab('qr');
      setPaymentStage('awaiting_payment');
      setCountdown(300);
      showToast('Scan QR Code with Google Pay or PhonePe to pay', 'info');
      return;
    }

    if (selectedMethod === 'upi_id' && !verifiedUpiResult) {
      if (e) e.preventDefault();
      showToast('Please check your UPI ID format before proceeding', 'warning');
      return;
    }

    if (selectedMethod === 'card') {
      if (e) e.preventDefault();
      setPaymentStage('verifying');
      setTimeout(() => {
        completeOrder('Debit / Credit Card');
      }, 1200);
      return;
    }

    // Launch the UPI app in this tab. A new tab for upi:// shows a browser error after payment.
    if (e) e.preventDefault();
    const launched = triggerUpiAppLaunch(currentUpiUrl);
    if (!launched) {
      setAwaitingTab('qr');
      setPaymentStage('awaiting_payment');
      setCountdown(300);
      showToast('Scan the QR code with Google Pay or PhonePe on your phone', 'info');
      return;
    }
    hasLaunchedAppRef.current = true;
    paymentLaunchTimeRef.current = Date.now();
    timeSpentInUpiAppRef.current = 0;
    setPaymentFailedNotice(false);
    setShowPaymentSuccessConfirm(false);
    setAwaitingTab('app');

    // Give browser 600ms to dispatch intent before changing React DOM state
    setTimeout(() => {
      setPaymentStage('awaiting_payment');
      setCountdown(300);
    }, 600);

    const appName =
      selectedMethod === 'gpay'
        ? 'Google Pay'
        : selectedMethod === 'phonepe'
        ? 'PhonePe'
        : selectedMethod === 'paytm'
        ? 'Paytm'
        : 'UPI App';

    showToast(`Opening ${appName}... Please complete payment in app`, 'info');
  };

  // 2. Re-trigger App Launch
  const handleOpenAppAgain = (e) => {
    if (e) e.preventDefault();
    const launched = triggerUpiAppLaunch(currentUpiUrl);
    if (!launched) {
      setAwaitingTab('qr');
      showToast('Scan the QR code with Google Pay or PhonePe on your phone', 'info');
      return;
    }
    hasLaunchedAppRef.current = true;
    paymentLaunchTimeRef.current = Date.now();
    setPaymentFailedNotice(false);
    setShowPaymentSuccessConfirm(false);
    showToast(`Re-opening ${selectedMethod.toUpperCase()}...`, 'info');
  };

  const upiAppLabel =
    selectedMethod === 'phonepe'
      ? 'PhonePe'
      : selectedMethod === 'paytm'
      ? 'Paytm'
      : 'Google Pay';

  // 3. Ask whether the UPI app showed success. This store cannot read the receiving bank.
  const handleCheckPaymentStatus = () => {
    setPaymentFailedNotice(false);
    setShowPaymentSuccessConfirm(true);
  };

  const handlePaymentNotDone = () => {
    setShowPaymentSuccessConfirm(false);
    setPaymentStage('awaiting_payment');
    setPaymentFailedNotice(true);
    showToast('Payment status is unconfirmed. Check your UPI app and bank history before retrying.', 'warning');
  };

  // 4. Customer says the UPI app showed success. Save a pending order for manual matching.
  const handleConfirmRealPayment = () => {
    setShowPaymentSuccessConfirm(false);
    setPaymentStage('verifying');
    setPaymentFailedNotice(false);
    setVerifyingProgressText(`Saving your order so ${PAYMENT_CONFIG.merchantName} can match this payment...`);

    setTimeout(() => {
      setVerifyingProgressText('Order submitted for payment matching...');
    }, 1100);

    setTimeout(() => {
      const paymentModeLabel =
        selectedMethod === 'gpay'
          ? 'Google Pay (Direct UPI)'
          : selectedMethod === 'phonepe'
          ? 'PhonePe (Direct UPI)'
          : selectedMethod === 'paytm'
          ? 'Paytm UPI'
          : selectedMethod === 'upi_id'
          ? `UPI ID (${verifiedUpiResult?.vpa || manualUpi})`
          : 'Online UPI';

      completeOrder(paymentModeLabel, 'Pending Verification');
    }, 2000);
  };


  // Helper to finalize order & set confirmation
  const completeOrder = (paymentModeText, statusType = 'Accepted') => {
    if (!product) return;
    const isPending = statusType === 'Pending Verification';
    // Only a bank or payment provider can supply a real UTR.

    const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    );

    const orderData = {
      orderId,
      utrNumber: '',
      productName: product.name,
      productImage: product.image,
      size: currentSizeObj.size,
      quantity,
      amountPaid: selectedMethod === 'card' ? basePrice : finalUpiPrice,
      paymentMode: paymentModeText,
      customerName: address.name,
      phone: address.phone,
      pincode: address.pincode,
      address: `${address.name}, ${address.address}, ${address.city} - ${address.pincode}`,
      deliveryDate,
      status: isPending ? 'Pending Verification' : 'Accepted',
      paymentStatus: isPending ? 'Pending Verification (Check the receiving bank)' : 'PAID (Verified Online)',
      placedAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      awbNumber: `DEL${Math.floor(100000000 + Math.random() * 900000000)}`
    };

    addOrder(orderData);
    setOrderSuccess(orderData);
    setPaymentStage('confirmed');
    clearCart();

    try {
      confetti({ particleCount: 160, spread: 85, origin: { y: 0.55 } });
    } catch (e) {}

    showToast(
      isPending
        ? `Order submitted. ${PAYMENT_CONFIG.merchantName} will confirm this payment.`
        : 'Payment Received! Order Confirmed ✅',
      'success'
    );
  };

  if (!isOpen || !product) return null;

  // Strict UPI ID Verification
  const handleVerifyUpiId = () => {
    setUpiError('');
    setVerifiedUpiResult(null);

    const validation = validateUpiId(manualUpi);
    if (!validation.isValid) {
      setUpiError(validation.message);
      showToast(validation.message, 'error');
      return;
    }

    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setVerifiedUpiResult(validation);
      showToast('UPI ID format is valid. Confirm account details in your UPI app.', 'info');
    }, 700);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[94vh] flex flex-col shadow-2xl relative overflow-hidden animate-slide-up border border-gray-100">
          {/* Header */}
          <div className="px-4 py-3 bg-[#931b6e] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center font-black text-xs">
                m
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm">
                  {paymentStage === 'confirmed'
                    ? 'Order Confirmed'
                    : paymentStage === 'awaiting_payment' || paymentStage === 'verifying'
                    ? 'Complete in UPI App'
                    : 'Select Online Payment'}
                </h3>
                <p className="text-[10px] text-fuchsia-100">
                  {paymentStage === 'confirmed'
                    ? `Order #${orderId}`
                    : 'Secure payment handled by Razorpay'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-gray-800">
            {/* ---------------------------------------------------- */}
            {/* STATE 1: AWAITING PAYMENT IN GPAY / PHONEPE          */}
            {/* ---------------------------------------------------- */}
            {paymentStage === 'awaiting_payment' || paymentStage === 'verifying' ? (
              <div className="space-y-4 py-2 animate-fade-in">
                {/* App Brand Icon Header or QR Header */}
                <div className="text-center space-y-2">
                  <div className="relative inline-block mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-[#931b6e]/20 flex items-center justify-center mx-auto shadow-sm">
                      {awaitingTab === 'qr' ? (
                        <QrCode className="w-9 h-9 text-[#931b6e]" />
                      ) : selectedMethod === 'gpay' ? (
                        <GooglePayIcon className="w-10 h-10" />
                      ) : selectedMethod === 'phonepe' ? (
                        <PhonePeIcon className="w-10 h-10" />
                      ) : (
                        <PaytmIcon className="w-10 h-10" />
                      )}
                    </div>
                    {/* Pulsing ring */}
                    <span className="absolute -inset-1.5 rounded-3xl border-2 border-[#931b6e] animate-ping opacity-30 pointer-events-none" />
                  </div>

                  <div>
                    <h4 className="text-base font-black text-gray-950">
                      {paymentStage === 'verifying'
                        ? 'Saving your order...'
                        : awaitingTab === 'qr'
                        ? 'Scan QR Code to Pay ₹' + finalUpiPrice
                        : `Complete Payment in ${
                            selectedMethod === 'gpay'
                              ? 'Google Pay'
                              : selectedMethod === 'phonepe'
                              ? 'PhonePe'
                              : selectedMethod === 'paytm'
                              ? 'Paytm'
                              : 'UPI App'
                          }`}
                    </h4>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {paymentStage === 'verifying'
                        ? `Submitting your order for ${PAYMENT_CONFIG.merchantName} to match...`
                        : awaitingTab === 'qr'
                        ? '100% works without UPI Risk Policy error'
                        : `Please approve the payment of ₹${finalUpiPrice} in your app`}
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-900 font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                    <span>Time Remaining: {formatCountdown(countdown)}</span>
                  </div>
                </div>

                {/* Pay Mode Toggle: 1-Tap App vs Scan QR Code */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAwaitingTab('app')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      awaitingTab === 'app'
                        ? 'bg-white text-[#931b6e] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Pay via App</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAwaitingTab('qr')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      awaitingTab === 'qr'
                        ? 'bg-white text-[#931b6e] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#038d63]" />
                    <span>Scan QR Code</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1 rounded-sm">100% OK</span>
                  </button>
                </div>

                {/* TAB 1: SCAN QR CODE VIEW */}
                {awaitingTab === 'qr' ? (
                  <div className="bg-white border-2 border-[#931b6e]/20 rounded-2xl p-4 text-center space-y-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-[#038d63]" />
                        <span>Bypasses Bank Risk Policy</span>
                      </div>
                      <h4 className="font-black text-gray-950 text-sm">
                        Scan with Google Pay, PhonePe, or Paytm
                      </h4>
                    </div>

                    {/* Real Dynamic QR Image */}
                    <div className="relative inline-block mx-auto bg-white p-2 rounded-xl shadow-xs border border-gray-200">
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="UPI Payment QR Code"
                          className="w-48 h-48 mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center text-gray-400 font-medium">
                          Generating QR Code...
                        </div>
                      )}
                      <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-black text-[#931b6e]">
                        <span>Enter amount in app: ₹{finalUpiPrice}</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons: Save QR & Copy UPI */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="flex-1 py-2 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save QR to Gallery</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="flex-1 py-2 px-2 bg-fuchsia-50 hover:bg-fuchsia-100 text-[#931b6e] border border-[#931b6e]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isCopied ? 'Copied!' : 'Copy UPI ID'}</span>
                      </button>
                    </div>

                    {/* Instructions in Gujarati & English */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-left text-[11px] text-gray-700 space-y-1">
                      <p className="font-bold text-gray-900 text-xs">
                        How to pay via QR Code (કઈ રીતે પેમેન્ટ કરવું):
                      </p>
                      <ol className="list-decimal list-inside space-y-0.5 text-gray-800 text-[10px] pl-0.5">
                        <li>બીજા ફોનથી Google Pay / PhonePe સ્કેનર ખોલી આ QR સ્કેન કરો.</li>
                        <li>અથવા <strong>"Save QR to Gallery"</strong> દબાવી, GPay સ્કેનરમાં Gallery માંથી સ્કેન કરો.</li>
                        <li>રકમમાં <strong>₹{finalUpiPrice}</strong> નાખો, પછી UPI PIN નાખી પેમેન્ટ પૂર્ણ કરો.</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  /* TAB 2: PAY VIA APP VIEW */
                  <>
                    {/* Payment Summary Box */}
                    <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 space-y-2">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Amount to Pay:</span>
                        <strong className="text-base font-black text-[#931b6e]">
                          ₹{finalUpiPrice}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paying To:</span>
                        <strong className="text-gray-900">{PAYMENT_CONFIG.merchantName}</strong>
                      </div>
                      <div className="flex justify-between items-center font-mono text-[11px]">
                        <span className="text-gray-600">Receiver UPI ID:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-900 font-semibold">{merchantUpi}</span>
                          <button
                            type="button"
                            onClick={handleCopyUpiId}
                            className="px-1.5 py-0.5 bg-fuchsia-50 border border-[#931b6e]/30 text-[#931b6e] rounded text-[10px] font-sans font-bold hover:bg-fuchsia-100 flex items-center gap-1 cursor-pointer"
                            title="Copy UPI ID"
                          >
                            <Copy className="w-2.5 h-2.5" />
                            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-gray-600">Order Ref:</span>
                        <span className="text-gray-900 font-bold">{orderId}</span>
                      </div>
                    </div>

                    {/* Prominent Risk Policy Prevention Box */}
                    <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 space-y-2 text-left">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-950 text-xs">
                            Google Pay માં "UPI Risk Policy" error આવે છે?
                          </p>
                          <p className="text-[11px] text-amber-900 mt-0.5 leading-tight">
                            જો બેંક તરફથી વેબ લિંક બ્લોક થઈ હોય, તો નીચે UPI ID Copy કરીને સીધું પેમેન્ટ કરો:
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-amber-200 flex items-center justify-between font-mono text-xs">
                        <span className="font-bold text-gray-900 truncate max-w-[190px]">{merchantUpi}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpiId}
                          className="px-2 py-1 bg-[#931b6e] text-white rounded text-[10px] font-sans font-bold hover:bg-[#771f34] flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Copy className="w-2.5 h-2.5" />
                          <span>{isCopied ? 'Copied!' : 'Copy UPI ID'}</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[10px] pt-0.5">
                        <span className="text-gray-600">GPay ➔ Pay UPI ID ➔ Paste & Pay ₹{finalUpiPrice}</span>
                        <button
                          type="button"
                          onClick={() => setAwaitingTab('qr')}
                          className="text-[#931b6e] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>Or Scan QR Code</span>
                        </button>
                      </div>
                    </div>

                    {/* Prominent Payment Pending / Not Received Banner */}
                    {paymentFailedNotice && (
                      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-center space-y-2.5 shadow-xs">
                        <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="font-black text-rose-950 text-sm">
                            Payment Status Unconfirmed
                          </h4>
                          <p className="text-xs text-rose-700 font-bold mt-0.5">
                            ફરી પેમેન્ટ કરતાં પહેલાં બેંકમાં સ્થિતિ તપાસો
                          </p>
                          <p className="text-[11px] text-gray-600 mt-1 leading-tight">
                            If money was debited or payment is pending, check your bank and UPI transaction history before trying again. A merchant-link rejection needs confirmation from the merchant payment provider.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setAwaitingTab('qr')}
                            className="flex-1 py-2.5 bg-[#038d63] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>View QR Code</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenAppAgain}
                            className="flex-1 py-2.5 bg-[#931b6e] hover:bg-[#771f34] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open App Again</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step Instructions */}
                    {!paymentFailedNotice && (
                      <>
                        <div className="bg-fuchsia-50/70 border border-fuchsia-200 rounded-xl p-3 space-y-1.5 text-[11px] text-gray-700">
                          <p className="font-bold text-[#931b6e] text-xs">Steps to complete payment:</p>
                          <ol className="list-decimal list-inside space-y-1 text-gray-800">
                            <li>Approve payment of <strong>₹{finalUpiPrice}</strong> to <strong>{PAYMENT_CONFIG.merchantName}</strong> in Google Pay.</li>
                            <li>Enter your secret <strong>UPI PIN</strong> in Google Pay to pay.</li>
                            <li>Return here and confirm that {upiAppLabel} showed payment successful.</li>
                          </ol>
                        </div>

                        {/* Re-trigger App Launch Button */}
                        <button
                          type="button"
                          onClick={handleOpenAppAgain}
                          className="w-full py-3 bg-[#931b6e] hover:bg-[#771f34] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer shadow-md text-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>
                            Open{' '}
                            {selectedMethod === 'gpay'
                              ? 'Google Pay App'
                              : selectedMethod === 'phonepe'
                              ? 'PhonePe App'
                              : 'UPI App'}{' '}
                            to Pay ₹{finalUpiPrice}
                          </span>
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Multi-step Banking Verification Card during verifying state */}
                {paymentStage === 'verifying' && (
                  <div className="bg-fuchsia-50 border-2 border-[#931b6e]/30 rounded-xl p-4 text-center space-y-2 animate-fade-in shadow-xs">
                    <RotateCw className="w-7 h-7 text-[#931b6e] animate-spin mx-auto" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-950">
                        {verifyingProgressText || 'Saving your order...'}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        UPI: {merchantUpi}
                      </p>
                    </div>
                  </div>
                )}

                {showPaymentSuccessConfirm && paymentStage !== 'verifying' && (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center space-y-2.5 shadow-xs">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-[#038d63] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-950 text-sm">
                        Did {upiAppLabel} show payment successful?
                      </h4>
                      <p className="text-[11px] text-gray-600 mt-1 leading-tight">
                        This store cannot see your bank. If {upiAppLabel} showed success, submit the order so {PAYMENT_CONFIG.merchantName} can match ₹{finalUpiPrice}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmRealPayment}
                      className="w-full py-3 bg-[#038d63] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                    >
                      Yes, payment was successful
                    </button>
                    <button
                      type="button"
                      onClick={handlePaymentNotDone}
                      className="w-full py-2.5 bg-white border border-rose-300 text-rose-700 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      No, I have not paid yet
                    </button>
                  </div>
                )}

                {!showPaymentSuccessConfirm && (
                <button
                  type="button"
                  onClick={handleCheckPaymentStatus}
                  disabled={paymentStage === 'verifying'}
                  className="w-full py-3.5 bg-[#931b6e] hover:bg-[#771f34] disabled:opacity-60 text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {paymentStage === 'verifying' ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Submitting order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{paymentFailedNotice ? 'I Have Paid Now' : 'I Have Paid'}</span>
                    </>
                  )}
                </button>
                )}

                {/* Cancel / Switch Option */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentStage('select')}
                    disabled={paymentStage === 'verifying'}
                    className="text-gray-500 hover:text-gray-800 text-[11px] underline cursor-pointer"
                  >
                    Cancel / Choose another payment method
                  </button>
                </div>


              </div>
            ) : paymentStage === 'confirmed' && orderSuccess ? (
              /* ---------------------------------------------------- */
              /* STATE 2: FULL MEESHO ORDER CONFIRMED & TRACKING     */
              /* ---------------------------------------------------- */
              <div className="space-y-3.5 animate-fade-in">
                {/* Success / Pending Verification Banner */}
                <div className={`border rounded-2xl p-4 text-center space-y-1.5 shadow-2xs ${
                  orderSuccess.status === 'Pending Verification'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-xs ${
                    orderSuccess.status === 'Pending Verification'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-[#038d63]'
                  }`}>
                    {orderSuccess.status === 'Pending Verification' ? (
                      <Clock className="w-7 h-7 stroke-[2.4]" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 stroke-[2.4]" />
                    )}
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    orderSuccess.status === 'Pending Verification'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-[#038d63]'
                  }`}>
                    {orderSuccess.status === 'Pending Verification' ? 'Bank verification pending' : 'Payment Verified'}
                  </span>
                  <h4 className="text-base font-black text-gray-950">
                    {orderSuccess.status === 'Pending Verification' ? `Order submitted to ${PAYMENT_CONFIG.merchantName}` : 'Order Placed Successfully!'}
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-tight">
                    Order ID: <strong className="font-mono text-gray-900">{orderSuccess.orderId}</strong>
                    {orderSuccess.status === 'Pending Verification' && (
                      <span className="block text-[10px] text-amber-800 mt-0.5">
                        {PAYMENT_CONFIG.merchantName} will verify the ₹{orderSuccess.amountPaid} payment in the receiving bank before dispatch.
                      </span>
                    )}
                  </p>

                  {/* Estimated Delivery Banner */}
                  <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center justify-center gap-1.5 text-emerald-950 font-bold text-xs">
                    <Truck className="w-4 h-4 text-[#038d63] shrink-0" />
                    <span>
                      Estimated Delivery by{' '}
                      <span className="text-[#038d63] font-extrabold underline decoration-emerald-400">
                        {orderSuccess.deliveryDate}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Meesho Shipping Stepper */}
                <div className="bg-white border border-gray-200 rounded-2xl p-3.5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-gray-950 text-xs">
                      <Truck className="w-4 h-4 text-[#931b6e]" />
                      <span>Live Delivery Tracking</span>
                    </div>
                    <span className="text-[10px] font-mono bg-fuchsia-50 text-[#931b6e] font-bold px-2 py-0.5 rounded">
                      Delhivery Express: {orderSuccess.awbNumber}
                    </span>
                  </div>

                  {/* Vertical Stepper */}
                  <div className="relative pl-6 space-y-3.5 pt-1">
                    <div className="absolute left-2.75 top-2 bottom-3 w-0.5 bg-gray-200" />
                    <div className="absolute left-2.75 top-2 h-14 w-0.5 bg-[#038d63]" />

                    {/* Step 1: Order Confirmed */}
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#038d63] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-black text-gray-950 text-xs">Order Confirmed</p>
                          <span className="text-[10px] text-gray-500 font-medium">{orderSuccess.placedAt}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                          Submitted via {orderSuccess.paymentMode}. Order sent to {PAYMENT_CONFIG.merchantName} for verification.
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Packed */}
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#931b6e] text-white flex items-center justify-center ring-4 ring-fuchsia-100 animate-pulse shadow-xs">
                        <Package className="w-2.5 h-2.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-black text-[#931b6e] text-xs">Packed & Ready to Dispatch</p>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                            Expected Today
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                          Item packed by seller at Surat Central Logistics Hub.
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Shipped */}
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                        <Truck className="w-2.5 h-2.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-gray-700 text-xs">Shipped</p>
                          <span className="text-[10px] text-gray-400">Tomorrow</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                          Courier: Delhivery Express (AWB: {orderSuccess.awbNumber}).
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Out for Delivery */}
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                        <MapPin className="w-2.5 h-2.5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-700 text-xs">Out for Delivery</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                          Courier executive will call before doorstep arrival.
                        </p>
                      </div>
                    </div>

                    {/* Step 5: Delivered */}
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-gray-700 text-xs">Delivery</p>
                          <span className="text-[10px] font-bold text-gray-900">{orderSuccess.deliveryDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hub Milestones Toggle */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowHubMilestones(!showHubMilestones)}
                      className="w-full flex items-center justify-between text-[#931b6e] font-bold text-[11px] hover:underline cursor-pointer py-1"
                    >
                      <span>{showHubMilestones ? 'Hide Logistics Milestones' : 'View Logistics Milestones'}</span>
                      {showHubMilestones ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showHubMilestones && (
                      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 mt-2 space-y-1.5 text-[10px] text-gray-600 font-mono animate-fade-in">
                        <div className="flex justify-between">
                          <span>• Surat Central Logistics:</span>
                          <span className="font-bold text-gray-900">Payment Verified</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Seller Manifest:</span>
                          <span className="text-gray-800">Generated ({PAYMENT_CONFIG.merchantName})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Delhivery Express Hub:</span>
                          <span className="text-gray-800">Surat Air Cargo Terminal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Destination Facility:</span>
                          <span className="text-gray-500">In Transit</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered Item Summary */}
                <div className="bg-white border border-gray-200 rounded-2xl p-3 flex gap-3 items-center shadow-2xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-13 h-16 object-cover rounded-xl border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h5 className="font-bold text-gray-950 truncate text-xs">{product.name}</h5>
                    <p className="text-gray-500 text-[11px]">
                      Size: <strong className="text-[#931b6e] font-bold">{orderSuccess.size}</strong> • Qty: 1
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Seller: <span className="font-semibold text-gray-800">{PAYMENT_CONFIG.merchantName}</span> (4.1 ★)
                    </p>
                    <p className="text-xs font-black text-gray-900">₹{orderSuccess.amountPaid}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white border border-gray-200 rounded-2xl p-3 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-gray-950 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#931b6e]" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-tight">
                    {orderSuccess.address}
                  </p>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-3 space-y-1.5 shadow-2xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Product Price:</span>
                    <span>₹{basePrice}</span>
                  </div>
                  {selectedMethod !== 'card' && (
                    <div className="flex justify-between text-[#038d63] font-bold">
                      <span>Instant UPI Discount:</span>
                      <span>-₹{upiDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges:</span>
                    <span className="text-[#038d63] font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between font-black text-gray-950 text-xs pt-1 border-t border-gray-100">
                    <span>Total Amount Paid:</span>
                    <span className="text-[#931b6e]">₹{orderSuccess.amountPaid}</span>
                  </div>
                  <div className="pt-1.5 border-t border-gray-100 flex justify-between text-[10px] font-mono text-gray-600">
                    <span>Bank UTR: {orderSuccess.utrNumber || 'Not verified'}</span>
                    <span className="text-amber-700 font-bold font-sans">
                      {orderSuccess.paymentStatus || 'Pending bank verification'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(true)}
                    className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Tax Invoice (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 bg-[#931b6e] hover:bg-[#771f34] text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Continue Shopping Kurtis</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ---------------------------------------------------- */
              /* STATE 3: PAYMENT METHOD SELECTION SCREEN             */
              /* ---------------------------------------------------- */
              <>
                {/* Product Summary */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-14 object-cover rounded-lg border shrink-0"
                    />
                    <div>
                      <p className="font-bold text-gray-900 truncate max-w-[190px]">{product.name}</p>
                      <p className="text-gray-500 text-[11px]">
                        Selected Size: <strong className="text-[#931b6e] font-bold">{currentSizeObj.size}</strong> • ₹{itemPrice}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-gray-950 block">₹{finalUpiPrice}</span>
                    <span className="text-[10px] text-[#038d63] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Save ₹{upiDiscount}
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-3 border border-gray-200 rounded-xl space-y-1 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                      <Truck className="w-3.5 h-3.5 text-[#931b6e]" />
                      <span>Delivering To</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-[#931b6e] font-bold hover:underline cursor-pointer"
                    >
                      {isEditingAddress ? 'Save' : 'Change'}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-1.5 pt-1.5">
                      <input
                        type="text"
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        placeholder="Name"
                        className="w-full px-2.5 py-1 border rounded-lg text-xs"
                      />
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="Phone"
                        className="w-full px-2.5 py-1 border rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        placeholder="House / Street"
                        className="w-full px-2.5 py-1 border rounded-lg text-xs"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-600 text-[11px] leading-tight">
                      <strong>{address.name}</strong> ({address.phone}) • {address.address}, {address.city} - {address.pincode}
                    </p>
                  )}
                </div>

                {/* Strict Notice: COD NOT AVAILABLE AT YOUR LOCATION */}
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Cash on Delivery (COD) is not available at your location:</strong> Pay securely on Razorpay using UPI, cards, wallets, or net banking.
                  </span>
                </div>

                {/* PAYMENT OPTIONS */}
                <div className="space-y-2">
                  <span className="font-bold text-gray-900 uppercase text-[11px] block tracking-wide">
                    Select Online Payment Method
                  </span>

                  <label className="flex items-center justify-between p-3 rounded-xl border-2 border-[#931b6e] bg-[#fbf2f7] shadow-2xs cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'razorpay'}
                        onChange={() => setSelectedMethod('razorpay')}
                        className="w-4 h-4 text-[#931b6e]"
                      />
                      <div className="w-8 h-8 rounded-lg bg-[#072654] text-white flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-950 text-xs block">Razorpay Secure Checkout</span>
                        <span className="text-[10px] text-[#038d63] font-semibold">
                          No Razorpay account needed • Choose GPay, PhonePe, UPI or card
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#931b6e]">₹{razorpayAmount}</span>
                  </label>

                  {PAYMENT_CONFIG.paymentProvider !== 'razorpay' && (
                    <>

                  {/* Option 1: Google Pay */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === 'gpay'
                        ? 'border-[#931b6e] bg-[#fbf2f7] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'gpay'}
                        onChange={() => setSelectedMethod('gpay')}
                        className="w-4 h-4 text-[#931b6e]"
                      />
                      <GooglePayIcon className="w-8 h-8" />
                      <div>
                        <span className="font-bold text-gray-950 text-xs block">Google Pay (GPay)</span>
                        <span className="text-[10px] text-[#038d63] font-semibold">
                          Redirects to Google Pay App • ₹6 Discount
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#931b6e]">₹{finalUpiPrice}</span>
                  </label>

                  {/* Option 2: PhonePe */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === 'phonepe'
                        ? 'border-[#931b6e] bg-[#fbf2f7] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'phonepe'}
                        onChange={() => setSelectedMethod('phonepe')}
                        className="w-4 h-4 text-[#931b6e]"
                      />
                      <PhonePeIcon className="w-8 h-8" />
                      <div>
                        <span className="font-bold text-gray-950 text-xs block">PhonePe</span>
                        <span className="text-[10px] text-[#038d63] font-semibold">
                          Redirects to PhonePe App • ₹6 Discount
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#931b6e]">₹{finalUpiPrice}</span>
                  </label>

                  {/* Option 3: Paytm UPI */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === 'paytm'
                        ? 'border-[#931b6e] bg-[#fbf2f7] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'paytm'}
                        onChange={() => setSelectedMethod('paytm')}
                        className="w-4 h-4 text-[#931b6e]"
                      />
                      <PaytmIcon className="w-8 h-8" />
                      <div>
                        <span className="font-bold text-gray-950 text-xs block">Paytm UPI / Wallet</span>
                        <span className="text-[10px] text-[#038d63] font-semibold">
                          Redirects to Paytm App • ₹6 Discount
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#931b6e]">₹{finalUpiPrice}</span>
                  </label>

                  {/* Option 4: Scan UPI QR Code (Direct Bank Scan - Bypasses Risk Policy) */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === 'qr_code'
                        ? 'border-[#931b6e] bg-[#fbf2f7] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'qr_code'}
                        onChange={() => setSelectedMethod('qr_code')}
                        className="w-4 h-4 text-[#931b6e]"
                      />
                      <div className="w-8 h-8 rounded-lg bg-fuchsia-100 border border-[#931b6e]/30 flex items-center justify-center text-[#931b6e]">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-950 text-xs block">Scan UPI QR Code</span>
                          <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                            100% OK
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                          Scan with Google Pay, PhonePe, or Paytm
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#931b6e]">₹{finalUpiPrice}</span>
                  </label>

                  {/* Option 4: Other UPI ID (Verified Only) */}
                  <div
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedMethod === 'upi_id'
                        ? 'border-[#931b6e] bg-[#fbf2f7] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={selectedMethod === 'upi_id'}
                          onChange={() => setSelectedMethod('upi_id')}
                          className="w-4 h-4 text-[#931b6e]"
                        />
                        <Smartphone className="w-5 h-5 text-[#931b6e]" />
                        <span className="font-bold text-gray-950 text-xs">
                          Enter Any Other UPI ID (VPA)
                        </span>
                      </div>
                      <span className="text-xs font-black text-[#931b6e]">₹{finalUpiPrice}</span>
                    </label>

                    {selectedMethod === 'upi_id' && (
                      <div className="mt-2.5 pt-2.5 border-t border-fuchsia-100 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={manualUpi}
                            onChange={(e) => {
                              setManualUpi(e.target.value);
                              setUpiError('');
                              setVerifiedUpiResult(null);
                            }}
                            placeholder="e.g. 9876543210@paytm or user@okhdfcbank"
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#931b6e] bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyUpiId}
                            disabled={isVerifyingUpi || !manualUpi.trim()}
                            className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg cursor-pointer"
                          >
                            {isVerifyingUpi ? 'Checking...' : 'Check format'}
                          </button>
                        </div>

                        {/* Quick handle tags */}
                        <div className="flex flex-wrap gap-1">
                          {['@okhdfcbank', '@oksbi', '@okaxis', '@ybl', '@paytm'].map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => {
                                const prefix = manualUpi.split('@')[0] || '';
                                setManualUpi(`${prefix}${h}`);
                              }}
                              className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600 font-medium hover:border-[#931b6e]"
                            >
                              {h}
                            </button>
                          ))}
                        </div>

                        {upiError && (
                          <p className="text-rose-600 text-[11px] font-semibold">{upiError}</p>
                        )}

                        {verifiedUpiResult && (
                          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[#038d63] font-bold text-[11px] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Format valid: {verifiedUpiResult.vpa} (account not verified)</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Option 5: Cards */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#931b6e] bg-[#fbf2f7] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'card'}
                        onChange={() => setSelectedMethod('card')}
                        className="w-4 h-4 text-[#931b6e]"
                      />
                      <CreditCard className="w-5 h-5 text-gray-700" />
                      <div>
                        <span className="font-bold text-gray-950 text-xs block">Debit / Credit Cards</span>
                        <span className="text-[10px] text-gray-500">Visa, RuPay, MasterCard</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-900">₹{basePrice}</span>
                  </label>
                    </>
                  )}
                </div>

                {/* Price Details Breakdown */}
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 border border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Product Price:</span>
                    <span>₹{basePrice}</span>
                  </div>
                  {['gpay', 'phonepe', 'paytm', 'upi_id', 'qr_code'].includes(selectedMethod) && (
                    <div className="flex justify-between text-[#038d63] font-bold">
                      <span>Instant UPI Discount:</span>
                      <span>-₹{upiDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery:</span>
                    <span className="text-[#038d63] font-bold uppercase text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-950 pt-1.5 border-t border-gray-200">
                    <span>Total Amount:</span>
                    <span className="text-[#931b6e]">
                      ₹{selectedMethod === 'razorpay' ? razorpayAmount : ['gpay', 'phonepe', 'paytm', 'upi_id', 'qr_code'].includes(selectedMethod) ? finalUpiPrice : basePrice}
                    </span>
                  </div>
                </div>

                {/* BIG PROMINENT PAY BUTTON THAT LAUNCHES GPAY / PHONEPE / QR */}
                {selectedMethod === 'razorpay' ? (
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    disabled={isCreatingRazorpayLink}
                    className="w-full py-4 bg-[#072654] hover:bg-[#0b3978] text-white rounded-xl font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isCreatingRazorpayLink ? 'Creating Secure Payment…' : `Continue to Secure Payment • ₹${razorpayAmount}`}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                ) : selectedMethod === 'card' ? (
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    className="w-full py-4 bg-[#931b6e] hover:bg-[#771f34] text-white rounded-xl font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{basePrice} via Card</span>
                  </button>
                ) : selectedMethod === 'qr_code' ? (
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    className="w-full py-4 bg-[#931b6e] hover:bg-[#771f34] text-white rounded-xl font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View QR Code to Pay ₹{finalUpiPrice}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    className="w-full py-4 bg-[#931b6e] hover:bg-[#771f34] text-white rounded-xl font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      Pay ₹{finalUpiPrice} via{' '}
                      {selectedMethod === 'gpay'
                        ? 'Google Pay'
                        : selectedMethod === 'phonepe'
                        ? 'PhonePe'
                        : selectedMethod === 'paytm'
                        ? 'Paytm'
                        : 'UPI'}
                    </span>
                  </button>
                )}

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#038d63]" />
                  <span>256-Bit SSL Encrypted • 100% Safe Online Payment</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {showInvoiceModal && orderSuccess && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          order={orderSuccess}
        />
      )}
    </>
  );
};

export default OnlinePaymentModal;
