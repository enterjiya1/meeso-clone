import React, { useState } from 'react';
import { X, Package, Truck, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import OrderTrackingModal from '../checkout/OrderTrackingModal';
import InvoiceModal from '../checkout/InvoiceModal';

export const OrdersDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { orders, ordersCount, openTracking } = useOrders();
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
        <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-[#931b6e] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-white" />
              <h3 className="font-bold text-sm">
                My Orders ({ordersCount})
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {ordersCount === 0 ? (
              <div className="py-16 text-center space-y-3 text-gray-400">
                <Package className="w-12 h-12 mx-auto stroke-[1.2] text-gray-300" />
                <p className="font-semibold text-gray-700">No orders placed yet</p>
                <p className="text-[11px]">Your confirmed orders and live shipping updates will appear here.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-3 rounded-2xl border border-gray-200 bg-white shadow-2xs space-y-2.5 hover:border-[#931b6e] transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="font-mono text-[10px] text-gray-500 font-bold">
                      #{order.orderId}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-[#038d63] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Confirmed
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={order.productImage || '/product1_main.jpg'}
                      alt={order.productName}
                      className="w-13 h-16 object-cover rounded-xl border shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="font-bold text-gray-950 truncate">{order.productName}</h4>
                      <p className="text-gray-500 text-[11px]">
                        Size: <strong className="text-[#931b6e]">{order.size}</strong> • Paid:{' '}
                        <strong className="text-gray-900">₹{order.amountPaid}</strong>
                      </p>
                      <p className="text-[10px] text-[#038d63] font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3 shrink-0" />
                        <span>Delivery by {order.deliveryDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openTracking(order, false);
                      }}
                      className="flex-1 py-1.5 bg-[#931b6e] hover:bg-[#771f34] text-white font-bold rounded-lg text-center text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Truck className="w-3 h-3" />
                      <span>Track Shipment</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForInvoice(order)}
                      className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedOrderForInvoice && (
        <InvoiceModal
          isOpen={Boolean(selectedOrderForInvoice)}
          onClose={() => setSelectedOrderForInvoice(null)}
          order={selectedOrderForInvoice}
        />
      )}
    </>
  );
};

export default OrdersDrawer;
