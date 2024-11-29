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
  const baseClass = isMobile ? "bg-white" : "bg-red-50/85 rounded-lg shadow-sm";
  
  return (
    <div className={`${baseClass} p-4`}>
      {/* Header */}
      <div className="bg-red-500 rounded-lg p-4 mb-4">
        <div className="text-sm font-medium text-white">TOTAL PRICE OF THE CAR INCL. SERVICES</div>
        <div className="text-xl font-bold mt-1 text-white">CZK 647,765</div>
        <div className="text-xs text-white">CZK 542,965 without VAT</div>
      </div>

      {/* Car details */}
      <div className="border-b pb-3 mb-3">
        <div className="text-sm font-medium mb-2">Mercedes-Benz A 200 d 110 kW</div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Price incl. necessary import services</span>
          <span className="font-medium">CZK 634,490</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Price without VAT</span>
          <span>CZK 447,915</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <span>The price is recalculated from 25.65 €/CZK</span>
          <Info className="w-3 h-3" />
        </div>
      </div>

      {/* CarAudit */}
      <div className="border-b pb-3 mb-3">
        <div className="flex justify-between items-center text-sm">
          <span>CarAudit™</span>
          <span className="font-medium">CZK 1,990</span>
        </div>
      </div>

      {/* Additional Services */}
      <div className="mb-3">
        <div className="text-xs font-medium text-gray-500 mb-2">ADDITIONAL SERVICES</div>
        <div className="space-y-1.5">
          {[
            { label: 'Home delivery', price: 'CZK 15,005', hasDropdown: true },
            { label: '12 liters of fuel', price: 'FREE', isFree: true },
            { label: 'Import MOT', price: 'CZK 4,490' },
            { label: 'Administration Fee', price: 'CZK 800' },
            { label: 'Car registration', price: 'CZK 1,990' },
            { label: 'Extended warranty', price: 'FREE', isFree: true }
          ].map((service, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <span>{service.label}</span>
                {service.hasDropdown && <ChevronDown className="w-3 h-3" />}
              </div>
              <span className={service.isFree ? 
                "px-1.5 py-0.5 text-xs text-white bg-green-500 rounded" : 
                "font-medium"}>
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Services */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 mb-1">OPTIONAL SERVICES</div>
        <div className="text-xs text-gray-400">
          Other recommended services can be selected in the car order
        </div>
      </div>

      {/* Total Price */}
      <div className="border-t pt-3 mb-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total price</span>
          <span className="text-lg font-bold">CZK 667,765</span>
        </div>
      </div>

      {/* Financing Note */}
      <div className="bg-blue-50 rounded-lg p-3 text-sm">
        <div className="flex justify-between items-center mb-1">
          <span>You are financing car for example for</span>
          <span className="font-bold">CZK 5,557/mo</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>120%, 48 instalments</span>
          <Info className="w-3 h-3" />
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