"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Star } from "lucide-react";
import car from '@/assets/car.jpg';
import Link from "next/link";

const HeroSection = () => {
  const formFields = [
    { label: "Make", placeholder: "Select make" },
    { label: "Model", placeholder: "Choose model" },
    { label: "Mileage", placeholder: "Select mileage" },
    { label: "Registration from", placeholder: "Select year" },
    { label: "Price up to", placeholder: "Select price" },
  ];
  

  const stats = [
    { value: 54000, label: "Cars traded" },
    { value: 50000, label: "Cars listed" },
    { value: 4500, label: "Reviews" },
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((stat, index) => {
      const increment = Math.ceil(stat.value / 40);
      return setInterval(() => {
        setCounters((prevCounters) => {
          const newCounters = [...prevCounters];
          if (newCounters[index] < stat.value) {
            newCounters[index] = Math.min(
              newCounters[index] + increment,
              stat.value
            );
          }
          return newCounters;
        });
      }, 30);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden relative w-full">
        <div 
          className="w-full h-[220px] relative"
          style={{
            backgroundImage: `url(${car.src})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative  pt-6 px-4 text-center">
            <h1 className="text-xl mt-14 font-bold text-white leading-tight">
              We import cars
              <br />
              From Europe.
            </h1>
          </div>
        </div>
        
        <div className="px-4 -mt-16 relative ">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="space-y-3">
                {formFields.map((field) => (
                  <div key={field.label}>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg p-2.5 appearance-none bg-white text-sm">
                        <option value="">{field.placeholder}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                ))}

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-red-500 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700 text-sm">
                      VAT deduction
                    </span>
                  </label>
                </div>

                <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors text-sm">
                  1 043 923 Offers
                </button>

                <button className="w-full text-red-500 hover:text-red-600 flex items-center justify-center gap-1 text-sm">
                  Advanced search <ChevronDown size={16} />
                </button>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="text-xl font-bold">4.8</div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">1023 reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative w-full min-h-screen">
        <div
          className="bg-[#ffeded] min-h-screen relative flex flex-col bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${car.src})`,
            backgroundSize: 'cover',
          }}
        >
          <div className="bg-zinc-600 bg-opacity-40 py-8 flex-1">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 lg:pt-32 pb-12 min-h-screen">
              <div className="flex flex-row space-x-12 h-full">
                {/* Left Column */}
                <div className="space-y-8 text-white flex-1">
                  <div>
                    <h1 className="text-5xl font-bold mb-4 leading-tight">
                      We import cars, <br /> From Europe
                    </h1>
                    <p className="text-[#E4E4E4] max-w-lg leading-relaxed">
                    Looking for a reliable used car? We specialize in importing high-quality, professionally inspected vehicles from Europe, ensuring you drive away with confidence. Experience exceptional service and unbeatable value with every car we sell!
                    </p>
                  </div>

                  <div className="flex gap-12 pt-5">
                    {stats.map((stat, index) => (
                      <div key={index} className="min-w-[120px]">
                        <div className="text-3xl font-bold">
                          {counters[index].toLocaleString()}+
                        </div>
                        <div className="text-gray-300">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search Form */}
                <div className="w-[47%]">
                  <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-semibold">
                        Personalize your search
                      </h2>
                      <div className="bg-red-100 p-1 rounded-lg">
                        
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-2 mb-6">
                      {formFields.map((field) => (
                        <div key={field.label} className="space-y-1.5">
                          <label className="block text-gray-700 text-sm">
                            {field.label}
                          </label>
                          <div className="relative">
                            <select className="w-full border border-gray-200 rounded-lg p-2.5 appearance-none bg-white text-sm">
                              <option value="">{field.placeholder}</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-red-500 rounded border-gray-300"
                          />
                          <span className="ml-2 text-gray-700 text-sm">
                            VAT deduction
                          </span>
                        </label>
                      </div>
                    </div>

                    <button href="/cars" className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors text-sm mb-6">
                      1 043 923 Offers
                    </button>

                   <Link href="/cars">
                   <button className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm mb-6">
                      Advanced search <ChevronDown size={16} />
                    </button>
                   </Link>


                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">
                        Previous filters
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-900 truncate pr-4">
                          Abarth 124 Spider, Kms driven to 5 000 km, Up to €2,000
                        </span>
                        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;