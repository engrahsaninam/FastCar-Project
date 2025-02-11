"use client";
import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Filter, 
  CarIcon, Heart, Calendar, Tag, CircleDollarSign
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CarBrowseOptions = () => {
  const [activeTab, setActiveTab] = useState('brands');
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

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

  const getCardIcon = (type) => {
    switch (type) {
      case 'brands':
        return CarIcon;
      case 'types':
        return Tag;
      case 'models':
        return CircleDollarSign;
      case 'years':
        return Calendar;
      default:
        return CarIcon;
    }
  };

  const getCardData = () => {
    switch (activeTab) {
      case 'brands':
        return brands.map(item => ({
          ...item,
          title: item.name,
          subtitle: item.cars,
          // Brand links should select all models for that brand
          link: `/cars?makeModel=${item.name.toLowerCase()}-all`
        }));
      case 'types':
        return types.map(item => ({
          ...item,
          title: item.name,
          subtitle: item.count,
          // Vehicle type links
          link: `/cars?vehicleTypes=${item.name.toLowerCase().replace(' ', '-')}`
        }));
      case 'models':
        return popularModels.map(item => ({
          ...item,
          title: item.name,
          subtitle: item.count,
          // Model links need to extract make and model
          link: (() => {
            const [make, model] = item.name.split(' ');
            return `/cars?makeModel=${make.toLowerCase()}-${model.toLowerCase()}`;
          })()
        }));
      case 'years':
        return years.map(item => ({
          ...item,
          title: item.year,
          subtitle: item.count,
          // Year links
          link: `/cars?regFrom=${item.year}&regTo=${item.year}`
        }));
      default:
        return [];
    }
  };
  
  const UnifiedCard = ({ item }) => {
    const [favorites, setFavorites] = React.useState(new Set());
    const isFavorite = favorites.has(item.title);
  
    return (
      <Link
        href={item.link}
        className="block group"
      >
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col h-full overflow-hidden">
          {/* Image Container */}
          <div className="relative h-48 w-full">
            <img
              src="https://carvago.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffamily.dffa1dd7.webp&w=640&q=75"
              alt={item.title}
              className="w-full h-full object-contain"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFavorites(prev => {
                  const next = new Set(prev);
                  if (isFavorite) {
                    next.delete(item.title);
                  } else {
                    next.add(item.title);
                  }
                  return next;
                });
              }}
              className="absolute top-3 right-3 hover:scale-110 transition-transform bg-white p-2 rounded-full shadow-sm"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-300'
                }`}
              />
            </button>
          </div>
  
          {/* Content Container */}
          <div className="p-4">
            <h3 className="text-base font-semibold text-gray-900 break-words">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Shop cars your way
          </h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[280px] pl-9 pr-4 py-2 rounded-full border border-gray-200 
                         text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button 
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {['Brands', 'Types', 'Models', 'Years'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'text-red-500' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative px-0 sm:px-8">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center h-full">
            <button className="swiper-prev mt-6 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={12}
            slidesPerView="auto"
            navigation={{
              prevEl: '.swiper-prev',
              nextEl: '.swiper-next',
            }}
            pagination={{
              enabled: true,
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 2.1,
                spaceBetween: 8,
              },
              480: {
                slidesPerView: 2.5,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              }
            }}
            className="!pb-12"
          >
            {getCardData().map((item) => (
              <SwiperSlide key={item.title} className="h-auto">
                <UnifiedCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center h-full">
            <button className="swiper-next mt-6 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarBrowseOptions;