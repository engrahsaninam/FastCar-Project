import React, { useState, useEffect } from 'react';
import { MapPin, Heart, ExternalLink, Filter, Search, ChevronRight, Share2, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const CarListings = () => {
  const [activeCategory, setActiveCategory] = useState("Sedan");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');
  const [favorites, setFavorites] = useState(new Set());

  // Categories with icons and counts
  const categories = [
    { id: "Sedan", label: "Sedan", count: 234 },
    { id: "SUV", label: "SUV", count: 156 },
    { id: "Luxury", label: "Luxury", count: 89 },
    { id: "Sports", label: "Sports", count: 67 },
    { id: "Trucks", label: "Trucks", count: 45 }
  ];

  const cars = [
    {
      id: 1,
      category: "Sedan",
      slug: "2015-mercedes-benz-c350",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=60",
      price: "CHF 39,999",
      model: "2015 Mercedes-Benz C350",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 2,
      category: "Sedan",
      slug: "2015-mercedes-benz-c350",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=60",
      price: "CHF 39,999",
      model: "2015 Mercedes-Benz C350",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 3,
      category: "Sedan",
      slug: "2015-mercedes-benz-c350",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=60",
      price: "CHF 39,999",
      model: "2015 Mercedes-Benz C350",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 4,
      category: "Sedan",
      slug: "2015-mercedes-benz-c350",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=60",
      price: "CHF 39,999",
      model: "2015 Mercedes-Benz C350",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 5,
      category: "Sports",
      slug: "2019-mercedes-benz-e53-amg",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=60",
      price: "CHF 46,998",
      model: "2019 Mercedes-Benz E53 AMG",
      mileage: "46500km",
      fuelType: "Petrol", 
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 6,
      category: "Sports",
      slug: "2019-mercedes-benz-e53-amg",
      image: "https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 46,998",
      model: "2019 Mercedes-Benz E53 AMG",
      mileage: "46500km",
      fuelType: "Petrol", 
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 7,
      category: "Sports",
      slug: "2019-mercedes-benz-e53-amg",
      image: "https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 46,998",
      model: "2019 Mercedes-Benz E53 AMG",
      mileage: "46500km",
      fuelType: "Petrol", 
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 8,
      category: "Sports",
      slug: "2019-mercedes-benz-e53-amg",
      image: "https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 46,998",
      model: "2019 Mercedes-Benz E53 AMG",
      mileage: "46500km",
      fuelType: "Petrol", 
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 9,
      category: "Sports",
      slug: "2019-mercedes-benz-e53-amg",
      image: "https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 46,998",
      model: "2019 Mercedes-Benz E53 AMG",
      mileage: "46500km",
      fuelType: "Petrol", 
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 10,
      category: "Luxury",
      slug: "2017-bmw-330-xi",
      image: "https://images.unsplash.com/photo-1599338474777-92be0b662488?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 25,998",
      model: "2017 BMW 330 XI",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 12,
      category: "Luxury",
      slug: "2017-bmw-330-xi",
      image: "https://images.unsplash.com/photo-1599338474777-92be0b662488?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 25,998",
      model: "2017 BMW 330 XI",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 13,
      category: "Luxury",
      slug: "2017-bmw-330-xi",
      image: "https://images.unsplash.com/photo-1599338474777-92be0b662488?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 25,998",
      model: "2017 BMW 330 XI",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 14,
      category: "Luxury",
      slug: "2017-bmw-330-xi",
      image: "https://images.unsplash.com/photo-1599338474777-92be0b662488?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 25,998",
      model: "2017 BMW 330 XI",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 15,
      category: "Luxury",
      slug: "2017-bmw-330-xi",
      image: "https://images.unsplash.com/photo-1599338474777-92be0b662488?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 25,998",
      model: "2017 BMW 330 XI",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 16,
      category: "Sports",
      slug: "2018-audi-a5-premium-plus",
      image: "https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 37,999",
      model: "2018 Audi A5 Premium Plus",
      mileage: "46500km",
      fuelType: "Petrol",
      efficiency: "22kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 29
    },
    {
      id: 17,
      category: "SUV",
      slug: "2020-bmw-x5",
      image: "https://images.unsplash.com/photo-1632487727140-4da9bb61760d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 55,999",
      model: "2020 BMW X5",
      mileage: "35000km",
      fuelType: "Diesel",
      efficiency: "18kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 45
    },
    {
      id: 18,
      category: "Trucks",
      slug: "2021-ford-f150",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 48,999",
      model: "2021 Ford F-150",
      mileage: "25000km",
      fuelType: "Diesel",
      efficiency: "15kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 38
    },
    {
      id: 188,
      category: "Trucks",
      slug: "2021-ford-f150",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 48,999",
      model: "2021 Ford F-150",
      mileage: "25000km",
      fuelType: "Diesel",
      efficiency: "15kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 38
    },
    {
      id: 1888,
      category: "Trucks",
      slug: "2021-ford-f150",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 48,999",
      model: "2021 Ford F-150",
      mileage: "25000km",
      fuelType: "Diesel",
      efficiency: "15kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 38
    },
    {
      id: 178,
      category: "Trucks",
      slug: "2021-ford-f150",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 48,999",
      model: "2021 Ford F-150",
      mileage: "25000km",
      fuelType: "Diesel",
      efficiency: "15kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 38
    },
 
   

  
    {
      id: 23,
      category: "SUV",
      slug: "2021-mercedes-benz-gle",
      image: "https://images.unsplash.com/photo-1632487727140-4da9bb61760d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 68,999",
      model: "2021 Mercedes-Benz GLE",
      mileage: "30000km",
      fuelType: "Petrol",
      efficiency: "16kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 52
    },
    {
      id: 24,
      category: "SUV",
      slug: "2021-mercedes-benz-gle",
      image: "https://images.unsplash.com/photo-1632487727140-4da9bb61760d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 68,999",
      model: "2021 Mercedes-Benz GLE",
      mileage: "30000km",
      fuelType: "Petrol",
      efficiency: "16kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 52
    },
    {
      id: 25,
      category: "SUV",
      slug: "2021-mercedes-benz-gle",
      image: "https://images.unsplash.com/photo-1632487727140-4da9bb61760d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 68,999",
      model: "2021 Mercedes-Benz GLE",
      mileage: "30000km",
      fuelType: "Petrol",
      efficiency: "16kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 52
    },
    {
      id: 26,
      category: "SUV",
      slug: "2021-mercedes-benz-gle",
      image: "https://images.unsplash.com/photo-1632487727140-4da9bb61760d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 68,999",
      model: "2021 Mercedes-Benz GLE",
      mileage: "30000km",
      fuelType: "Petrol",
      efficiency: "16kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 52
    },
    {
      id: 27,
      category: "SUV",
      slug: "2021-mercedes-benz-gle",
      image: "https://images.unsplash.com/photo-1632487727140-4da9bb61760d?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "CHF 68,999",
      model: "2021 Mercedes-Benz GLE",
      mileage: "30000km",
      fuelType: "Petrol",
      efficiency: "16kmpl",
      transmission: "Automatic",
      location: "Geneva",
      watchers: 52
    }
  ];
  // Filter cars based on active category
  const filteredCars = cars.filter(car => car.category === activeCategory);

  const toggleFavorite = (id, e) => {
    e.preventDefault(); // Prevent the card click event from firing
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const CarCard = ({ car }) => (
        <Link href={`/cars/car?id=1`} className="block group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
        <Image
          src={car.image}
          alt={car.model}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Top badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            {car.category}
          </span>
        </div>
        
        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => toggleFavorite(car.id, e)}
            className={`p-2 rounded-full transition-all duration-200 ${
              favorites.has(car.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
          >
            <Heart className="w-4 h-4" fill={favorites.has(car.id) ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{car.price}</h3>
            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded">
              {car.transmission}
            </span>
          </div>
          <p className="text-base font-medium text-gray-900">{car.model}</p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Mileage", value: car.mileage },
            { label: "Fuel Type", value: car.fuelType },
            { label: "Efficiency", value: car.efficiency },
            { label: "Watchers", value: `${car.watchers} people` }
          ].map((spec, index) => (
            <div key={index} className="px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">{spec.label}</p>
              <p className="text-sm font-medium text-gray-900">{spec.value}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{car.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Find your perfect car
          </h1>
          <p className="text-gray-500 mt-2">
            {filteredCars.length} vehicles available
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              category.id === activeCategory
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm font-medium">{category.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              category.id === activeCategory
                ? 'bg-red-400 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default CarListings;