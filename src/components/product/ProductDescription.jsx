import React, { useState } from 'react';
import { FileText, Shield, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const ProductDescription = ({ description = "", details = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <FileText className="w-4 h-4 text-brand-700" />
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Product Description & Specifications
        </h4>
      </div>

      {/* Main Paragraph */}
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
        {description}
      </p>

      {/* Structured Details */}
      {details && Object.keys(details).length > 0 && (
        <div className="pt-2 space-y-2.5 text-xs text-gray-700 border-t border-gray-50">
          {details.fabricDetails && (
            <div>
              <span className="font-bold text-gray-900">Fabric Details: </span>
              <span>{details.fabricDetails}</span>
            </div>
          )}
          {details.kurtaDetails && (
            <div>
              <span className="font-bold text-gray-900">Kurta Details: </span>
              <span>{details.kurtaDetails}</span>
            </div>
          )}
          {details.bottomDetails && (
            <div>
              <span className="font-bold text-gray-900">Bottomwear Details: </span>
              <span>{details.bottomDetails}</span>
            </div>
          )}
          {details.dupattaDetails && (
            <div>
              <span className="font-bold text-gray-900">Dupatta Details: </span>
              <span>{details.dupattaDetails}</span>
            </div>
          )}
          {details.careInstructions && (
            <div>
              <span className="font-bold text-gray-900">Wash & Care: </span>
              <span className="text-brand-900">{details.careInstructions}</span>
            </div>
          )}
          {details.countryOfOrigin && (
            <div>
              <span className="font-bold text-gray-900">Country of Origin: </span>
              <span>{details.countryOfOrigin}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
