import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  Search,
  Phone,
  MapPin,
  FileText,
  Volume2,
  VolumeX,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Download,
  Trash2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Plus,
  Edit3,
  Save,
  Smartphone
} from 'lucide-react';
import { useOrders, playOrderNotificationSound } from '../context/OrderContext';
import { MeesoLogo } from '../components/common/BrandIcons';
import InvoiceModal from '../components/checkout/InvoiceModal';
import { useToast } from '../context/ToastContext';
import { getActiveMerchantUpi, setActiveMerchantUpi, validateUpiId } from '../data/paymentConfig';


export const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder, clearAllOrders, addOrder } = useOrders();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Store Receiving UPI ID Management
  const [currentMerchantUpi, setCurrentMerchantUpi] = useState(() => getActiveMerchantUpi());
  const [editingUpi, setEditingUpi] = useState(false);
  const [upiInputValue, setUpiInputValue] = useState(() => getActiveMerchantUpi());
  const [upiError, setUpiError] = useState('');

  const handleSaveUpiId = () => {
    const trimmed = upiInputValue.trim();
    if (!trimmed) {
      setUpiError('Please enter a UPI ID');
      return;
    }
    setActiveMerchantUpi(trimmed);
    setCurrentMerchantUpi(trimmed);
    setEditingUpi(false);
    setUpiError('');
    showToast(`Store Receiver UPI ID updated to: ${trimmed} ✅`, 'success');
  };


  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        order.orderId?.toLowerCase().includes(q) ||
        order.customerName?.toLowerCase().includes(q) ||
        order.phone?.includes(q) ||
        order.address?.toLowerCase().includes(q) ||
        order.productName?.toLowerCase().includes(q) ||
        order.utrNumber?.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatusTab === 'ALL' ||
        (selectedStatusTab === 'PENDING' && (order.paymentStatus?.includes('Pending') || order.status === 'Pending Verification')) ||
        (selectedStatusTab === 'PAID' && (order.paymentStatus?.includes('PAID') || order.paymentStatus?.includes('Verified'))) ||
        (selectedStatusTab === 'ACCEPTED' && order.status === 'Accepted') ||
        (selectedStatusTab === 'SHIPPED' && order.status === 'Shipped') ||
        (selectedStatusTab === 'DELIVERED' && order.status === 'Delivered');

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatusTab]);

  // Dashboard calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.amountPaid) || 0), 0);
  }, [orders]);

  const verifiedPaymentsCount = useMemo(() => {
    return orders.filter((o) => o.paymentStatus?.includes('PAID') || o.paymentStatus?.includes('Verified')).length;
  }, [orders]);

  const shippedCount = useMemo(() => {
    return orders.filter((o) => o.status === 'Shipped').length;
  }, [orders]);

  // Quick WhatsApp message trigger
  const handleWhatsAppCustomer = (order) => {
    const cleanPhone = (order.phone || '').replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const msg = encodeURIComponent(
      `Namaste ${order.customerName}! Your Meeso order #${order.orderId} for "${order.productName}" (Amount: ₹${order.amountPaid}) has been confirmed. Current Status: ${order.status}. AWB Tracking: ${order.awbNumber}. Thank you for shopping with Meeso!`
    );
    window.open(`https://wa.me/${phoneWithCode}?text=${msg}`, '_blank');
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No orders to export', 'info');
      return;
    }

    const headers = [
      'Order ID',
      'Placed At',
      'Customer Name',
      'Phone',
      'Shipping Address',
      'Product Name',
      'Size / Option',
      'Quantity',
      'Amount Paid (INR)',
      'Payment Mode',
      'UTR / Ref No',
      'Payment Status',
      'Order Status',
      'AWB Number'
    ];

    const rows = orders.map((o) => [
      `"${o.orderId || o.id}"`,
      `"${o.placedAt || ''}"`,
      `"${o.customerName || ''}"`,
      `"${o.phone || ''}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${(o.productName || '').replace(/"/g, '""')}"`,
      `"${o.size || ''}"`,
      o.quantity || 1,
      o.amountPaid || 0,
      `"${o.paymentMode || ''}"`,
      `"${o.utrNumber || ''}"`,
      `"${o.paymentStatus || ''}"`,
      `"${o.status || ''}"`,
      `"${o.awbNumber || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Meeso_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV successfully! 📥', 'success');
  };

  // Seed sample demo order
  const handleAddSampleOrder = () => {
    addOrder({
      orderId: `MEE-${Math.floor(100000 + Math.random() * 900000)}`,
      productName: 'Celestia- Embroidered saree (Off white)',
      productImage: 'https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_b184d52a-1b8b-4e01-ace5-2e9dbd4a2f49.png?v=1769340913',
      size: '34- Padded',
      quantity: 1,
      amountPaid: 599,
      paymentMode: 'Google Pay (Direct UPI)',
      utrNumber: `4267${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerName: 'Kavita Dave',
      phone: '9876543210',
      address: 'Kavita Dave, 402 Galaxy Heights, Near Iscon Temple, Ahmedabad - 380015',
      pincode: '380015',
      status: 'Accepted',
      paymentStatus: 'PAID (Verified Online)'
    });
    showToast('Demo order added! Admin notification triggered 🔔', 'success');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 pb-20">
      {/* Top Admin Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <MeesoLogo className="h-6 sm:h-7" />
              <span className="bg-[#931b6e] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Sync Status */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Sync</span>
            </div>

            {/* Audio Alert Toggle */}
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) {
                  playOrderNotificationSound();
                  showToast('Sound alerts enabled 🔔', 'info');
                }
              }}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                soundEnabled
                  ? 'bg-fuchsia-50 border-fuchsia-200 text-[#931b6e]'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
              title="Toggle Audio Notifications"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>

            {/* Customer Storefront Link */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3 py-1.5 bg-[#931b6e] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs hover:bg-[#771f34] transition-all cursor-pointer"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Orders */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#931b6e] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-950">{orders.length}</div>
            <p className="text-[11px] text-gray-500">Customer orders placed</p>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">100% Direct Bank Payments</p>
          </div>

          {/* Card 3: Verified Online Payments */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">UPI Payments</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-700">{verifiedPaymentsCount}</div>
            <p className="text-[11px] text-gray-500">Google Pay / PhonePe verified</p>
          </div>

          {/* Card 4: Orders Shipped */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Shipped</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{shippedCount}</div>
            <p className="text-[11px] text-gray-500">In transit to customer</p>
          </div>
        </div>

        {/* Store Receiving UPI ID Management Banner */}
        <div className="bg-white p-4 rounded-2xl border-2 border-fuchsia-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-[#931b6e] flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">
                  Store Receiving UPI ID (All Customer Payments Go Here)
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-sm sm:text-base font-black text-gray-950 select-all">
                    {currentMerchantUpi}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {editingUpi ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={upiInputValue}
                    onChange={(e) => {
                      setUpiInputValue(e.target.value);
                      setUpiError('');
                    }}
                    placeholder="e.g. mobile@okaxis, mobile@ybl, mobile@paytm"
                    className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono outline-none focus:border-[#931b6e] focus:bg-white"
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleSaveUpiId}
                      className="px-3 py-1.5 bg-[#931b6e] hover:bg-[#771f34] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUpi(false);
                        setUpiInputValue(currentMerchantUpi);
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUpi(true);
                    setUpiInputValue(currentMerchantUpi);
                  }}
                  className="px-3 py-2 bg-fuchsia-50 hover:bg-fuchsia-100 text-[#931b6e] font-bold rounded-xl text-xs border border-fuchsia-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Change Receiver UPI ID</span>
                </button>
              )}
            </div>
          </div>
          {upiError && (
            <p className="text-rose-600 text-xs font-semibold mt-2">{upiError}</p>
          )}
        </div>

        {/* Action Controls & Filters */}

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone, order ID, or UTR..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#931b6e] focus:bg-white transition-all"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Export all orders to Excel / CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleAddSampleOrder}
                className="flex-1 sm:flex-none px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Add a sample order to test the panel"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Demo Order</span>
              </button>

              {orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all orders?')) {
                      clearAllOrders();
                      showToast('All orders cleared', 'info');
                    }
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer transition-colors"
                  title="Clear all orders"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-gray-100 pt-3">
            {[
              { id: 'ALL', label: `All (${orders.length})` },
              { id: 'PENDING', label: `⚠️ Pending Verify (${orders.filter((o) => o.paymentStatus?.includes('Pending') || o.status === 'Pending Verification').length})` },
              { id: 'PAID', label: `Paid & Verified (${verifiedPaymentsCount})` },
              { id: 'ACCEPTED', label: `Accepted (${orders.filter((o) => o.status === 'Accepted').length})` },
              { id: 'SHIPPED', label: `Shipped (${shippedCount})` },
              { id: 'DELIVERED', label: `Delivered (${orders.filter((o) => o.status === 'Delivered').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedStatusTab === tab.id
                    ? 'bg-[#931b6e] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List Container */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">No Orders Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {orders.length === 0
                ? 'No customer has placed an order yet. When a customer orders or pays via Google Pay/PhonePe, it will appear here in real time!'
                : 'No orders match your search or status filter.'}
            </p>
            {orders.length === 0 && (
              <button
                type="button"
                onClick={handleAddSampleOrder}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#931b6e] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#771f34] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Place Test Demo Order</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const cleanPhone = (order.phone || '').replace(/\D/g, '');

              return (
                <div
                  key={order.orderId || order.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Order Top Bar */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs sm:text-sm text-gray-950">
                        #{order.orderId || order.id}
                      </span>
                      <span className="text-[11px] text-gray-500">• {order.placedAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Payment Badge */}
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                          order.paymentStatus?.includes('PAID') || order.paymentStatus?.includes('Verified')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{order.paymentStatus || 'PAID (Verified)'}</span>
                      </span>

                      {/* Fulfillment Status Badge */}
                      <select
                        value={order.status || 'Accepted'}
                        onChange={(e) => updateOrderStatus(order.orderId || order.id, e.target.value)}
                        className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                          order.status === 'Delivered'
                            ? 'bg-green-50 text-green-700 border-green-300'
                            : order.status === 'Shipped'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : order.status === 'Packed'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : order.status === 'Pending Verification'
                            ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
                            : 'bg-blue-50 text-blue-700 border-blue-300'
                        }`}
                      >
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left: Product & Variant (5 cols) */}
                    <div className="md:col-span-4 flex items-start gap-3">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border border-gray-200 shrink-0 shadow-2xs"
                      />
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight">
                          {order.productName}
                        </h4>
                        <p className="text-[11px] text-gray-600">
                          Selected Size / Option: <strong className="text-[#931b6e]">{order.size}</strong>
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Qty: <strong className="text-gray-800">{order.quantity || 1}</strong>
                        </p>
                        <div className="pt-1">
                          <span className="text-xs text-gray-400">Total Price: </span>
                          <span className="text-sm font-black text-[#038d63]">₹{order.amountPaid}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Customer & Delivery Address (4 cols) */}
                    <div className="md:col-span-4 space-y-2 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4 pt-3 md:pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Customer & Delivery
                        </span>

                        {/* Direct WhatsApp & Call Buttons */}
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleWhatsAppCustomer(order)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-gray-900">{order.customerName}</p>
                        <p className="text-gray-600 font-mono text-[11px]">📱 {order.phone}</p>
                        <div className="flex items-start gap-1.5 text-[11px] text-gray-600 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span>{order.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Payment Details & Invoice (4 cols) */}
                    <div className="md:col-span-4 space-y-2.5 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4 pt-3 md:pt-0 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Payment Verification
                        </span>

                        <div className="p-2.5 bg-gray-50 rounded-xl space-y-1 text-xs border border-gray-150">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-[11px]">Paid Method:</span>
                            <span className="font-bold text-[#931b6e] text-[11px]">{order.paymentMode}</span>
                          </div>

                          <div className="flex items-center justify-between bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200">
                            <span className="text-emerald-900 font-bold text-[11px]">12-Digit UTR:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-black text-emerald-950">
                                {order.utrNumber || 'N/A'}
                              </span>
                              {order.utrNumber && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.utrNumber);
                                    showToast('UTR copied to clipboard! 📋', 'info');
                                  }}
                                  className="text-[10px] text-emerald-700 hover:text-emerald-900 underline font-bold cursor-pointer"
                                  title="Copy UTR to verify in Axis Bank"
                                >
                                  Copy
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-[11px]">Receiving Store UPI:</span>
                            <span className="font-mono text-[10px] text-gray-800 font-bold truncate max-w-[150px]">
                              {currentMerchantUpi}
                            </span>
                          </div>

                          {/* Quick Admin Verification Actions for YUG ENTERPRISE */}
                          {(order.paymentStatus?.includes('Pending') || order.status === 'Pending Verification') && (
                            <div className="pt-2 border-t border-amber-200 space-y-1.5 bg-amber-50/80 p-2 rounded-lg">
                              <p className="text-[10px] text-amber-900 font-bold leading-tight">
                                ⚠️ Bank SMS / UPI App માં ₹{order.amountPaid} ચેક કરો:
                              </p>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    updatePaymentStatus(order.orderId || order.id, 'PAID (Axis Bank Verified)');
                                    updateOrderStatus(order.orderId || order.id, 'Accepted');
                                    showToast(`Order #${order.orderId} Approved! Payment Verified ✅`, 'success');
                                  }}
                                  className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve (₹{order.amountPaid} Received)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updatePaymentStatus(order.orderId || order.id, 'Payment Failed (Unpaid / Fake)');
                                    updateOrderStatus(order.orderId || order.id, 'Cancelled');
                                    showToast(`Order #${order.orderId} Rejected as Unpaid ❌`, 'info');
                                  }}
                                  className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>Reject Fake</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {order.awbNumber && (
                            <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                              <span className="text-gray-500 text-[10px]">AWB Tracking:</span>
                              <span className="font-mono text-[10px] text-gray-700">{order.awbNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="flex-1 py-1.5 px-3 bg-white border border-gray-300 hover:border-[#931b6e] hover:text-[#931b6e] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Tax Invoice</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete order #${order.orderId}?`)) {
                              deleteOrder(order.orderId || order.id);
                              showToast('Order deleted', 'info');
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Reusable Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
