import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import car from '@/assets/car.jpg';

const CarvagoHero = () => {
  return (
    <div className="min-h-screen pt-16 bg-[#1E1B4B]">
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background Image Container */}
        <div className="absolute inset-0 w-full">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B4B]/90 to-[#1E1B4B]/50" />
            <img
              src={car.src}
              alt="Car delivery"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-[1440px] mx-auto px-4 lg:px-8 pt-8 lg:pt-16">
          {/* Hero Text */}
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              You choose your car online.
              <br />
              We inspect it and deliver it.
            </h1>
          </div>

          {/* Search Form */}
          <div className="mt-8 bg-white rounded-2xl p-6 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Make or Model */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <button className="w-full h-12 px-4 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-[#1E1B4B] transition-colors">
                  <span className="text-gray-600">Make or model</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Mileage */}
              <div>
                <button className="w-full h-12 px-4 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-[#1E1B4B] transition-colors">
                  <span className="text-gray-600">Mileage</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Registration */}
              <div>
                <button className="w-full h-12 px-4 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-[#1E1B4B] transition-colors">
                  <span className="text-gray-600">Registration from</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Price Range */}
              <div>
                <button className="w-full h-12 px-4 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-[#1E1B4B] transition-colors">
                  <span className="text-gray-600">Price up to</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* VAT Checkbox */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#1E1B4B] focus:ring-[#1E1B4B]" />
                  <span className="ml-2 text-gray-600">VAT deduction</span>
                </label>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto px-6 h-12 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg transition-colors">
                1 034 123 Offers
              </button>
              <button className="text-[#4F46E5] hover:text-[#4338CA] font-medium flex items-center transition-colors">
                Advanced search
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
            {[
              {
                title: 'Money back guarantee',
                description: "If you don't fall in love with the vehicle, simply return it to us."
              },
              {
                title: 'Safe purchase',
                description: 'We guarantee the technical condition of every vehicle sold.'
              },
              {
                title: '6-month warranty',
                description: 'In addition, with every car you receive an extended warranty.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarvagoHero;