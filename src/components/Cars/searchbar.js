import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('All Makes');

  const makes = ['All Makes', 'Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Toyota', 'Honda']; // Add more makes as needed

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div className="relative">
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="appearance-none w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          >
            {makes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
        <button
          onClick={() => {/* Implement search functionality */}}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;