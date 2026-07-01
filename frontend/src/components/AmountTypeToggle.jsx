import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

export const AmountTypeToggle = ({ value, onChange, className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200 ${className}`}>
      <button
        type="button"
        onClick={() => onChange("amount")}
        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
          value === "amount" 
            ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Flat
      </button>

      <button
        type="button"
        onClick={() => onChange(value === "amount" ? "percentage" : "amount")}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200 flex-shrink-0"
        title="Toggle type"
      >
        <ArrowRightLeft className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onChange("percentage")}
        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
          value === "percentage" 
            ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        %
      </button>
    </div>
  );
};
