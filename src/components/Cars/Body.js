"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Gauge,
  Calendar,
  ParkingMeterIcon,
  Power,
  Fuel,
  X,
  SlidersHorizontal,
  Bell,
} from 'lucide-react';
import Image from 'next/image';
import OptionsModal from './FinancingModal';
import SearchBar from './carSearchComponent';
import Link from 'next/link';

const CarCard = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  return (
    <Link href={`/cars/car?id=${car.id}`} className="block">
      <div className="flex flex-col md:flex-col lg:flex-row bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
        {/* Image Section */}
        <div className="relative w-full lg:w-[250px] aspect-[16/9] lg:aspect-[4/3]">
          <div className="absolute top-2 right-2 z-20">
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                setIsFavorite(!isFavorite);
              }}
              className="p-1 rounded-full bg-white/90 hover:bg-white"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`}
              />
            </button>
          </div>

          {car.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  previousImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/80 hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/80 hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <Image
            src={car.images[currentImageIndex]}
            alt={car.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3 flex flex-col gap-y-2">
          <div className='flex justify-between'>
            <h3 className="text-base font-bold text-red-500 mb-2">{car.name}</h3>
            <img
              src="/Logo/logo.png.png"
              alt="Logo"
              width={100}
              height={50}
              className="inline-block"
            />
          </div>
          {/* Specs Row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-gray-700">
              <ParkingMeterIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs">{car.mileage}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs">{car.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Power className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs">{car.power}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Gauge className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Fuel className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs">{car.fuelType}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {car.features.slice(0, 4).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-red-50 text-red-400 rounded text-xs font-medium"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 4 && (
              <button className="px-2 py-0.5 text-red-600 text-xs font-medium">
                + {car.features.length - 4} more
              </button>
            )}
          </div>

          {/* Location and Price */}
          <div className="mt-auto flex flex-row justify-between items-center gap-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">Germany, delivery:</span>
              <button 
                onClick={(e) => e.preventDefault()}
                className="text-red-600 text-xs font-medium underline hover:text-red-700"
              >
                Enter ZIP code
              </button>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">€{car.price.toLocaleString()}</div>
              <div className="text-xs text-gray-500">
                €{car.priceWithoutVat.toLocaleString()} without VAT
              </div>
            </div>
          </div>

          {/* Import and Financing Options */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOptionsModalOpen(true);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm self-start"
            >
              View Options
            </button>
          </div>

          <OptionsModal
            car={car}
            isOpen={isOptionsModalOpen}
            onClose={() => setIsOptionsModalOpen(false)}
          />
        </div>
      </div>
    </Link>
  );
};


const CarList = () => {
  const [filteredCars, setFilteredCars] = useState([]);
  const cars = [
    {
      id: 1,
      name: "bmw   Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280,
      logo: "/Logo/logo.png"
    },
    {
      id: 2,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 3,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 4,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 5,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 6,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 7,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 8,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 9,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 10,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 11,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 12,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 13,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 14,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    {
      id: 15,
      name: "MINI Cooper 100 kW",
      images: [
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      ],
      power: "100 kW (136 hp)",
      date: "9/2021",
      mileage: "18,496 km",
      transmission: "Automatic",
      fuelType: "Petrol",
      features: [
        "Digital cockpit",
        "Keyless entry",
        "Apple CarPlay",
        "Navigation system",
        "Cruise control",
        "LED headlights"
      ],
      price: 25749,
      priceWithoutVat: 21280
    },
    // Add more cars...
  ];

  useEffect(() => {
    setFilteredCars(cars);
  }, []);


  // const handleSearch = (searchTerm) => {
  //   if (!searchTerm.trim()) {
  //     setFilteredCars(cars);
  //     return;
  //   }

  //   const searchLower = searchTerm.toLowerCase();
  //   const filtered = cars.filter(car => {
  //     return (
  //       car.name.toLowerCase().includes(searchLower) ||
  //       car.features.some(feature =>
  //         feature.toLowerCase().includes(searchLower)
  //       ) ||
  //       car.transmission.toLowerCase().includes(searchLower) ||
  //       car.fuelType.toLowerCase().includes(searchLower) ||
  //       car.power.toLowerCase().includes(searchLower) ||
  //       car.mileage.toLowerCase().includes(searchLower)
  //     );
  //   });

  //   setFilteredCars(filtered);
  // };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        {/* <SearchBar onSearch={handleSearch} /> */}
        <div className="flex flex-col gap-4 mt-4">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

const colorMap = {
  'blue': 'Blue',
  'silver': 'Silver',
  'gold': 'Gold',
  'red': 'Red',
  'brown': 'Brown',
  'purple': 'Purple',
  'black': 'Black',
  'white': 'White',
  'blue-gray': 'Gray Blue',
  'green': 'Green',
  'beige': 'Beige',
  'yellow': 'Yellow',
  'orange': 'Orange'
};

const vehicleTypesMap = {
  'cabriolet': 'Cabriolet',
  'compact': 'Compact',
  'coupe': 'Coupe',
  'estate': 'Estate car',
  'hatchback': 'Hatchback',
  'light': 'Light truck'
};

const featuresMap = {
  'air-conditioning': 'Air conditioning',
  'cruise-control': 'Cruise control',
  'heated-seats': 'Heated front seats',
  'steering-wheel': 'Multifunctional steering wheel',
  'navigation': 'Navigation system',
  'trailer': 'Trailer coupling',
  'led-lights': 'LED headlights',
  'xenon-lights': 'Xenon headlights'
};

const Body = ({ openMobileFilter }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState([]);


  const removeFilter = (filterId) => {
    const params = new URLSearchParams(searchParams.toString());

    switch (filterId) {
      case 'price':
        params.delete('priceFrom');
        params.delete('priceTo');
        params.delete('priceType');
        break;
      case 'registration':
        params.delete('regFrom');
        params.delete('regTo');
        break;
      case 'mileage':
        params.delete('mileageFrom');
        params.delete('mileageTo');
        break;
      case 'transmission':
        params.delete('transmission');
        break;
      case 'discounted':
        params.delete('discounted');
        break;
      case 'vat':
        params.delete('vat');
        break;
      case 'fuel':
        params.delete('fuel');
        break;
      case 'hybrid':
        params.delete('hybridType');
        break;
      case 'electric':
        params.delete('electric');
        break;
      case 'power':
        params.delete('powerFrom');
        params.delete('powerTo');
        params.delete('powerUnit');
        break;
      case '4x4':
        params.delete('is4x4');
        break;
      case 'vehicleTypes':
        params.delete('vehicleTypes');
        break;
      default:
        if (filterId.startsWith('color-')) {
          const color = filterId.replace('color-', '');
          const currentColors = params.get('colors')?.split(',') || [];
          const newColors = currentColors.filter(c => c !== color);
          if (newColors.length) {
            params.set('colors', newColors.join(','));
          } else {
            params.delete('colors');
          }
        }
        if (filterId.startsWith('feature-')) {
          const feature = filterId.replace('feature-', '');
          const currentFeatures = params.get('features')?.split(',') || [];
          const newFeatures = currentFeatures.filter(f => f !== feature);
          if (newFeatures.length) {
            params.set('features', newFeatures.join(','));
          } else {
            params.delete('features');
          }
        }
    }

    const newPath = `/cars${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newPath, { scroll: false });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    const filters = [];

    // Price Range
    const priceFrom = searchParams.get('priceFrom');
    const priceTo = searchParams.get('priceTo');
    const priceType = searchParams.get('priceType');
    if (priceFrom || priceTo) {
      filters.push({
        id: 'price',
        label: `${formatPrice(priceFrom || 0)} - ${formatPrice(priceTo || 0)}${priceType === 'instalments' ? ' (Instalments)' : ''}`
      });
    }

    // Registration period
    const regFrom = searchParams.get('regFrom');
    const regTo = searchParams.get('regTo');
    if (regFrom || regTo) {
      filters.push({
        id: 'registration',
        label: regFrom === regTo
          ? `Registration: ${regFrom}`
          : `Registration: ${regFrom || ''} - ${regTo || ''}`
      });
    }

    // Mileage
    const mileageFrom = searchParams.get('mileageFrom');
    const mileageTo = searchParams.get('mileageTo');
    if (mileageFrom || mileageTo) {
      filters.push({
        id: 'mileage',
        label: `${parseInt(mileageFrom || '0').toLocaleString()} - ${parseInt(mileageTo || '0').toLocaleString()} km`
      });
    }

    // Transmission
    const transmission = searchParams.get('transmission');
    if (transmission) {
      filters.push({
        id: 'transmission',
        label: transmission
      });
    }

    // Discounted cars
    const discounted = searchParams.get('discounted');
    if (discounted === 'true') {
      filters.push({
        id: 'discounted',
        label: 'Discounted cars'
      });
    }

    // VAT deduction
    const vat = searchParams.get('vat');
    if (vat === 'true') {
      filters.push({
        id: 'vat',
        label: 'VAT deduction'
      });
    }

    // Fuel types
    const fuels = searchParams.get('fuel')?.split(',') || [];
    fuels.forEach(fuel => {
      filters.push({
        id: `fuel-${fuel}`,
        label: fuel.charAt(0).toUpperCase() + fuel.slice(1)
      });
    });

    // Electric Vehicle
    const isElectric = searchParams.get('electric');
    if (isElectric === 'true') {
      filters.push({
        id: 'electric',
        label: 'Electric Vehicle'
      });
    }

    // Hybrid type
    const hybridType = searchParams.get('hybridType');
    if (hybridType) {
      filters.push({
        id: 'hybrid',
        label: `${hybridType.charAt(0).toUpperCase() + hybridType.slice(1)} hybrid`
      });
    }

    // Power
    const powerFrom = searchParams.get('powerFrom');
    const powerTo = searchParams.get('powerTo');
    const powerUnit = searchParams.get('powerUnit') || 'hp';
    if (powerFrom || powerTo) {
      filters.push({
        id: 'power',
        label: `${powerFrom || '0'} - ${powerTo || '0'} ${powerUnit.toUpperCase()}`
      });
    }

    // Vehicle Types
    const vehicleTypes = searchParams.get('vehicleTypes')?.split(',') || [];
    vehicleTypes.forEach(type => {
      if (vehicleTypesMap[type]) {
        filters.push({
          id: `vehicleType-${type}`,
          label: vehicleTypesMap[type]
        });
      }
    });

    // Colors
    const colors = searchParams.get('colors')?.split(',') || [];
    colors.forEach(color => {
      if (colorMap[color]) {
        filters.push({
          id: `color-${color}`,
          label: colorMap[color]
        });
      }
    });

    // Features
    const features = searchParams.get('features')?.split(',') || [];
    features.forEach(feature => {
      if (featuresMap[feature]) {
        filters.push({
          id: `feature-${feature}`,
          label: featuresMap[feature]
        });
      }
    });

    // 4x4
    const is4x4 = searchParams.get('is4x4');
    if (is4x4 === 'true') {
      filters.push({
        id: '4x4',
        label: 'Drive type 4x4'
      });
    }

    setActiveFilters(filters);
  }, [searchParams]);

  const VerifiedCarsHeader = () => {
    return (
      <div className="w-full bg-transparent">
        <div className="flex flex-row md:items-center justify-between gap-2 px-4 py-4 md:py-4">
          {/* Title and Results Count */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verified cars</h1>
            <p className="text-sm text-gray-600">194 475 results</p>
          </div>

          {/* Sort and Pagination - Only visible on desktop */}
          <div className="flex items-center gap-4">
            <select
              className="bg-white border border-gray-200 rounded-lg px-1 py-2 text-sm text-gray-700"
              defaultValue="newest"
            >
              <option value="newest">Newest ad</option>
              <option value="oldest">Oldest ad</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* Pagination */}
            <div className="hidden md:flex items-center gap-2">
              <button className="p-2 text-gray-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-red-400 text-white">
                1
              </button>
              <button className="w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100">
                2
              </button>
              <button className="w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100">
                3
              </button>
              <button className="w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100">
                4
              </button>
              <span className="px-2">...</span>
              <button className="w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100">
                973
              </button>
              <button className="p-2 text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="w-full">
      <div className="flex flex-col overflow-hidden bg-white md:bg-transparent">
        {/* Filter Bar for Mobile */}
        <div className="md:hidden flex flex-col">
          <div className='flex flex-row items-start gap-2 p-3.5 overflow-hidden'>
            <button
              onClick={openMobileFilter}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg font-semibold text-sm hover:bg-red-500 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>

            {/* Horizontal scroll for chips */}
            <div className="flex-1 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 pb-2">
                {activeFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex-none flex items-center gap-2 px-4 py-2 bg-red-100 text-red-400 rounded-md font-medium text-sm group"
                  >
                    {filter.label}
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="hover:bg-red-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${filter.label} filter`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
          <div>
            <VerifiedCarsHeader />
            <CarList />
          </div>
        </div>

        {/* Desktop Version */}
        <div className="hidden md:flex flex-col w-full"> {/* Changed to flex-col */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors">
              <Bell className="w-4 h-4" />
              Save search
            </button>

            {activeFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-2 px-4 py-1.5 bg-red-100 text-red-400 rounded-md font-medium text-sm group"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="hover:bg-red-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <VerifiedCarsHeader />
          <CarList />
        </div>
      </div>
    </div>
  );
};

export default Body;