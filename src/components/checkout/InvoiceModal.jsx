import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { MeeshoLogo } from '../common/BrandIcons';

export const InvoiceModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const invoiceNo = `MEE-INV-2026-${order.orderId.replace(/[^0-9]/g, '').slice(-5) || '84920'}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const grossAmount = (order.amountPaid / 1.05).toFixed(2);
  const totalTax = (order.amountPaid - grossAmount).toFixed(2);
  const cgst = (totalTax / 2).toFixed(2);
  const sgst = (totalTax / 2).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl relative overflow-hidden border border-gray-200 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Top Bar (Hidden in print) */}
        <div className="px-4 py-3 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
              Tax Invoice & Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 text-xs text-gray-800 space-y-5 print:p-8">
          {/* Header Row */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <div>
              <MeeshoLogo className="h-7 sm:h-8" />
              <p className="text-[10px] text-gray-500 mt-1">
                Fashnear Technologies Pvt. Ltd. (Meeso Marketplace)
              </p>
              <p className="text-[10px] text-gray-500">
                Registered Office: Outer Ring Road, Bengaluru, Karnataka - 560103
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-50 text-[#038d63] border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                Original For Recipient
              </span>
              <h2 className="text-base font-black text-gray-950 mt-1">TAX INVOICE</h2>
              <p className="text-[11px] font-mono text-gray-600">Invoice No: {invoiceNo}</p>
              <p className="text-[11px] text-gray-600">Invoice Date: {invoiceDate}</p>
            </div>
          </div>

          {/* Seller and Buyer Details */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider text-[#931b6e]">
                Sold By (Seller)
              </p>
              <p className="font-bold text-gray-900 mt-0.5">YUG ENTERPRISE</p>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                402, Shree Ram Textile Market, Ring Road,
                <br />
                Surat, Gujarat - 395002
              </p>
              <p className="text-gray-700 font-mono text-[10px] mt-1">
                <strong>GSTIN:</strong> 24AAAFK2934D1Z8
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider text-[#931b6e]">
                Billing & Shipping Address
              </p>
              <p className="font-bold text-gray-900 mt-0.5">{order.address?.split(',')[0] || 'Customer'}</p>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                {order.address || 'Address provided during online checkout'}
              </p>
              <p className="text-gray-700 text-[10px] mt-1">
                <strong>Order ID:</strong> {order.orderId}
              </p>
            </div>
          </div>

          {/* Item Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-2 text-center">HSN</th>
                  <th className="py-2 px-2 text-center">Size</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Gross (₹)</th>
                  <th className="py-2 px-2 text-right">Tax (₹)</th>
                  <th className="py-2 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-3">
                    <p className="font-bold text-gray-950">{order.productName}</p>
                    <p className="text-[10px] text-gray-500">Women's Ethnic Kurti - Cotton/Rayon</p>
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-[11px]">6204</td>
                  <td className="py-3 px-2 text-center font-bold text-[#931b6e]">{order.size}</td>
                  <td className="py-3 px-2 text-center">{order.quantity || 1}</td>
                  <td className="py-3 px-2 text-right font-mono">₹{grossAmount}</td>
                  <td className="py-3 px-2 text-right font-mono text-gray-600">₹{totalTax}</td>
                  <td className="py-3 px-3 text-right font-bold text-gray-950 font-mono">
                    ₹{order.amountPaid}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Payment Info */}
          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
              <p className="font-bold text-gray-900 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#038d63]" />
                <span>Payment Information</span>
              </p>
              <div className="text-[11px] space-y-0.5 pt-1">
                <p>
                  <strong>Payment Mode:</strong> {order.paymentMode}
                </p>
                <p className="font-mono text-[10px] text-gray-600">
                  <strong>Bank UTR / Ref:</strong> {order.utrNumber}
                </p>
                <p>
                  <strong>Payment Status:</strong> <span className="text-[#038d63] font-bold">PAID (NPCI Verified)</span>
                </p>
                <p>
                  <strong>Courier:</strong> Delhivery Express Logistics (AWB: DEL984102948)
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-gray-600">
                <span>Taxable Value:</span>
                <span className="font-mono">₹{grossAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Central GST (CGST 2.5%):</span>
                <span className="font-mono">₹{cgst}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>State GST (SGST 2.5%):</span>
                <span className="font-mono">₹{sgst}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping & Handling:</span>
                <span className="text-[#038d63] font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-950 pt-1.5 border-t border-gray-200">
                <span>Total Amount Paid:</span>
                <span className="text-[#931b6e] font-mono">₹{order.amountPaid}.00</span>
              </div>
            </div>
          </div>

          {/* Footer declaration */}
          <div className="pt-4 border-t border-gray-200 flex justify-between items-end text-[10px] text-gray-500">
            <div>
              <p>This is a computer-generated tax invoice and does not require a physical signature.</p>
              <p>For return/replacement, refer to Meeso policy within 7 days of delivery.</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">YUG ENTERPRISE</p>
              <p className="text-[9px] text-gray-400">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in print) */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-[#931b6e] hover:bg-[#771f34] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download / Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
