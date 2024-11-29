'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Filter, Heart, Info, ChevronRight, X } from 'lucide-react';

const BestDealsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    price: '',
    make: '',
    year: '',
    mileage: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);
    setFilters({
      price: currentParams.get('price') || '',
      make: currentParams.get('make') || '',
      year: currentParams.get('year') || '',
      mileage: currentParams.get('mileage') || '',
      sortBy: currentParams.get('sortBy') || 'newest',
    });
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
      id: 3,
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
      id: 4,
      make: 'BMW',
      model: 'M3 Competition',
      year: 2023,
      price: 79900,
      mileage: 5000,
      location: 'Berlin, Germany',
      features: ['Sport Package', 'Premium Sound', 'Navigation'],
      image:"https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      discount: 8000,
      originalPrice: 87900,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Best Deals</h1>
          <select
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="mileage">Lowest Mileage</option>
          </select>
        </div>

        {/* Horizontal Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                className="w-full p-2 border rounded-md bg-white hover:bg-gray-50"
                value={filters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="under-20000">Under €20,000</option>
                <option value="20000-40000">€20,000 - €40,000</option>
                <option value="40000-60000">€40,000 - €60,000</option>
                <option value="60000-100000">€60,000 - €100,000</option>
                <option value="above-100000">Above €100,000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
              <select
                className="w-full p-2 border rounded-md bg-white hover:bg-gray-50"
                value={filters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
              >
                <option value="">All Makes</option>
                <option value="audi">Audi</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes-Benz</option>
                <option value="porsche">Porsche</option>
                <option value="volkswagen">Volkswagen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                className="w-full p-2 border rounded-md bg-white hover:bg-gray-50"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">Any Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
              <select
                className="w-full p-2 border rounded-md bg-white hover:bg-gray-50"
                value={filters.mileage}
                onChange={(e) => handleFilterChange('mileage', e.target.value)}
              >
                <option value="">Any Mileage</option>
                <option value="under-10000">Under 10,000 km</option>
                <option value="under-30000">Under 30,000 km</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
              <div className="relative aspect-video mb-4">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="rounded-md object-cover w-full h-full"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart size={20} className="text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{car.make} {car.model}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold">€{car.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 line-through">
                      €{car.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p>{car.year} • {car.mileage.toLocaleString()} km • {car.location}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full mt-4 bg-[#FC4F3F] text-white py-2 px-4 rounded-md hover:bg-[#DC2626] flex items-center justify-center">
                View Details
                <ChevronRight size={16} className="ml-2" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BestDealsPage;