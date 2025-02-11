'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Filter, Heart, Info, ChevronRight, X, Calendar, Gauge, MapPin } from 'lucide-react';
import NextImage from 'next/image';

const BestDealsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState(33000);
  const [filters, setFilters] = useState({
    price: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);
    setFilters({
      price: currentParams.get('price') || '',
      sortBy: currentParams.get('sortBy') || 'newest',
    });
    setPriceRange(parseInt(currentParams.get('price')) || 33000);
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPriceRange(value);
    handleFilterChange('price', value);
  };

  const formatPrice = (price) => {
    return `€${parseInt(price).toLocaleString()}`;
  };

  const navigateToCarDetails = () => {
    router.push('/cars/car');
  };

  const deals = [
    {
      id: 1,
      make: 'BMW',
      model: 'M3 Competition',
      year: 2023,
      price: 79900,
      mileage: 5000,
      location: 'Berlin, Germany',
      features: ['Sport Package', 'Premium Sound', 'Navigation'],
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      discount: 8000,
      originalPrice: 87900,
    },
    {
      id: 2,
      make: 'Mercedes',
      model: 'AMG GT',
      year: 2023,
      price: 92000,
      mileage: 3000,
      location: 'Munich, Germany',
      features: ['AMG Package', 'Burmester Sound', 'Panoramic Roof'],
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      discount: 10000,
      originalPrice: 102000,
    },
    {
      id: 3,
      make: 'Audi',
      model: 'RS7',
      year: 2023,
      price: 85000,
      mileage: 4500,
      location: 'Hamburg, Germany',
      features: ['RS Package', 'B&O Sound', 'Matrix LED'],
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      discount: 9000,
      originalPrice: 94000,
    },
    {
      id: 4,
      make: 'Porsche',
      model: '911 Carrera',
      year: 2023,
      price: 98000,
      mileage: 2000,
      location: 'Frankfurt, Germany',
      features: ['Sport Chrono', 'PDCC', 'Bose Sound'],
      image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      discount: 12000,
      originalPrice: 110000,
    },
  ];
  const [hoveredCard, setHoveredCard] = useState(null);

  const extendedDeals = [...deals, ...deals];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
        <NextImage
          src="/CARiMAGE.png"
          alt="Daily Best Deals Banner"
          fill
          quality={100}
          priority
          className="hidden md:block object-cover transform scale-105 hover:scale-110 transition-transform duration-1000"
        />
        <NextImage
          src="/BestDealsMobile.png"
          alt="Daily Best Deals Banner"
          fill
          quality={100}
          priority
          className="block md:hidden object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="absolute inset-0">
          <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-up">
                Daily Best Deals
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-md animate-fade-up-delayed">
                Find the best deals in your price range from all the European Market in seconds!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-12">
        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="mileage">Lowest Mileage</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                <span className="text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  {formatPrice(priceRange)}
                </span>
              </div>
              <div className="relative pt-2">
                <div className="absolute h-2 w-full bg-gray-200 rounded-full"></div>
                <div
                  className="absolute h-2 bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                  style={{ width: `${(priceRange / 200000) * 100}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="1000"
                  value={priceRange}
                  onChange={handlePriceChange}
                  className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {extendedDeals.map((car, index) => (
            <div
              key={`${car.id}-${index}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigateToCarDetails(car.id)}
            >
              {/* Image Section */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Discount Badge */}
                <div className="absolute top-3 left-3">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Save €{(car.originalPrice - car.price).toLocaleString()}
                  </div>
                </div>

                {/* Wishlist Button */}
                <button
                  className="absolute top-3 right-3 p-2.5 bg-white/95 rounded-full shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Heart size={20} className="text-gray-600 hover:text-red-500 transition-colors" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{car.make} {car.model}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-red-500">€{car.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">€{car.originalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1.5" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center">
                      <Gauge size={16} className="mr-1.5" />
                      <span>{car.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1.5" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-100"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BestDealsPage;