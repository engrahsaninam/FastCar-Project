import React, { useState } from 'react';
import { MapPin, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const CarListings = () => {
  const [activeCategory, setActiveCategory] = useState("Sedan");
  
  const categories = ["Sedan", "SUV", "Luxury", "Sports", "Trucks"];
  
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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
        <h2 className="text-3xl font-medium text-gray-800 mb-4 sm:mb-0">
          The most searched cars
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all
                ${category === activeCategory 
                  ? 'bg-emerald-500 text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCars.map((car) => (
          <div 
            key={car.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
          >
            <Link  href={`/cars/car`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                <img
                  src={car.image}
                  alt={car.model}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-2xl font-bold text-gray-800">{car.price}</h3>
                  <p className="text-sm font-medium text-gray-600 mt-1">{car.model}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 text-center">
                    {car.mileage}
                  </div>
                  <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 text-center">
                    {car.fuelType}
                  </div>
                  <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 text-center">
                    {car.efficiency}
                  </div>
                  <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 text-center">
                    {car.transmission}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-600">{car.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-600">{car.watchers} Watchers</span>
                    </div>
                    
                    
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarListings;