import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  ShoppingBag,
  ExternalLink,
  PhoneCall,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MeeshoLogo } from '../common/BrandIcons';
import InvoiceModal from './InvoiceModal';

export const OrderTrackingModal = ({
  isOpen,
  onClose,
  order,
  isJustPlaced = false,
  onContinueShopping
}) => {
  if (!isOpen || !order) return null;

  const [showHubMilestones, setShowHubMilestones] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (isJustPlaced) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isJustPlaced]);

  // Dynamic delivery date formatted
  const deliveryDateText =
    order.deliveryDate ||
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

  const placedDateText =
    order.placedAt ||
    new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const trackingAwb = order.awbNumber || `DEL${Math.floor(100000000 + Math.random() * 900000000)}`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[94vh] flex flex-col shadow-2xl relative overflow-hidden border border-gray-100 animate-slide-up">
          {/* Top Bar matching Meesho */}
          <div className="px-4 py-3 bg-[#931b6e] text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center font-black text-sm">
                m
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm">
                  {isJustPlaced ? 'Order Confirmed!' : 'Order & Shipping Tracking'}
                </h3>
                <p className="text-[10px] text-fuchsia-100">
                  Meeso Assured • Order #{order.orderId}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/15 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-gray-800">
            {/* 1. Big Green Order Confirmed Banner */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
              <div className="w-13 h-13 rounded-full bg-emerald-100 text-[#038d63] flex items-center justify-center mx-auto shadow-xs animate-bounce-short">
                <CheckCircle2 className="w-8 h-8 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#038d63] bg-emerald-100/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Payment Verified
                </span>
                <h4 className="text-base sm:text-lg font-black text-gray-950 mt-1">
                  Order Placed Successfully!
                </h4>
                <p className="text-[11px] text-gray-600">
                  Seller <strong className="text-gray-900">YUG ENTERPRISE</strong> has received your order.
                </p>
              </div>

              {/* Estimated Delivery Highlight */}
              <div className="mt-2 pt-2.5 border-t border-emerald-200/70 flex items-center justify-center gap-2 text-emerald-950 font-bold text-xs">
                <Truck className="w-4 h-4 text-[#038d63] shrink-0" />
                <span>
                  Estimated Delivery by{' '}
                  <span className="text-[#038d63] underline decoration-emerald-400 font-extrabold">
                    {deliveryDateText}
                  </span>
                </span>
              </div>
            </div>

            {/* 2. Meesho Shipping Stepper (Live Timeline) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-gray-950 text-xs">
                  <Truck className="w-4 h-4 text-[#931b6e]" />
                  <span>Live Delivery Tracking</span>
                </div>
                <span className="text-[10px] font-mono bg-fuchsia-50 text-[#931b6e] font-bold px-2 py-0.5 rounded">
                  Delhivery Express: {trackingAwb}
                </span>
              </div>

              {/* Stepper Steps */}
              <div className="relative pl-6 space-y-4 pt-1">
                {/* Vertical connecting line */}
                <div className="absolute left-2.75 top-2 bottom-3 w-0.5 bg-gray-200" />
                <div className="absolute left-2.75 top-2 h-14 w-0.5 bg-[#038d63]" />

                {/* Step 1: Order Confirmed (Completed) */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#038d63] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-gray-950 text-xs">Order Confirmed</p>
                      <span className="text-[10px] text-gray-500 font-medium">{placedDateText}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-tight">
                      Order verified & payment of ₹{order.amountPaid} confirmed via {order.paymentMode}.
                    </p>
                  </div>
                </div>

                {/* Step 2: Packed & Dispatched (Active / In Progress) */}
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
                      Item packed by <strong>YUG ENTERPRISE</strong> at Surat Central Logistics Hub.
                    </p>
                  </div>
                </div>

                {/* Step 3: Shipped / In Transit */}
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
                      Courier: Delhivery Express (AWB: {trackingAwb}). Dispatched to destination sorting hub.
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
                      Delivery executive will call prior to delivery at your doorstep.
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
                      <span className="text-[10px] font-bold text-gray-900">{deliveryDateText}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                      Package will be safely handed over with contactless delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expandable Courier Milestones */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowHubMilestones(!showHubMilestones)}
                  className="w-full flex items-center justify-between text-[#931b6e] font-bold text-[11px] hover:underline cursor-pointer py-1"
                >
                  <span>{showHubMilestones ? 'Hide Detailed Hub Milestones' : 'View Detailed Hub Milestones'}</span>
                  {showHubMilestones ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showHubMilestones && (
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 mt-2 space-y-2 text-[10px] text-gray-600 animate-fade-in font-mono">
                    <div className="flex justify-between">
                      <span>• Order Created & Payment Verified:</span>
                      <span className="font-bold text-gray-900">Surat, Gujarat (Done)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Seller Manifest Generated:</span>
                      <span className="text-gray-800">Yug Warehouse (Surat)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Delhivery Pickup Hub:</span>
                      <span className="text-gray-800">Ring Road Express Center</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Destination Line-Haul:</span>
                      <span className="text-gray-500">Scheduled Overnight</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Local Delivery Hub:</span>
                      <span className="text-gray-500">Destination Hub Sorting</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Ordered Product Item Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3.5 space-y-2 shadow-2xs">
              <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
                Item in this shipment (1)
              </span>
              <div className="flex gap-3 items-center">
                <img
                  src={order.productImage || '/product1_main.jpg'}
                  alt={order.productName}
                  className="w-14 h-18 object-cover rounded-xl border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <h5 className="font-bold text-gray-950 truncate text-xs">{order.productName}</h5>
                  <p className="text-gray-500 text-[11px]">
                    Size: <strong className="text-[#931b6e] font-bold">{order.size}</strong> • Qty:{' '}
                    <strong>{order.quantity || 1}</strong>
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Seller: <span className="font-semibold text-gray-800">YUG ENTERPRISE</span> (4.1 ★)
                  </p>
                  <p className="text-xs font-black text-gray-900">₹{order.amountPaid}</p>
                </div>
              </div>
            </div>

            {/* 4. Delivery Address Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-gray-950 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#931b6e]" />
                <span>Delivery Address</span>
              </div>
              <p className="text-gray-700 text-[11px] leading-relaxed">
                <strong>{order.customerName || order.address?.split(',')[0] || 'Ananya Sharma'}</strong>
                <br />
                {order.address || 'B-402, Lotus Greens, Park Street, Mumbai - 400001'}
                <br />
                Phone: <span className="font-mono">{order.phone || '+91 98765 43210'}</span>
              </p>
            </div>

            {/* 5. Payment Details Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3.5 space-y-2 shadow-2xs">
              <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
                Payment & Price Summary
              </span>
              <div className="space-y-1 text-[11px] text-gray-600">
                <div className="flex justify-between">
                  <span>Product Price:</span>
                  <span>₹{order.amountPaid + 6}</span>
                </div>
                <div className="flex justify-between text-[#038d63] font-semibold">
                  <span>Instant UPI Discount:</span>
                  <span>-₹6</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="text-[#038d63] font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-black text-gray-950 text-xs pt-1.5 border-t border-gray-100">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#931b6e]">₹{order.amountPaid}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 bg-gray-50 -mx-3.5 -mb-3.5 p-3 rounded-b-2xl space-y-1 text-[10px] text-gray-600 font-mono">
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <strong className="text-gray-900 font-sans">{order.paymentMode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Bank UTR / Ref:</span>
                  <span className="text-gray-900">{order.utrNumber || 'Not verified'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-[#038d63] font-sans font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> SUCCESS (NPCI Verified)
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInvoice(true)}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Tax Invoice (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onContinueShopping) onContinueShopping();
                }}
                className="w-full py-3.5 bg-[#931b6e] hover:bg-[#771f34] text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping Kurtis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {showInvoice && (
        <InvoiceModal
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
          order={order}
        />
      )}
    </>
  );
};

export default OrderTrackingModal;
