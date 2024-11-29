"use client";
import React from 'react';

const CarValuationForm = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-[1200px]">
        <h1 className="text-[32px] font-bold text-center text-gray-900 mb-16">
          Are you selling or trading in?
        </h1>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
          {/* Left Side - Process Steps */}
          <div className="flex-1">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-10 w-0.5 h-[calc(100%-4rem)] bg-emerald-500" />

              {/* Steps */}
              <div className="space-y-12">
                <div className="flex gap-8">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-gray-900">Get an Estimate Fast</h3>
                    <p className="mt-1 text-[15px] text-gray-500">
                      Enter your car's information and instantly get a value estimate.
                    </p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-gray-900">Fine-Tune Your Value</h3>
                    <p className="mt-1 text-[15px] text-gray-500">
                      See immediately how features like color and mileage affect your car's value.
                    </p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-gray-900">Sell Your Car</h3>
                    <p className="mt-1 text-[15px] text-gray-500">
                      Enter your car's information and instantly get a value estimate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1">
            <div 
              className="bg-white md:w-[80%] rounded-xl p-4 shadow-sm border border-gray-100"
            >
              {/* Cars Image */}
              <div className="h-[100px] mb-4 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fG1lcmNlZGVzJTIwYzM1MHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                  alt="Cars"
                  className="max-w-full h-24 w-full object-cover rounded-tl-md rounded-tr-md"
                />
              </div>

              {/* Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button className="py-2 px-3 bg-emerald-500 text-white rounded text-xs font-medium hover:bg-emerald-600 transition-colors">
                  License Plate
                </button>
                <button className="py-2 px-3 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors">
                  VIN
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter License Plate"
                  className="w-full px-3 py-2 rounded border border-gray-200 text-gray-800 text-xs placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />

                <select
                  className="w-full px-3 py-2 rounded border border-gray-200 text-gray-600 text-xs appearance-none bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  defaultValue=""
                >
                  <option value="" disabled>State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                </select>

                <input
                  type="text"
                  placeholder="Zip Code"
                  className="w-full px-3 py-2 rounded border border-gray-200 text-gray-800 text-xs placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />

                <button className="w-full py-2.5 bg-red-500 text-white rounded font-medium text-xs hover:bg-red-600 transition-colors">
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarValuationForm;