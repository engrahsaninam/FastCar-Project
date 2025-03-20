// app/checkout/components/PriceSummary.jsx
import React, { useState } from 'react';
import { Info, ChevronDown, X } from 'lucide-react';

const MobileDrawer = ({ isOpen, onClose, children }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Price Summary</h3>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const PriceSummaryContent = ({ isMobile = false }) => {
  const baseClass = isMobile ? "bg-white" : "bg-white rounded-2xl shadow-xl";
  
  return (
    <div className={`${baseClass} p-7`}>
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl p-6 mb-7 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full transform -translate-x-12 translate-y-12" />
        
        <div className="relative">
          <div className="text-sm font-medium text-red-100/90">TOTAL PRICE INCL. SERVICES</div>
          <div className="text-3xl font-bold mt-2 text-white tracking-tight">CZK 647,765</div>
          <div className="text-xs text-red-100/80 mt-1.5">CZK 542,965 without VAT</div>
        </div>
      </div>

      {/* Car details with premium styling */}
      <div className="border-b border-gray-100 pb-5 mb-5">
        <div className="text-base font-semibold text-gray-900 mb-3">Mercedes-Benz A 200 d 110 kW</div>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price incl. necessary import services</span>
            <span className="text-sm font-semibold text-gray-900">CZK 634,490</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Price without VAT</span>
            <span className="text-sm text-gray-500">CZK 447,915</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 bg-gray-50 rounded-lg p-2.5">
            <span className="text-xs text-gray-600">The price is recalculated from 25.65 €/CZK</span>
            <Info className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* CarAudit with premium hover effect */}
      <div className="border-b border-gray-100 pb-5 mb-5">
        <div className="flex justify-between items-center hover:bg-red-50/40 p-2.5 rounded-lg transition-all duration-300">
          <span className="text-sm font-medium text-gray-800">CarAudit™</span>
          <span className="text-sm font-semibold text-gray-900">CZK 1,990</span>
        </div>
      </div>

      {/* Additional Services with premium styling */}
      <div className="mb-7">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Additional Services</div>
        <div className="space-y-3">
          {[
            { label: 'Home delivery', price: 'CZK 15,005', hasDropdown: true },
            { label: '12 liters of fuel', price: 'FREE', isFree: true },
            { label: 'Import MOT', price: 'CZK 4,490' },
            { label: 'Administration Fee', price: 'CZK 800' },
            { label: 'Car registration', price: 'CZK 1,990' },
            { label: 'Extended warranty', price: 'FREE', isFree: true }
          ].map((service, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-2.5 hover:bg-gray-50 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{service.label}</span>
                {service.hasDropdown && (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <span className={`
                ${service.isFree 
                  ? "px-2.5 py-1 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-sm" 
                  : "text-sm font-medium text-gray-900"}
              `}>
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Services with premium card style */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 mb-7">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Optional Services</div>
        <div className="text-xs text-gray-600">
          Other recommended services can be selected in the car order
        </div>
      </div>

      {/* Total Price with premium styling */}
      <div className="border-t border-gray-100 pt-5 mb-7">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-800">Total price</span>
          <span className="text-2xl font-bold text-red-600">CZK 667,765</span>
        </div>
      </div>

      {/* Financing Note with premium gradient */}
      <div className="bg-gradient-to-br from-red-50 via-red-50/50 to-transparent rounded-xl p-5 border border-red-100/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-700">You are financing car for example for</span>
          <span className="text-base font-bold text-red-600">CZK 5,557/mo</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span>120%, 48 instalments</span>
          <Info className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

const PriceSummary = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block sticky top-4">
        <PriceSummaryContent />
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        {/* Floating Total Bar */}
        <div 
          className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center"
          onClick={() => setIsDrawerOpen(true)}
        >
          <div>
            <div className="text-xs text-gray-500">Total price</div>
            <div className="text-lg font-bold">CZK 667,765</div>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            View Details
          </button>
        </div>

        {/* Mobile Drawer */}
        <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <PriceSummaryContent isMobile />
        </MobileDrawer>
      </div>
    </>
  );
};

export default PriceSummary;