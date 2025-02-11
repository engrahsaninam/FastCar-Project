import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import bg from "@/assets/png.png";

// Separate the part that uses useSearchParams
const BudgetSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sliderRef = useRef(null);
  
  const [budget, setBudget] = useState(() => {
    const priceFrom = Number(searchParams.get('priceFrom')) || 1000;
    const priceTo = Number(searchParams.get('priceTo')) || 50000;
    return [priceFrom, priceTo];
  });
  
  const [carsFound, setCarsFound] = useState(784);
  const [activeHandle, setActiveHandle] = useState(null);

  useEffect(() => {
    const range = budget[1] - budget[0];
    const calculatedCars = Math.floor(784 * (range / 49000));
    setCarsFound(calculatedCars);
  }, [budget]);

  const handleMouseDown = (e, handle) => {
    e.preventDefault();
    setActiveHandle(handle);

    const handleMouseMove = (event) => {
      if (!sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      const value = Math.round((49000 * percent + 1000) / 100) * 100;

      setBudget(prev => {
        if (handle === 'min') {
          return [Math.min(value, prev[1] - 1000), prev[1]];
        } else {
          return [prev[0], Math.max(value, prev[0] + 1000)];
        }
      });
    };

    const handleMouseUp = () => {
      setActiveHandle(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e, handle) => {
    e.preventDefault();
    setActiveHandle(handle);

    const handleTouchMove = (event) => {
      if (!sliderRef.current || !event.touches[0]) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.min(Math.max((event.touches[0].clientX - rect.left) / rect.width, 0), 1);
      const value = Math.round((49000 * percent + 1000) / 100) * 100;

      setBudget(prev => {
        if (handle === 'min') {
          return [Math.min(value, prev[1] - 1000), prev[1]];
        } else {
          return [prev[0], Math.max(value, prev[0] + 1000)];
        }
      });
    };

    const handleTouchEnd = () => {
      setActiveHandle(null);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleViewCars = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('priceFrom', budget[0].toString());
    params.set('priceTo', budget[1].toString());
    const newPath = `/cars?${params.toString()}`;
    router.push(newPath);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Find Your Perfect Car
        </h1>
        <p className="text-gray-600 text-lg">
          Set your budget, and we'll match you with the ideal vehicle.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="space-y-8">
          <div>
            <label className="block text-gray-900 font-semibold mb-6">
              What's your budget range?
            </label>

            <div className="space-y-6">
              {/* Price Display */}
              <div className="flex justify-between items-center">
                <span className={`font-medium transition-colors ${activeHandle === 'min' ? 'text-red-500' : 'text-gray-900'}`}>
                  {formatPrice(budget[0])}
                </span>
                <span className={`font-medium transition-colors ${activeHandle === 'max' ? 'text-red-500' : 'text-gray-900'}`}>
                  {formatPrice(budget[1])}
                </span>
              </div>

              {/* Slider */}
              <div className="relative py-2" ref={sliderRef}>
                {/* Background track */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2" />
                
                {/* Active track */}
                <div
                  className="absolute top-1/2 h-1 bg-red-500 rounded-full transform -translate-y-1/2 transition-colors"
                  style={{
                    left: `${((budget[0] - 1000) / 49000) * 100}%`,
                    right: `${100 - ((budget[1] - 1000) / 49000) * 100}%`
                  }}
                />

                {/* Handles */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'min')}
                  onTouchStart={(e) => handleTouchStart(e, 'min')}
                  className={`absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow cursor-grab
                    transition-all duration-150 active:cursor-grabbing
                    ${activeHandle === 'min' ? 'border-red-500 scale-125' : 'border-gray-300 hover:border-red-500'}
                    border-2`}
                  style={{
                    left: `${((budget[0] - 1000) / 49000) * 100}%`,
                    transform: 'translateX(-50%)',
                    zIndex: activeHandle === 'min' ? 30 : 20
                  }}
                />
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'max')}
                  onTouchStart={(e) => handleTouchStart(e, 'max')}
                  className={`absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow cursor-grab
                    transition-all duration-150 active:cursor-grabbing
                    ${activeHandle === 'max' ? 'border-red-500 scale-125' : 'border-gray-300 hover:border-red-500'}
                    border-2`}
                  style={{
                    left: `${((budget[1] - 1000) / 49000) * 100}%`,
                    transform: 'translateX(-50%)',
                    zIndex: activeHandle === 'max' ? 30 : 20
                  }}
                />
              </div>

              {/* Results and Action */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{carsFound}</span>
                  <span className="text-gray-600">vehicles match</span>
                </div>
                <button 
                  onClick={handleViewCars}
                  className="bg-red-500 text-white px-8 py-3 rounded-lg font-medium 
                    hover:bg-red-600 transition-all duration-200"
                >
                  View Cars
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading component
const LoadingState = () => (
  <div className="space-y-6 animate-pulse">
    <div>
      <div className="h-10 w-3/4 bg-gray-200 rounded mb-3"></div>
      <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
    </div>
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-12 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Main component wrapped with Suspense
const CarBudgetSelector = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
            <div className="absolute inset-0 bg-red-500/90 rounded-3xl" />
            <img
              src={bg.src}
              alt="Person thinking about car choice"
              className="relative z-20 w-full"
            />
          </div>


          {/* Right Section */}
          <Suspense fallback={<LoadingState />}>
            <BudgetSelector />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CarBudgetSelector;