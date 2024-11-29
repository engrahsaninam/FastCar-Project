"use client";
import React, { useState, useEffect , useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Plus, Clock, Bookmark, Sliders, TrendingDown, X, Trash2, ChevronRight } from 'lucide-react';


const colorOptions = [
  { id: 'black', value: '#000000', label: 'Black' },
  { id: 'white', value: '#FFFFFF', label: 'White', border: true },
  { id: 'blue-gray', value: '#64748B', label: 'Gray Blue' },
  { id: 'red', value: '#EF4444', label: 'Red' },
  { id: 'blue', value: '#3B82F6', label: 'Blue' },
  { id: 'silver', value: '#E2E8F0', label: 'Silver', border: true },
  { id: 'green', value: '#22C55E', label: 'Green' },
  { id: 'beige', value: '#E3D3C3', label: 'Beige', border: true },
  { id: 'yellow', value: '#FBBF24', label: 'Yellow' },
  { id: 'orange', value: '#F97316', label: 'Orange' },
  { id: 'brown', value: '#92400E', label: 'Brown' },
  { id: 'gold', value: '#EAB308', label: 'Gold' },
  { id: 'purple', value: '#7C3AED', label: 'Purple' }
];

const MultiColorSelector = ({ selectedColors, onColorSelect }) => {
  const toggleColor = (colorId) => {
    if (selectedColors.includes(colorId)) {
      onColorSelect(selectedColors.filter(id => id !== colorId));
    } else {
      onColorSelect([...selectedColors, colorId]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-[#1a1a1a]">EXTERIOR COLOR</h2>
        {selectedColors.length > 0 && (
          <span className="bg-red-100 text-red-400 text-sm font-semibold px-2 py-0.5 rounded-md">
            {selectedColors.length}
          </span>
        )}
      </div>
      <div className="grid grid-cols-7 gap-4">
        {colorOptions.map((color) => (
          <button
            key={color.id}
            onClick={() => toggleColor(color.id)}
            className={`
              w-6 h-6 rounded-full relative transition-transform
              ${color.border ? 'border border-gray-200' : ''}
              ${selectedColors.includes(color.id) ? 'ring-2 ring-red-300 ring-offset-2 scale-110' : ''}
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2
            `}
            style={{ backgroundColor: color.value }}
            title={color.label}
            aria-label={color.label}
          >
            {selectedColors.includes(color.id) && (
              <svg
                className={`absolute inset-0 m-auto w-4 h-4 
                  ${color.id === 'white' || color.id === 'yellow' ? 'text-gray-900' : 'text-white'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};


const CustomSelect = ({ value, onChange, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2 bg-white border-2 rounded-lg transition-all cursor-pointer
          ${value ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
      >
        <div className="flex items-center flex-1">
          <span className={`${value ? 'text-red-400 font-semibold text-xs' : 'text-gray-500'}`}>
            {value ? (options.find(opt => opt.value === value)?.label || value) : placeholder}
          </span>
        </div>
        <div className="flex items-center">
          {value && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="ml-2 hover:bg-red-100 rounded-full text-red-400 cursor-pointer p-0.5"
            >
              <X size={14} strokeWidth={2.5} />
            </div>
          )}
          <ChevronDown
            className={`w-5 h-5 ${value ? 'text-red-400' : 'text-gray-400'} transition-transform duration-200 
              ${isOpen ? 'transform rotate-180' : ''}`}
            strokeWidth={2}
          />
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-[240px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50"
          >
            <div className="py-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 cursor-pointer
                    ${value === option.value ? 'text-red-400 bg-red-50 font-medium' : 'text-gray-700'}
                  `}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


// components/ui/Checkbox.js
const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 border-2 border-gray-300 rounded 
            peer appearance-none transition-colors
            hover:border-red-400
            checked:bg-red-400 checked:border-red-400"
        />
        <svg
          className="absolute w-4 h-4 pointer-events-none text-white opacity-0 
            peer-checked:opacity-100 transition-opacity duration-200 left-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="ml-2 text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>
  );
};


const ToggleButton = ({ options, value, onChange }) => {
  return (
    <div className="flex w-full rounded-lg border-2 border-gray-200 overflow-hidden">
      {options.map((option, index) => (
        <React.Fragment key={option}>
          <button
            onClick={() => onChange(option)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors relative
              ${value === option
                ? 'bg-red-400 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {option}
          </button>
          {index < options.length - 1 && (
            <div className="w-[1px] bg-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};


const MultiSelect = ({ selected = [], onChange, options = [], title, displayOrder = [], placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ensure selected items are objects with proper structure
  const sortedSelected = useMemo(() => {
    return [...selected]
      .sort((a, b) => {
        const aIndex = displayOrder.indexOf(a.value);
        const bIndex = displayOrder.indexOf(b.value);
        return aIndex - bIndex;
      });
  }, [selected, displayOrder]);

  const handleSelect = (option) => {
    const isSelected = selected.some(item => item.id === option.id);
    if (isSelected) {
      onChange(selected.filter(item => item.id !== option.id));
    } else {
      onChange([...selected, option]);
    }
  };

  const renderSelectedValues = () => {
    if (selected.length === 0) {
      return <span className="text-gray-500">{placeholder}</span>;
    }

    return (
      <div className="flex items-center gap-1 flex-wrap">
        {sortedSelected.map((value) => (
          <div
            key={value.id}
            className="bg-red-100 px-3 py-1 rounded-md flex items-center"
          >
            <span className="text-red-400 text-sm font-medium">{value.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-[#1a1a1a]">{title}</h2>
        {selected.length > 0 && (
          <span className="bg-red-100 text-red-400 text-sm font-semibold px-2 py-0.5 rounded-md">
            {selected.length}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2 bg-white border-2 rounded-lg transition-all cursor-pointer
            ${selected.length > 0 ? 'border-red-300' : 'border-gray-200'}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={0}
        >
          <div className="flex flex-1 overflow-hidden">
            {renderSelectedValues()}
          </div>
          <ChevronDown
            className={`w-5 h-5 ml-2 ${selected.length > 0 ? 'text-red-400' : 'text-gray-400'} transition-transform duration-200 
              ${isOpen ? 'transform rotate-180' : ''}`}
            strokeWidth={2}
          />
        </div>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <ul
              className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-[240px] overflow-auto"
              role="listbox"
            >
              <div className="py-1">
                {options.map((option) => (
                  <li
                    key={option.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    role="option"
                    aria-selected={selected.some(item => item.id === option.id)}
                    onClick={() => handleSelect(option)}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selected.some(item => item.id === option.id)}
                        onChange={() => handleSelect(option)}
                        className="peer h-4 w-4 appearance-none rounded border-2 border-gray-300 checked:border-red-400 checked:bg-red-400"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {selected.some(item => item.id === option.id) && (
                        <svg
                          className="absolute w-4 h-4 pointer-events-none text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="ml-2 text-gray-700">{option.label}</span>
                  </li>
                ))}
              </div>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};


const fuelData = {
  types: [
    { id: 'cng', label: 'CNG', value: 'cng' },
    { id: 'diesel', label: 'Diesel', value: 'diesel' },
    { id: 'electric', label: 'Electric', value: 'electric' },
    { id: 'ethanol', label: 'Ethanol', value: 'ethanol' },
    { id: 'hybrid', label: 'Hybrid', value: 'hybrid' },
    { id: 'hydrogen', label: 'Hydrogen', value: 'hydrogen' },
    { id: 'lpg', label: 'LPG', value: 'lpg' },
    { id: 'petrol', label: 'Petrol', value: 'petrol' }
  ],
  displayOrder: ['diesel', 'petrol', 'electric', 'hybrid', 'cng', 'lpg', 'hydrogen', 'ethanol']
};


const features = [
  { id: 'air-conditioning', label: 'Air conditioning' },
  { id: 'cruise-control', label: 'Cruise control' },
  { id: 'heated-seats', label: 'Heated front seats' },
  { id: 'steering-wheel', label: 'Multifunctional steering wheel' },
  { id: 'navigation', label: 'Navigation system' },
  { id: 'trailer', label: 'Trailer coupling' },
  { id: 'led-lights', label: 'LED headlights' },
  { id: 'xenon-lights', label: 'Xenon headlights' },
  // Add more features as needed
];

const FilterSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Add showAllFeatures state
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Add activeTab state
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');


  // Other states
  const [priceType, setPriceType] = useState(searchParams.get('priceType') || 'cash');
  const [priceFrom, setPriceFrom] = useState(searchParams.get('priceFrom') || '');
  const [priceTo, setPriceTo] = useState(searchParams.get('priceTo') || '');
  const [registrationFrom, setRegistrationFrom] = useState(searchParams.get('regFrom') || '');
  const [registrationTo, setRegistrationTo] = useState(searchParams.get('regTo') || '');
  const [mileageFrom, setMileageFrom] = useState(searchParams.get('mileageFrom') || '');
  const [mileageTo, setMileageTo] = useState(searchParams.get('mileageTo') || '');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '');
  const [vatDeduction, setVatDeduction] = useState(searchParams.get('vat') === 'true');
  const [discountedCars, setDiscountedCars] = useState(searchParams.get('discounted') === 'true');
  const [isElectricVehicle, setIsElectricVehicle] = useState(searchParams.get('electric') === 'true');
  const [hybridType, setHybridType] = useState(searchParams.get('hybridType') || '');
  const [powerUnit, setPowerUnit] = useState(searchParams.get('powerUnit') || 'hp');
  const [powerFrom, setPowerFrom] = useState(searchParams.get('powerFrom') || '');
  const [powerTo, setPowerTo] = useState(searchParams.get('powerTo') || '');
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState(() => {
    const types = searchParams.get('vehicleTypes')?.split(',').filter(Boolean) || [];
    return types;
  });
  const [is4x4, setIs4x4] = useState(searchParams.get('is4x4') === 'true');
  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    const featuresParam = searchParams.get('features')?.split(',').filter(Boolean) || [];
    return featuresParam;
  });
  const [selectedColors, setSelectedColors] = useState(() => {
    const colorsParam = searchParams.get('colors')?.split(',').filter(Boolean) || [];
    return colorsParam;
  });
  // Fix the fuel state initialization
  const [selectedFuels, setSelectedFuels] = useState(() => {
    const fuelParam = searchParams.get('fuel')?.split(',').filter(Boolean) || [];
    return fuelParam.map(fuelValue => {
      const fuelType = fuelData.types.find(f => f.value === fuelValue);
      return fuelType || null;
    }).filter(Boolean);
  });


  useEffect(() => {
    const params = new URLSearchParams();

    // Add tab to URL if it's not 'all'
    if (activeTab !== 'all') params.set('tab', activeTab);

    // Only add parameters if they have values
    if (priceType !== 'cash') params.set('priceType', priceType);
    if (priceFrom) params.set('priceFrom', priceFrom);
    if (priceTo) params.set('priceTo', priceTo);
    if (registrationFrom) params.set('regFrom', registrationFrom);
    if (registrationTo) params.set('regTo', registrationTo);
    if (mileageFrom) params.set('mileageFrom', mileageFrom);
    if (mileageTo) params.set('mileageTo', mileageTo);
    if (transmission) params.set('transmission', transmission);
    if (vatDeduction) params.set('vat', 'true');
    if (discountedCars) params.set('discounted', 'true');
    // Fix the fuel params handling
    if (selectedFuels.length > 0) {
      params.set('fuel', selectedFuels.map(f => f.value).join(','));
    } else {
      params.delete('fuel');
    }
    if (isElectricVehicle) params.set('electric', 'true');
    if (hybridType) params.set('hybridType', hybridType);
    if (powerUnit !== 'hp') params.set('powerUnit', powerUnit);
    if (powerFrom) params.set('powerFrom', powerFrom);
    if (powerTo) params.set('powerTo', powerTo);
    if (selectedFeatures.length > 0) params.set('features', selectedFeatures.join(','));
    if (selectedVehicleTypes.length > 0) params.set('vehicleTypes', selectedVehicleTypes.join(','));
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    if (is4x4) params.set('is4x4', 'true');

    // Construct the new URL
    const newPath = `/cars${params.toString() ? `?${params.toString()}` : ''}`;

    // Only update if the path has changed
    if (router.asPath !== newPath) {
      router.push(newPath, { scroll: false });
    }
  }, [
    activeTab, // Add activeTab to dependencies
    priceType,
    priceFrom,
    priceTo,
    registrationFrom,
    registrationTo,
    mileageFrom,
    mileageTo,
    transmission,
    vatDeduction,
    discountedCars,
    selectedFuels,
    isElectricVehicle,
    hybridType,
    powerUnit,
    powerFrom,
    powerTo,
    selectedVehicleTypes,
    selectedColors,
    is4x4,
    selectedFeatures,
    router
  ]);

  // hasFilters check
  const hasFilters = Boolean(
    priceFrom ||
    priceTo ||
    registrationFrom ||
    registrationTo ||
    mileageFrom ||
    mileageTo ||
    transmission ||
    selectedFuels.length > 0 ||
    vatDeduction ||
    discountedCars ||
    priceType !== 'cash' ||
    isElectricVehicle ||
    hybridType ||
    powerFrom ||
    powerTo ||
    powerUnit !== 'hp' ||
    selectedVehicleTypes.length > 0 ||
    is4x4 ||
    selectedColors.length > 0 ||
    selectedFeatures.length > 0
  );

  // Update resetFilters
  const resetFilters = () => {
    setPriceFrom('');
    setPriceTo('');
    setRegistrationFrom('');
    setRegistrationTo('');
    setMileageFrom('');
    setMileageTo('');
    setTransmission('');
    setVatDeduction(false);
    setDiscountedCars(false);
    setPriceType('cash');
    setSelectedFuels([]);
    setIsElectricVehicle(false);
    setHybridType('');
    setPowerUnit('hp');
    setPowerFrom('');
    setPowerTo('');
    setSelectedVehicleTypes([]);
    setIs4x4(false);
    setSelectedColors([]); // Add this line
    setSelectedFeatures([]); // Added setSelectedFeatures
  };


  // Add vehicle types data
  const vehicleTypes = [
    { id: 'cabriolet', label: 'Cabriolet', value: 'cabriolet' },
    { id: 'compact', label: 'Compact', value: 'compact' },
    { id: 'coupe', label: 'Coupe', value: 'coupe' },
    { id: 'estate', label: 'Estate car', value: 'estate' },
    { id: 'hatchback', label: 'Hatchback', value: 'hatchback' },
    { id: 'light', label: 'Light truck', value: 'light' },
    // Add more vehicle types...
  ];

  // Create the Features section component:
  const FeaturesSection = () => {
    const visibleFeatures = showAllFeatures ? features : features.slice(0, 8);

    const handleFeatureToggle = (featureId) => {
      setSelectedFeatures(prev =>
        prev.includes(featureId)
          ? prev.filter(id => id !== featureId)
          : [...prev, featureId]
      );
    };

    return (
      <div>
        <h2 className="text-sm font-bold text-[#1a1a1a] mb-3">FEATURES</h2>
        <div className="space-y-3">
          {visibleFeatures.map(feature => (
            <Checkbox
              key={feature.id}
              label={feature.label}
              checked={selectedFeatures.includes(feature.id)}
              onChange={() => handleFeatureToggle(feature.id)}
            />
          ))}

          {!showAllFeatures && features.length > 8 && (
            <button
              onClick={() => setShowAllFeatures(true)}
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center mt-2"
            >
              More features
              <svg
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Create Power Unit Toggle Component
  const PowerUnitToggle = ({ value, onChange }) => {
    return (
      <div className="flex gap-1">
        <button
          onClick={() => onChange('hp')}
          className={`px-2 py-0.5 text-xs font-medium rounded transition-colors
          ${value === 'hp'
              ? 'bg-red-400 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          hp
        </button>
        <button
          onClick={() => onChange('kw')}
          className={`px-2 py-0.5 text-xs font-medium rounded transition-colors
          ${value === 'kw'
              ? 'bg-red-400 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          kw
        </button>
      </div>
    );
  };

  const getPowerOptions = (unit) => {
    const multiplier = unit === 'hp' ? 1 : 0.745699872; // Convert HP to kW
    return Array.from(
      { length: 50 },
      (_, i) => ({
        value: String(Math.round((i + 1) * 10)),
        label: `${Math.round((i + 1) * 10 * multiplier)} ${unit}`
      })
    );
  };

  // Generate options for various selects
  const currentYear = new Date().getFullYear();
  const registrationYears = Array.from(
    { length: currentYear - 1990 + 1 },
    (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i)
    })
  );

  const mileageOptions = Array.from(
    { length: 31 },
    (_, i) => ({
      value: String(i * 10000),
      label: `${(i * 10000).toLocaleString()} km`
    })
  );

  const priceOptions = Array.from(
    { length: 100 },
    (_, i) => ({
      value: String((i + 1) * 1000),
      label: `${((i + 1) * 1000).toLocaleString()} €`
    })
  );

  // Tabs configuration
  const tabs = [
    { id: 'all', label: 'All', icon: Sliders },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'history', label: 'History', icon: Clock },
  ];


  const TabContent = ({ tabId }) => {
    switch (tabId) {
      case 'all':
        return (
          <div className="space-y-6">
            {/* Make and Model Section */}
            <div>
              <h2 className="text-sm font-bold text-[#1a1a1a] mb-3">MAKE AND MODEL</h2>
              <button className="w-full flex items-center justify-between px-4 py-2.5 border-2 border-gray-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                <div className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                  <span className="font-medium">Add a car</span>
                </div>
                <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Price Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-[#1a1a1a]">PRICE (€)</h2>
                <div className="flex shadow-sm">
                  <button
                    onClick={() => setPriceType('instalments')}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-l-lg ${priceType === 'instalments'
                      ? 'bg-red-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    Instalments
                  </button>
                  <button
                    onClick={() => setPriceType('cash')}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-r-lg ${priceType === 'cash'
                      ? 'bg-red-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    Cash
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <CustomSelect
                  value={priceFrom}
                  onChange={setPriceFrom}
                  placeholder="From"
                  options={priceOptions}
                />
                <CustomSelect
                  value={priceTo}
                  onChange={setPriceTo}
                  placeholder="To"
                  options={priceOptions}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={vatDeduction}
                  onChange={(e) => setVatDeduction(e.target.checked)}
                  className="w-4 h-4 border-2 border-gray-300 rounded text-red-400 focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                />
                <span className="ml-2 text-gray-700 group-hover:text-gray-900">VAT deduction</span>
              </label>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer flex-1 group">
                  <input
                    type="checkbox"
                    checked={discountedCars}
                    onChange={(e) => setDiscountedCars(e.target.checked)}
                    className="w-4 h-4 border-2 border-gray-300 rounded text-red-400 focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-gray-900">Discounted cars</span>
                  <div className="ml-2 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs cursor-help">
                    i
                  </div>
                </label>
                <div className="mx-3 p-1 bg-orange-500 text-white rounded">
                  <TrendingDown size={16} />
                </div>
              </div>
            </div>

            {/* Registration Section */}
            <div>
              <h2 className="text-sm font-bold text-[#1a1a1a] mb-3">REGISTRATION</h2>
              <div className="flex gap-2">
                <CustomSelect
                  value={registrationFrom}
                  onChange={setRegistrationFrom}
                  placeholder="From"
                  options={registrationYears}
                />
                <CustomSelect
                  value={registrationTo}
                  onChange={setRegistrationTo}
                  placeholder="To"
                  options={registrationYears}
                />
              </div>
            </div>

            {/* Mileage Section */}
            <div>
              <h2 className="text-sm font-bold text-[#1a1a1a] mb-3">MILEAGE</h2>
              <div className="flex gap-2">
                <CustomSelect
                  value={mileageFrom}
                  onChange={setMileageFrom}
                  placeholder="From"
                  options={mileageOptions}
                />
                <CustomSelect
                  value={mileageTo}
                  onChange={setMileageTo}
                  placeholder="To"
                  options={mileageOptions}
                />
              </div>
            </div>

            {/* Transmission Section */}
            <div>
              <h2 className="text-sm font-bold text-[#1a1a1a] mb-3">TRANSMISSION</h2>
              <ToggleButton
                options={['Automatic', 'Manual']}
                value={transmission}
                onChange={setTransmission}
              />
            </div>

            <MultiSelect
              title="FUEL"
              selected={selectedFuels}
              onChange={(newSelected) => {
                setSelectedFuels(newSelected);
              }}
              options={fuelData.types}
              displayOrder={fuelData.displayOrder}
            />

            {/* // Add this section in your TabContent component (in the 'all' case): */}
            <div className="bg-red-50 p-4 rounded-lg space-y-4">
              <h2 className="text-sm font-bold text-[#1a1a1a]">ELETRIC & HYBRID</h2>

              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isElectricVehicle}
                  onChange={(e) => setIsElectricVehicle(e.target.checked)}
                  className="w-4 h-4 border-2 border-gray-300 rounded text-red-400 focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                />
                <span className="ml-2 text-gray-700 group-hover:text-gray-900">
                  Electric vehicles
                </span>
              </label>

              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">HYBRID TYPE</h3>
                <div className="flex w-full rounded-lg border-2 border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setHybridType('plug-in')}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors
          ${hybridType === 'plug-in'
                        ? 'bg-red-400 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Plug-in hybrid
                  </button>
                  <div className="w-[1px] bg-gray-200" />
                  <button
                    onClick={() => setHybridType('full')}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors
          ${hybridType === 'full'
                        ? 'bg-red-400 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Full hybrid
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-[#1a1a1a]">POWER</h2>
                <PowerUnitToggle
                  value={powerUnit}
                  onChange={setPowerUnit}
                />
              </div>
              <div className="flex gap-2">
                <CustomSelect
                  value={powerFrom}
                  onChange={setPowerFrom}
                  placeholder="From"
                  options={getPowerOptions(powerUnit)}
                />
                <CustomSelect
                  value={powerTo}
                  onChange={setPowerTo}
                  placeholder="To"
                  options={getPowerOptions(powerUnit)}
                />
              </div>
            </div>

            <MultiSelect
              title="VEHICLE TYPE"
              selected={selectedVehicleTypes.map(type => ({
                id: type,
                value: type,
                label: vehicleTypes.find(t => t.value === type)?.label || type
              }))}
              onChange={(newSelected) => {
                setSelectedVehicleTypes(newSelected.map(s => s.value));
              }}
              options={vehicleTypes}
              displayOrder={vehicleTypes.map(t => t.value)}
              placeholder="All"
            />

            {/* // Add these sections in your TabContent component where you want them: */}
            <Checkbox
              label="Drive type 4x4"
              checked={is4x4}
              onChange={(e) => setIs4x4(e.target.checked)}
            />

            <MultiColorSelector
              selectedColors={selectedColors}
              onColorSelect={setSelectedColors}
            />
            <hr className='mt-1 mb-1' />
            <FeaturesSection />

            <button
              className="text-red-400 hover:text-red-500 font-medium text-sm flex items-center"
            >
              More features
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            <hr className='mt-1 mb-1' />

            {/* After FeaturesSection */}
            <div className="space-y-2 pt-2">
              <button
                className="w-full py-2.5 text-red-400 hover:bg-red-50 border-2 border-red-400 rounded-lg font-medium transition-colors"
                onClick={() => {
                  // Add your detailed search logic here
                }}
              >
                Detailed search
              </button>
            </div>
          </div>
        );

      case 'saved':
        return (
          <div className="py-8 text-center">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Your saved filters will appear here</p>
          </div>
        );

      case 'history':
        return (
          <div className="py-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Your search history will appear here</p>
          </div>
        );
    }
  };

  // Function to close mobile sidebar
  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  // Main content component to avoid repetition
  const FilterContent = () => (
    <div className="p-6 bg-white h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Filter</h1>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={closeMobileSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center mr-8 pb-2 relative transition-colors 
                ${isActive ? 'text-red-400' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className={`p-2 rounded-md mb-1 transition-colors ${isActive ? 'bg-red-50' : ''}`}>
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <TabContent tabId={activeTab} />
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-full max-w-[320px] z-30 transform transition-transform duration-300 ease
        md:relative md:transform-none md:w-auto md:max-w-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Desktop Card */}
        <div className="hidden md:block rounded-lg shadow-lg">
          <FilterContent />
        </div>

        {/* Mobile Fullheight Sidebar */}
        <div className="h-full sm:hidden">
          <FilterContent />
        </div>
      </div>
    </>
  );
};


export default FilterSidebar;