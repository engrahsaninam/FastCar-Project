"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Star } from "lucide-react";
import car from '@/assets/car.jpg';
import Link from "next/link";

const HeroSection = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  // Add these state declarations near the top with other useState declarations
  const [mileageRange, setMileageRange] = useState({ min: '', max: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const makes = [
    "Abarth",
    "Acura",
    "Aixam",
    "Alfa Romeo",
    "Alpina",
    "Aston Martin",
    "Audi",
    "BMW",


  ];

  const modelsByMake = {
    "Abarth": ["500", "595", "595C", "695", "124 Spider"],
    "Acura": ["ILX", "MDX", "NSX", "RDX", "TLX", "RSX", "TSX"],
    "Aixam": ["City", "Crossline", "Coupe", "GTO", "Roadline"],
    "Alfa Romeo": ["Giulia", "Stelvio", "Giulietta", "4C", "Tonale", "Brera", "Spider"],
    "Alpina": ["B3", "B4", "B5", "B6", "B7", "B8", "D3", "D4", "D5", "XD3", "XD4"],
    "Aston Martin": ["DB11", "DBS", "DBX", "Vantage", "Valkyrie", "Vulcan"],
    "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "R8"],
    "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "i7", "i8", "iX"],
    "Bugatti": ["Chiron", "Veyron", "Divo", "La Voiture Noire", "Centodieci", "Bolide"],
    "Cadillac": ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "LYRIQ"],
    "Chevrolet": ["Camaro", "Corvette", "Malibu", "Silverado", "Suburban", "Tahoe", "Bolt", "Blazer"],
    "Chrysler": ["300", "Pacifica", "Voyager", "Town & Country"],
    "Citroen": ["C3", "C4", "C5", "Berlingo", "SpaceTourer", "C3 Aircross", "C5 Aircross"],
    "Cupra": ["Ateca", "Formentor", "Leon", "Born", "Tavascan"],
    "Dacia": ["Duster", "Logan", "Sandero", "Spring", "Jogger", "Bigster"],
    "Daewoo": ["Lanos", "Matiz", "Nubira", "Leganza", "Tacuma", "Kalos"],
    "Daihatsu": ["Charade", "Copen", "Sirion", "Terios", "Rocky", "Move"],
    "Dodge": ["Challenger", "Charger", "Durango", "Ram", "Journey", "Hornet"]
  };


  const years = Array.from({ length: 25 }, (_, i) => 2024 - i);

  const mileageRanges = [
    "0 - 10,000 km",
    "10,000 - 30,000 km",
    "30,000 - 60,000 km",
    "60,000 - 100,000 km",
    "100,000+ km"
  ];

  const priceRanges = [
    "Up to €10,000",
    "€10,000 - €20,000",
    "€20,000 - €30,000",
    "€30,000 - €50,000",
    "€50,000 - €75,000",
    "€75,000+"
  ];

  const basicFormFields = [
    {
      label: "Make",
      placeholder: "Select make",
      options: makes,
      value: selectedMake,
      onChange: (e) => {
        setSelectedMake(e.target.value);
        setSelectedModel("");  // Reset model when make changes
      }
    },
    {
      label: "Model",
      placeholder: "Choose model",
      options: selectedMake ? modelsByMake[selectedMake] || [] : [],
      value: selectedModel,
      onChange: (e) => setSelectedModel(e.target.value)  // Remove disabled state
    },
    {
      label: "Registration from",
      placeholder: "Select year",
      options: years,
      value: "",
      onChange: () => { }
    }
  ];


  const advancedFormFields = [
    {
      label: "Mileage range ",
      type: "range",
      fields: [
        {
          placeholder: "Min mileage (km)",
          value: mileageRange.min,
          onChange: (e) => setMileageRange(prev => ({ ...prev, min: e.target.value })),
          type: "number",
          suffix: "km"
        },
        {
          placeholder: "Max mileage (km)",
          value: mileageRange.max,
          onChange: (e) => setMileageRange(prev => ({ ...prev, max: e.target.value })),
          type: "number",
          suffix: "km"
        }
      ]
    },
    {
      label: "Price range ",
      type: "range",
      fields: [
        {
          placeholder: "Min price (€)",
          value: priceRange.min,
          onChange: (e) => setPriceRange(prev => ({ ...prev, min: e.target.value })),
          type: "number",
          prefix: "€"
        },
        {
          placeholder: "Max price (€)",
          value: priceRange.max,
          onChange: (e) => setPriceRange(prev => ({ ...prev, max: e.target.value })),
          type: "number",
          prefix: "€"
        }
      ]
    }
  ];

  const stats = [
    { value: 54000, label: "Cars traded" },
    { value: 50000, label: "Cars listed" },
    { value: 4500, label: "Reviews" },
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((stat, index) => {
      const increment = Math.ceil(stat.value / 40);
      return setInterval(() => {
        setCounters((prevCounters) => {
          const newCounters = [...prevCounters];
          if (newCounters[index] < stat.value) {
            newCounters[index] = Math.min(
              newCounters[index] + increment,
              stat.value
            );
          }
          return newCounters;
        });
      }, 30);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };
  const renderSelect = (field) => (
    <div className="relative">
      <select
        className="w-full appearance-none bg-white border border-gray-200 rounded px-4 py-2.5 text-lg text-gray-900"
        value={field.value}
        onChange={field.onChange}
      >
        <option value="" className="text-gray-500 text-lg">
          {field.placeholder}
        </option>
        {field.options && field.options.map((option) => (
          <option
            key={option}
            value={option}
            className="py-1.5"
          >
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
    </div>
  );
  
  const renderRangeInputs = (field) => (
    <div className="flex gap-2">
      {field.fields.map((input, index) => (
        <div key={index} className="flex-1">
          <input
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            onChange={input.onChange}
            className="w-full appearance-none bg-white border border-gray-200 rounded px-4 py-2.5 text-lg text-gray-900"
          />
        </div>
      ))}
    </div>
  );
  
  return (
    <>
      {/* Mobile and Tablet View */}
      <div className="lg:hidden relative w-full" style={{
        background: 'linear-gradient(180deg, #EF4444 0%, #E81616FF 90%)'
      }}>
        <div
          className="h-[380px] relative overflow-hidden"
          style={{
            backgroundImage: `url(${car.src})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Single gradient overlay */}
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(360deg, #EF4444 0%, rgba(19, 23, 101, 0.25) 51.4%, rgba(19, 23, 103, 0.00) 100%)'
            }}
          />
  
          <div className="relative top-14 pt-6 px-5">
            <h1 className="text-5xl mt-20 font-bold text-white leading-tight">
              We import cars, <br /> From Europe
            </h1>
          </div>
        </div>
  
        <div className="px-4 -mt-10 relative">
          <div className="mx-auto max-w-[700px]">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-5">
                {/* Responsive grid layout - 1 column on mobile, 2 columns on md+ */}
                <div className="grid md:grid-cols-2 gap-5">
                  {/* First two form fields in first column on md+ */}
                  <div className="space-y-5">
                    {basicFormFields.slice(0, 2).map((field) => (
                      <div key={field.label}>
                        {renderSelect(field)}
                      </div>
                    ))}
                  </div>
                  
                  {/* Third form field and VAT deduction in second column on md+ */}
                  <div className="space-y-5">
                    <div>
                      {renderSelect(basicFormFields[2])}
                    </div>
                    <div className="hidden md:flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-6 w-6 text-red-500 rounded border-gray-300"
                        />
                        <span className="ml-3 text-gray-700 text-lg font-medium">
                          VAT deduction
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
  
                {/* Advanced fields - also in 2 columns on md+ */}
                {showAdvanced && (
                  <div className="grid md:grid-cols-2 gap-5 mt-6">
                    {advancedFormFields.map((field, index) => (
                      <div key={field.label} className="space-y-3">
                        <label className="block text-gray-700 text-lg font-medium">
                          {field.label}
                        </label>
                        {field.type === "range" ? renderRangeInputs(field) : renderSelect(field)}
                      </div>
                    ))}
                  </div>
                )}
  
                {/* Mobile-only VAT deduction */}
                <div className="md:hidden flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-6 w-6 text-red-500 rounded border-gray-300"
                    />
                    <span className="ml-3 text-gray-700 text-lg font-medium">
                      VAT deduction
                    </span>
                  </label>
                </div>
  
                {/* Search button and advanced toggle */}
                <Link href="/cars">
                  <button className="w-full bg-red-500 text-white py-5 rounded-lg hover:bg-red-600 transition-colors text-lg font-semibold mt-6 mb-4">
                    1 043 923 Offers
                  </button>
                </Link>
                <button
                  onClick={toggleAdvanced}
                  className="w-full text-red-500 hover:text-red-600 flex items-center justify-center gap-2 text-lg font-medium"
                >
                  Advanced search <ChevronDown size={20} className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
  
                {/* Reviews section */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={24} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-lg text-gray-600">1023 reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Desktop View */}
      <div className="hidden lg:block w-full relative">
        <div
          className="relative flex flex-col bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${car.src})`,
            backgroundSize: 'cover',
          }}
        >
          {/* Main overlay with transparent top */}
          <div className="absolute bottom-0 w-full" />
          <div
            className="absolute bottom-0 w-full h-full"
            style={{
              background: 'linear-gradient(0deg, rgba(239, 68, 68, 0.8) 0, rgba(239, 68, 68, 0) 52%), radial-gradient(132.46% 225.99% at -1.56% 50%, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.20) 1.92%, rgba(239, 68, 68, 0.10) 42.27%, rgba(239, 68, 68, 0.15) 57.58%, rgba(239, 68, 68, 0.15) 63.62%, rgba(239, 68, 68, 0.00) 70.14%)'
            }}
          />
  
          <div className="relative py-8 flex-1">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 lg:pt-32 pb-12 min-h-screen">
              <div className="flex flex-row space-x-12 h-full">
                {/* Left Column */}
                <div className="space-y-8 text-white flex-1">
                  <div>
                    <h1 className="text-6xl font-bold mb-6 leading-tight">
                      We import cars, <br /> From Europe
                    </h1>
                    <p className="text-[#ffffff] max-w-lg text-xl leading-relaxed">
                      Looking for a reliable used car? We specialize in importing high-quality, professionally inspected vehicles from Europe, ensuring you drive away with confidence. Experience exceptional service and unbeatable value with every car we sell!
                    </p>
                  </div>
  
                  <div className="flex gap-12 pt-8">
                    {stats.map((stat, index) => (
                      <div key={index} className="min-w-[120px]">
                        <div className="text-4xl font-bold">
                          {counters[index].toLocaleString()}+
                        </div>
                        <div className="text-xl text-gray-100">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Search Form */}
                <div className="w-[47%]">
                  <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-lg">
                    {/* Rest of the form content remains the same */}
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-semibold">
                        Personalize your search
                      </h2>
                      <div className="bg-red-100 p-1 rounded-lg">
                      </div>
                    </div>
  
                    <div className="grid gap-5 grid-cols-2 mb-6">
                      {basicFormFields.map((field) => (
                        <div key={field.label} className="space-y-2">
                          <label className="block text-gray-700 text-base font-medium">
                            {field.label}
                          </label>
                          {renderSelect(field)}
                        </div>
                      ))}
  
                      {showAdvanced && advancedFormFields.map((field) => (
                        <div key={field.label} className="space-y-2 col-span-2">
                          <label className="block text-gray-700 text-base font-medium">
                            {field.label}
                          </label>
                          {field.type === "range" ? renderRangeInputs(field) : renderSelect(field)}
                        </div>
                      ))}
  
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-red-500 rounded border-gray-300"
                          />
                          <span className="ml-3 text-gray-700 text-base">
                            VAT deduction
                          </span>
                        </label>
                      </div>
                    </div>
  
                    <Link href="/cars">
                      <button className="w-full bg-red-500 text-white py-4 rounded-lg hover:bg-red-600 transition-colors text-md font-medium mb-6">
                        1 043 923 Offers
                      </button>
                    </Link>
  
                    <button
                      onClick={toggleAdvanced}
                      className="text-red-500 hover:text-red-600 flex items-center gap-2 text-base font-medium mb-6"
                    >
                      Advanced search <ChevronDown size={18} className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
  
                    <div className="bg-red-50 p-5 rounded-lg">
                      <div className="text-base text-gray-600 mb-2">
                        Previous filters
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base text-gray-900 truncate pr-4">
                          Abarth 124 Spider, Kms driven to 5 000 km, Up to €2,000
                        </span>
                        <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;