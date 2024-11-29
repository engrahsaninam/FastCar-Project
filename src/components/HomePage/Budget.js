"use client";
import React, { useState, useEffect } from 'react';
import bg from "@/assets/png.png"

const CarBudgetSelector = () => {
  const [budget, setBudget] = useState([15000, 50000]);
  const [carsFound, setCarsFound] = useState(560);
  const [isDragging, setIsDragging] = useState(null);

  // Update cars found based on budget range
  useEffect(() => {
    // Simulate different car counts based on range
    const range = budget[1] - budget[0];
    const calculatedCars = Math.floor(560 * (range / 35000));
    setCarsFound(calculatedCars);
  }, [budget]);

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    const isMinSlider = e.target.id === 'min-slider';

    setBudget(prev => {
      if (isMinSlider) {
        // Don't allow min to go above max - 1000
        return [Math.min(value, prev[1] - 1000), prev[1]];
      } else {
        // Don't allow max to go below min + 1000
        return [prev[0], Math.max(value, prev[0] + 1000)];
      }
    });
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Section with Image Placeholder */}
          <div className="relative">

            <img
              src={bg.src}
              alt="Person thinking about car choice"
              className="relative z-20 w-full "
            />
          </div>


          {/* Right Section */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Not Sure Which Car to Buy?
            </h1>
            <p className="text-gray-600 mb-6">
              Let us recommend the best fit car for you.
            </p>
            <div className="bg-white bg-opacity-60 md:w-[80%] rounded-lg p-6  shadow-lg">

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Tell us your car budget
                  </label>

                  {/* Budget Range Input Container */}
                  <div className="relative p-6 border rounded-lg">
                    {/* Range Display */}
                    <div className="absolute -top-3 left-4 right-4 flex justify-between">
                      <span className="bg-white px-2 text-sm font-medium">
                        £{budget[0].toLocaleString()}
                      </span>
                      <span className="bg-white px-2 text-sm font-medium">
                        £{budget[1].toLocaleString()}
                      </span>
                    </div>

                    {/* Custom Range Slider */}
                    <div className="relative pt-6">
                      {/* Background track */}
                      <div className="h-1 bg-gray-200 rounded-full">
                        {/* Active track */}
                        <div
                          className="absolute h-1 bg-red-500 rounded-full"
                          style={{
                            left: `${((budget[0] - 15000) / 35000) * 100}%`,
                            right: `${100 - ((budget[1] - 15000) / 35000) * 100}%`
                          }}
                        />
                      </div>

                      {/* Slider inputs */}
                      <input
                        id="min-slider"
                        type="range"
                        min={15000}
                        max={50000}
                        value={budget[0]}
                        onChange={handleSliderChange}
                        className="absolute top-5 w-full h-2 opacity-0 cursor-pointer"
                        onMouseDown={() => setIsDragging('min')}
                        onMouseUp={() => setIsDragging(null)}
                        onTouchStart={() => setIsDragging('min')}
                        onTouchEnd={() => setIsDragging(null)}
                      />
                      <input
                        id="max-slider"
                        type="range"
                        min={15000}
                        max={50000}
                        value={budget[1]}
                        onChange={handleSliderChange}
                        className="absolute top-5 w-full h-2 opacity-0 cursor-pointer"
                        onMouseDown={() => setIsDragging('max')}
                        onMouseUp={() => setIsDragging(null)}
                        onTouchStart={() => setIsDragging('max')}
                        onTouchEnd={() => setIsDragging(null)}
                      />

                      {/* Thumb indicators */}
                      <div
                        className={`absolute top-5 w-4 h-4 bg-white border-2 border-red-500 rounded-full -mt-1.5 -ml-2 transition-transform ${isDragging === 'min' ? 'scale-125' : ''
                          }`}
                        style={{
                          left: `${((budget[0] - 15000) / 35000) * 100}%`
                        }}
                      />
                      <div
                        className={`absolute top-5 w-4 h-4 bg-white border-2 border-red-500 rounded-full -mt-1.5 -ml-2 transition-transform ${isDragging === 'max' ? 'scale-125' : ''
                          }`}
                        style={{
                          left: `${((budget[1] - 15000) / 35000) * 100}%`
                        }}
                      />
                    </div>

                    {/* Results and Action Button */}
                    <div className="flex items-center justify-between mt-8">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{carsFound}</span>
                        <span className="text-sm text-gray-500">cars found</span>
                      </div>
                      <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarBudgetSelector;