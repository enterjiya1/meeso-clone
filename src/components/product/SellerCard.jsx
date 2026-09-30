import React, { useState } from 'react';
import { Store, Star, Award, ShieldCheck, X, Users, Package } from 'lucide-react';

export const SellerCard = ({
  sellerName = "YUG ENTERPRISE",
  sellerRating = 4.3,
  sellerFollowers = "24.5k",
  sellerProductsCount = 48
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold shrink-0">
            <Store className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Sold By
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-gray-900 tracking-tight">
                {sellerName}
              </span>
              <div className="inline-flex items-center gap-0.5 bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded text-[11px] leading-none">
                <span>{sellerRating}</span>
                <Star className="w-3 h-3 fill-white text-white" />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-xs font-bold text-brand-700 hover:text-brand-900 border border-brand-200 hover:border-brand-600 bg-brand-50/50 hover:bg-brand-50 px-3 py-1.5 rounded-xl transition-all"
        >
          View Seller
        </button>
      </div>

      {/* Seller Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              aria-label="Close seller profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center font-bold text-xl border border-brand-100">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">{sellerName}</h3>
                <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-4 h-4" /> Verified ETHNICORA Partner Seller
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center mb-4">
              <div>
                <span className="text-sm font-bold text-gray-900">{sellerRating} ★</span>
                <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Rating</span>
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900">{sellerFollowers}</span>
                <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Followers</span>
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900">{sellerProductsCount}+</span>
                <span className="block text-[10px] text-gray-500 uppercase mt-0.5">Products</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 mb-5">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span>Dispatch SLA:</span>
                <span className="font-semibold text-gray-800">Within 24 Hours</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span>Location:</span>
                <span className="font-semibold text-gray-800">Surat Textile Market, Gujarat</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span>Quality Score:</span>
                <span className="font-semibold text-emerald-700">98% Positive Feedback</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-brand-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerCard;
