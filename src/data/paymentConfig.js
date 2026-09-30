// Professional UPI & Online Payment Configuration

export const PAYMENT_CONFIG = {
  paymentProvider: "razorpay",
  razorpayPaymentPageUrl: "https://razorpay.me/@ethnicoral",
  razorpayTestMode: false,
  razorpayTestAmount: 1,
  // Store receiving UPI ID; confirm merchant intent support with the acquiring bank.
  merchantName: "DHARTI ENTERPRISE",
  merchantUpiId: "yespay.mabs0841619ikit3251@yesbankltd",
  currency: "INR",
  // Set the actual four-digit MCC supplied by your acquiring bank. Never invent one.
  merchantCategoryCode: "5691",
  instantUpiDiscount: 0, // Instant discount when paying online via UPI

  // Authentic NPCI & Indian Bank UPI Handles
  validUpiHandles: [
    "axisbank",    // Axis Bank
    "okaxis",      // Google Pay - Axis
    "okhdfcbank",  // Google Pay - HDFC
    "oksbi",       // Google Pay - SBI
    "okicici",     // Google Pay - ICICI
    "ybl",         // PhonePe - YES Bank
    "ibl",         // PhonePe - ICICI Bank
    "axl",         // PhonePe - Axis Bank
    "paytm",       // Paytm Payments Bank / Wallet
    "upi",         // BHIM UPI (NPCI)
    "apl",         // Amazon Pay
    "barodampay",  // Bank of Baroda
    "pnb",         // Punjab National Bank
    "icici",       // iMobile
    "hdfcbank",    // HDFC Mobile
    "kotak",       // Kotak 811
    "postbank",    // India Post Payments Bank
    "indus",       // IndusInd Bank
    "aubank",      // AU Small Finance Bank
    "jupiteraxis", // Jupiter Money
    "slice",       // Slice UPI
    "fbl",         // Federal Bank
    "idfcbank",    // IDFC FIRST Bank
    "yesbankltd",  // YES Bank merchant VPA
    "yesbank"      // YES Bank
  ]
};

export const getRazorpayPaymentPageUrl = () =>
  PAYMENT_CONFIG.razorpayPaymentPageUrl;

export const getRazorpayPaymentAmount = (orderAmount) =>
  PAYMENT_CONFIG.razorpayTestMode
    ? PAYMENT_CONFIG.razorpayTestAmount
    : orderAmount;

export const createRazorpayPaymentLink = async ({ amount, orderId, customer, description }) => {
  const response = await fetch('/api/razorpay/payment-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, orderId, customer, description })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.shortUrl) {
    throw new Error(result.error || 'Unable to start Razorpay payment.');
  }
  return result;
};

// Strict Validation for Indian UPI IDs
export const validateUpiId = (upiString) => {
  if (!upiString || typeof upiString !== 'string') {
    return { isValid: false, message: 'Please enter a UPI ID' };
  }

  const trimmed = upiString.trim().toLowerCase();

  // Basic syntax check: username@handle
  const vpaRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$/;
  if (!vpaRegex.test(trimmed)) {
    return {
      isValid: false,
      message: 'Invalid format. Use mobile@bank or username@upi (e.g. 9876543210@paytm, name@okhdfcbank)'
    };
  }

  const [username, handle] = trimmed.split('@');

  if (!username || username.length < 2) {
    return { isValid: false, message: 'UPI username is too short' };
  }

  // Syntax only: bank handles evolve. Only the PSP can verify account existence.

  return {
    isValid: true,
    vpa: trimmed,
    bankName: getBankFromHandle(handle)
  };
};

export const getBankFromHandle = (handle) => {
  switch (handle) {
    case 'yesbankltd': return 'YES Bank UPI';
    case 'yesbank': return 'YES Bank UPI';
    case 'axisbank': return 'Axis Bank UPI';
    case 'okaxis': return 'Axis Bank (Google Pay)';
    case 'okhdfcbank': return 'HDFC Bank (Google Pay)';
    case 'oksbi': return 'State Bank of India (Google Pay)';
    case 'okicici': return 'ICICI Bank (Google Pay)';
    case 'ybl': return 'YES Bank (PhonePe)';
    case 'ibl': return 'ICICI Bank (PhonePe)';
    case 'axl': return 'Axis Bank (PhonePe)';
    case 'paytm': return 'Paytm Payments Bank';
    case 'upi': return 'BHIM UPI / NPCI';
    case 'apl': return 'Amazon Pay UPI';
    case 'kotak': return 'Kotak Mahindra Bank';
    case 'postbank': return 'India Post Payments Bank';
    default: return `${handle.toUpperCase()} UPI`;
  }
};

// Browser-local receiving UPI override (does not sync across devices).
const RETIRED_MERCHANT_UPI = "mab.037326003010052@axisbank";

