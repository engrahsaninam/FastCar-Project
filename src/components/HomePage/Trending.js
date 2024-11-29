import React from 'react';
import { Users, Snowflake, DollarSign, Car, ChevronRight } from 'lucide-react';

const TrendingSearches = () => {
  const categories = [
    {
      icon: <Users className="w-6 h-6 text-red-400" />,
      title: "Family Friendly",
      total: "Total 20 cars available"
    },
    {
      icon: <Snowflake className="w-6 h-6 text-red-400" />,
      title: "Best in Snow",
      total: "Total 63 cars available"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-red-400" />,
      title: "Reliable & Affordable",
      total: "Total 56 cars available"
    },
    {
      icon: <Car className="w-6 h-6 text-red-400" />,
      title: "Small & Sporty",
      total: "Total 125 cars available"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-12">
        Trending searches as per needs
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto] gap-6">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="flex items-start p-6 space-x-4">
              <div className="flex-shrink-0">
                <div className="p-4 bg-red-50 rounded-full inline-flex items-center justify-center">
                  {category.icon}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold text-gray-800 text-md">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.total}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        <button 
          className="hidden lg:flex items-center justify-center self-center p-2 text-gray-400 hover:text-gray-600"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default TrendingSearches;