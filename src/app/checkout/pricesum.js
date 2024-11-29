// app/checkout/components/PriceSummary.jsx
import React from 'react';
import { Info, ChevronDown } from 'lucide-react';

const PriceSummary = () => {
    return (
        <div className="bg-red-50/85 rounded-lg p-4 sticky top-4 shadow-sm">
            {/* Header */}
            <div className="bg-red-500 rounded-lg p-4 mb-4">
                <div className="text-sm font-medium text-white">TOTAL PRICE OF THE CAR INCL. SERVICES</div>
                <div className="text-xl font-bold mt-1 text-white">CZK 647,765</div>
                <div className="text-xs text-white">CZK 542,965 without VAT</div>
            </div>

            {/* Car details - More compact */}
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

            {/* CarAudit - Simplified */}
            <div className="border-b pb-3 mb-3">
                <div className="flex justify-between items-center text-sm">
                    <span>CarAudit™</span>
                    <span className="font-medium">CZK 1,990</span>
                </div>
            </div>

            {/* Additional Services - More compact */}
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

            {/* Optional Services - Simplified */}
            <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 mb-1">OPTIONAL SERVICES</div>
                <div className="text-xs text-gray-400">
                    Other recommended services can be selected in the car order
                </div>
            </div>

            {/* Total Price - More prominent */}
            <div className="border-t pt-3 mb-3">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Total price</span>
                    <span className="text-lg font-bold">CZK 667,765</span>
                </div>
            </div>

            {/* Financing Note - More compact */}
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

export default PriceSummary;