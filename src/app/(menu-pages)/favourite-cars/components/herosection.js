"use client";
import React, { useState } from "react";
import { Heart, ShieldCheck, RotateCcw, Clock, Fuel, Settings, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FavoriteCarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Car Image */}
        <div className="relative w-full md:w-[300px] aspect-[4/3]">
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
          <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </button>
        </div>

        {/* Car Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-[#1A2B49] mb-2">{car.name}</h2>
              <p className="text-gray-500 text-sm">{car.year} • {car.mileage} km</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-500">CZK {car.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">VAT included</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">{car.power} kW</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <Link href={`/cars/car`}>
              <button className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg transition-colors text-sm font-medium">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FavoritesSection = () => {
  // Sample car data - this would come from your backend later
  const [favoriteCars] = useState([
    {
      id: 1,
      name: "Mercedes-Benz A 200 d",
      year: 2023,
      mileage: 15000,
      price: 634490,
      fuelType: "Diesel",
      transmission: "Automatic",
      power: "110",
      image: "https://images.unsplash.com/photo-1630165646418-ee4a29d9d210?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVkJTIwbWVyY2VkZXN8ZW58MHx8MHx8fDA%3D" // Using placeholder for demo
    }
  ]);

  const hasFavorites = favoriteCars.length > 0;

  return (
    <section className="bg-[#FEF3F3] min-h-screen w-full py-12 px-4 md:py-16 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <h1 className="text-[#1A2B49] text-2xl md:text-3xl font-bold mb-12">
          Favourite cars
        </h1>

        {/* Conditional Content */}
        {!hasFavorites ? (
          /* Empty State Card */
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 text-center">
            <div className="max-w-[280px] mx-auto">
              <div className="relative w-full aspect-square mb-6">
                <Image
                  src="/favorite-cars.svg"
                  alt="Favorite cars"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-gray mb-6">
                You add a car to favourites by clicking on a heart icon.
              </p>
              <Link href="/cars">
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 px-4 rounded-lg transition-colors text-sm font-medium">
                  1 166 631 Offers
                </button>
              </Link>
            </div>
          </div>
        ) : (
          /* Favorite Cars List */
          <div className="mb-8">
            {favoriteCars.map(car => (
              <FavoriteCarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#F8F9FF] rounded-lg">
                <RotateCcw className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-500 mb-2">
                  Money back guarantee
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  If you don't fall in love with the vehicle, simply return it to us.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#F8F9FF] rounded-lg">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-500 mb-2">
                  Safe purchase
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We guarantee the technical condition of every vehicle sold.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#F8F9FF] rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-500 mb-2">
                  6-month warranty
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  In addition, with every car you receive an extended warranty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavoritesSection;