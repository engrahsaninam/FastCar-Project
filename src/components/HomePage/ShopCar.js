import React, { useState } from 'react';
import { ChevronDown, CarIcon } from 'lucide-react';

const CarBrowseOptions = () => {
  const [activeView, setActiveView] = useState('brands');

  const brands = [
    { name: 'Toyota', logo: '/toyota.svg', cars: '933 cars' },
    { name: 'BMW', logo: '/bmw.svg', cars: '166 cars' },
    { name: 'Chevrolet', logo: '/chevrolet.svg', cars: '166 cars' },
    { name: 'Honda', logo: '/honda.svg', cars: '166 cars' },
    { name: 'Ford', logo: '/ford.svg', cars: '166 cars' },
    { name: 'Audi', logo: '/audi.svg', cars: '18 cars' },
    { name: 'Acura', logo: '/acura.svg', cars: '933 cars' },
    { name: 'Hyundai', logo: '/hyundai.svg', cars: '166 cars' },
    { name: 'Mercedes', logo: '/mercedes.svg', cars: '166 cars' },
    { name: 'Kia', logo: '/kia.svg', cars: '166 cars' },
    { name: 'Lexus', logo: '/lexus.svg', cars: '166 cars' },
    { name: 'Jeep', logo: '/jeep.svg', cars: '18 cars' }
  ];

  const types = [
    { name: 'SUV', count: '458 cars' },
    { name: 'Sedan', count: '385 cars' },
    { name: 'Luxury', count: '234 cars' },
    { name: 'Sports Car', count: '156 cars' },
    { name: 'Truck', count: '142 cars' },
    { name: 'Hybrid', count: '98 cars' },
    { name: 'Electric', count: '76 cars' },
    { name: 'Convertible', count: '54 cars' },
    { name: 'Van', count: '45 cars' },
    { name: 'Wagon', count: '32 cars' },
    { name: 'Coupe', count: '28 cars' },
    { name: 'Minivan', count: '24 cars' }
  ];

  const popularModels = [
    { name: 'Toyota Camry', count: '245 cars' },
    { name: 'Honda Civic', count: '198 cars' },
    { name: 'BMW 3 Series', count: '167 cars' },
    { name: 'Tesla Model 3', count: '156 cars' },
    { name: 'Ford F-150', count: '145 cars' },
    { name: 'Mercedes C-Class', count: '134 cars' },
    { name: 'Audi A4', count: '123 cars' },
    { name: 'Toyota RAV4', count: '112 cars' },
    { name: 'Honda CR-V', count: '98 cars' },
    { name: 'BMW X5', count: '87 cars' },
    { name: 'Tesla Model Y', count: '76 cars' },
    { name: 'Ford Mustang', count: '65 cars' }
  ];

  const years = [
    { year: '2024', count: '156 cars' },
    { year: '2023', count: '245 cars' },
    { year: '2022', count: '389 cars' },
    { year: '2021', count: '467 cars' },
    { year: '2020', count: '523 cars' },
    { year: '2019', count: '478 cars' },
    { year: '2018', count: '412 cars' },
    { year: '2017', count: '356 cars' },
    { year: '2016', count: '289 cars' },
    { year: '2015', count: '234 cars' },
    { year: '2014', count: '198 cars' },
    { year: '2013', count: '167 cars' }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'brands':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-6">
            {brands.map((brand) => (
              <a
                href={`#${brand.name.toLowerCase()}`}
                key={brand.name}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="w-8 h-8">
                  <CarIcon className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{brand.name}</span>
                  <span className="text-sm text-gray-500">{brand.cars}</span>
                </div>
              </a>
            ))}
          </div>
        );

      case 'types':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-6">
            {types.map((type) => (
              <a
                href={`#${type.name.toLowerCase()}`}
                key={type.name}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="w-8 h-8">
                  <CarIcon className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{type.name}</span>
                  <span className="text-sm text-gray-500">{type.count}</span>
                </div>
              </a>
            ))}
          </div>
        );

      case 'models':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-6">
            {popularModels.map((model) => (
              <a
                href={`#${model.name.toLowerCase().replace(' ', '-')}`}
                key={model.name}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="w-8 h-8">
                  <CarIcon className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{model.name}</span>
                  <span className="text-sm text-gray-500">{model.count}</span>
                </div>
              </a>
            ))}
          </div>
        );

      case 'years':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-6">
            {years.map((yearData) => (
              <a
                href={`#${yearData.year}`}
                key={yearData.year}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="w-8 h-8">
                  <CarIcon className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{yearData.year}</span>
                  <span className="text-sm text-gray-500">{yearData.count}</span>
                </div>
              </a>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pt-20">
      <div className="flex flex-col space-y-6">
        <div className="flex sm:flex-row w-full flex-col justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-900">
            Shop cars your way
          </h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 space-x-1 border border-gray-400 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('brands')}
              className={`px-4 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeView === 'brands' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Browse by Brands
            </button>
            <button
              onClick={() => setActiveView('types')}
              className={`px-4 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeView === 'types' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Browse by Type
            </button>
            <button
              onClick={() => setActiveView('models')}
              className={`px-4 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeView === 'models' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Popular Models
            </button>
            <button
              onClick={() => setActiveView('years')}
              className={`px-4 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeView === 'years' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Browse by Year
            </button>
          </div>
        </div>

        {renderContent()}

        
      </div>
    </div>
  );
};

export default CarBrowseOptions;