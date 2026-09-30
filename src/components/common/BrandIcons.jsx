import React from 'react';

// Official Meeso Brand Logo (Icon + Wordmark)
export const MeesoLogo = ({ className = "" }) => (
  <div className={`flex items-center gap-1.5 select-none ${className}`}>
    {/* Meeso iconic squircle */}
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#931b6e] text-white flex items-center justify-center font-black text-sm sm:text-base shadow-2xs tracking-tighter shrink-0">
      m
    </div>
    {/* Meeso Wordmark */}
    <span className="font-black text-xl sm:text-2xl text-[#242526] tracking-tight lowercase font-sans">
      mee<span className="text-[#931b6e]">so</span>
    </span>
  </div>
);
export const MeeshoLogo = MeesoLogo;

// Authentic Google Pay Icon
export const GooglePayIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.6 20.5H42V20H24V28H35.3C33.7 32.7 29.2 36 24 36C17.4 36 12 30.6 12 24C12 17.4 17.4 12 24 12C27 12 29.7 13.1 31.8 15L37.5 9.3C33.9 6 29.2 4 24 4C13 4 4 13 4 24C4 35 13 44 24 44C35 44 43.6 36 43.6 24C43.6 22.8 43.5 21.6 43.6 20.5Z" fill="#FFC107"/>
    <path d="M6.3 14.7L12.9 19.5C14.7 15.1 19 12 24 12C27 12 29.7 13.1 31.8 15L37.5 9.3C33.9 6 29.2 4 24 4C16.3 4 9.8 8.4 6.3 14.7Z" fill="#FF3D00"/>
    <path d="M24 44C29.1 44 33.7 42.1 37.3 38.9L31.2 33.7C29.2 35.2 26.7 36 24 36C18.9 36 14.5 32.8 12.8 28.3L6.2 33.4C9.6 39.8 16.3 44 24 44Z" fill="#4CAF50"/>
    <path d="M43.6 24C43.6 22.8 43.5 21.6 43.3 20.5H24V28H35.3C34.6 30.2 33.2 32.2 31.2 33.7L37.3 38.9C41.2 35.3 43.6 30.1 43.6 24Z" fill="#1976D2"/>
  </svg>
);

// Authentic PhonePe Icon
export const PhonePeIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#5F259F"/>
    <path d="M66.7 34.3H56.5C56.5 29.2 53.8 26.5 48.7 26.5H41.1V73.5H48.7V57.8H56.5C64.6 57.8 70.3 52.4 70.3 44.3C70.3 37.6 66.7 34.3 66.7 34.3ZM56.5 50.7H48.7V33.6H56.5C61.1 33.6 63.2 35.6 63.2 42.2C63.2 48.7 61.1 50.7 56.5 50.7Z" fill="white"/>
    <path d="M37.5 44.3V34.3H30V44.3H37.5Z" fill="white"/>
  </svg>
);

// Authentic Paytm Icon
export const PaytmIcon = ({ className = "w-7 h-7" }) => (
  <div className={`${className} bg-[#002e6e] rounded-lg flex items-center justify-center p-1 text-white font-black text-[11px] tracking-tighter leading-none shadow-xs`}>
    <span className="text-[#00b9f5]">pay</span><span>tm</span>
  </div>
);

// Tri-color Indian Ribbon Icon for UPI offer
export const TricolorRibbon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V9H3V5Z" fill="#FF9933" />
    <path d="M3 9H21V15H3V9Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
    <circle cx="12" cy="12" r="2" fill="#000080" />
    <path d="M3 15H21V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15Z" fill="#138808" />
  </svg>
);

// Meesho Pay Later Calendar/Clock icon
export const PayLaterCalendarIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" className="text-[#931b6e]"/>
    <line x1="16" y1="2" x2="16" y2="6" className="text-[#931b6e]"/>
    <line x1="8" y1="2" x2="8" y2="6" className="text-[#931b6e]"/>
    <line x1="3" y1="10" x2="21" y2="10" className="text-[#931b6e]"/>
    <circle cx="12" cy="15" r="2" fill="#931b6e"/>
  </svg>
);