export const getActiveMerchantUpi = () => {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('meesho_merchant_upi') : null;
    const trimmed = saved && saved.trim();
    if (trimmed && trimmed.toLowerCase() !== RETIRED_MERCHANT_UPI) return trimmed;
  } catch (e) {}
  return PAYMENT_CONFIG.merchantUpiId;
};

export const setActiveMerchantUpi = (upiId) => {
  try {
    if (upiId && upiId.trim()) {
      localStorage.setItem('meesho_merchant_upi', upiId.trim());
    }
  } catch (e) {}
};

const UPI_APP_PACKAGES = {
  gpay: "com.google.android.apps.nbu.paisa.user",
  phonepe: "com.phonepe.app",
  paytm: "net.one97.paytm"
};

const isAndroidDevice = () =>
  typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent || "");

const isIosDevice = () =>
  typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent || "");

const formatAmount = (amount) => {
  const numAm = Number(amount);
  const safe = Number.isFinite(numAm) && numAm > 0 ? numAm : 349;
  return safe % 1 === 0 ? safe.toString() : safe.toFixed(2);
};

const sanitizeTxnRef = (orderId) => {
  const raw = (orderId || `ORD${Date.now()}`).toString().replace(/[^a-zA-Z0-9.-]/g, "");
  return (raw || `ORD${Date.now()}`).slice(0, 35);
};

// Shared NPCI query used by app intents and the QR code.
export const buildUpiQuery = ({ amount, orderId, note = "Order Payment" }) => {
  const merchantUpi = getActiveMerchantUpi().trim() || PAYMENT_CONFIG.merchantUpiId;
  const am = formatAmount(amount);
  const pn = encodeURIComponent(PAYMENT_CONFIG.merchantName);
  const tr = encodeURIComponent(sanitizeTxnRef(orderId));
  const tn = encodeURIComponent(String(note || "Order Payment").slice(0, 50));
  const mc = PAYMENT_CONFIG.merchantCategoryCode.trim();
  // Omit an unknown category; production onboarding must supply the real MCC.
  const category = /^\d{4}$/.test(mc) && mc !== "0000" ? `&mc=${mc}` : "";
  return `pa=${encodeURIComponent(merchantUpi)}&pn=${pn}${category}&tr=${tr}&tn=${tn}&am=${am}&cu=INR`;
};

// Generate authentic NPCI UPI Intent Deep-Link URLs for specific apps
export const buildAppUpiUrl = ({ app = "gpay", amount, orderId, note }) => {
  const query = buildUpiQuery({ amount, orderId, note });

  // Android Chrome treats intent:// as an app handoff and keeps this page open.
  // upi:// opened with target=_blank leaves a broken error tab after GPay.
  if (isAndroidDevice()) {
    const pkg = UPI_APP_PACKAGES[app];
    const packagePart = pkg ? `package=${pkg};` : "";
    return `intent://pay?${query}#Intent;scheme=upi;${packagePart}end`;
  }

  if (isIosDevice()) {
    if (app === "phonepe") return `phonepe://pay?${query}`;
    if (app === "paytm") return `paytmmp://pay?${query}`;
    if (app === "gpay") return `gpay://upi/pay?${query}`;
  }

  if (app === "phonepe") return `phonepe://pay?${query}`;
  if (app === "paytm") return `paytmmp://pay?${query}`;
  return `upi://pay?${query}`;
};

// Match the static QR issued by YES Bank exactly. The bank QR intentionally
// contains no amount or order reference; the payer enters the checkout amount
// in the UPI app after scanning it.
export const buildUpiQrString = () => {
  const merchantUpi = getActiveMerchantUpi().trim() || PAYMENT_CONFIG.merchantUpiId;
  const mc = PAYMENT_CONFIG.merchantCategoryCode.trim();
  const category = /^\d{4}$/.test(mc) ? `mc=${mc}&` : "";
  return `upi://pay?${category}pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent(PAYMENT_CONFIG.merchantName)}`;
};

// Launch the UPI app without opening a new browser tab.
// Returns false on desktop, where upi:// would replace this page with an error.
export const triggerUpiAppLaunch = (url) => {
  if (!url || typeof document === "undefined") return false;
  if (!isAndroidDevice() && !isIosDevice()) return false;
  try {
    const link = document.createElement("a");
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        link.remove();
      } catch (err) {}
    }, 500);
    return true;
  } catch (e) {
    try {
      window.location.assign(url);
      return true;
    } catch (err) {
      return false;
    }
  }
};

// Generate standard NPCI UPI Intent Deep-Link URL
export const generateUpiIntentUrl = ({ amount, orderId, note = 'Order Payment' }) => {
  return buildAppUpiUrl({ app: 'generic', amount, orderId, note });
};
