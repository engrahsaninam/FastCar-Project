"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Portal,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  VStack,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import {
  ChevronDown,
  Plus,
  Clock,
  Bookmark,
  Sliders,
  TrendingDown,
  X,
  Trash2,
  ChevronRight,
  Search,
  Check,
} from 'lucide-react';

// Custom icon wrapper for Chakra UI
const LucideIcon = ({ icon: Icon, ...props }) => {
  return <Box as={Icon} {...props} />;
};

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
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        {selectedColors.length > 0 && (
          <Tag size="sm" bg="red.100" color="red.400" fontWeight="semibold" borderRadius="md">
            <TagLabel>{selectedColors.length}</TagLabel>
          </Tag>
        )}
      </Flex>
      <Grid templateColumns="repeat(7, 1fr)" gap={4}>
        {colorOptions.map((color) => (
          <Box
            key={color.id}
            as="button"
            w="6"
            h="6"
            borderRadius="full"
            position="relative"
            transition="transform 0.2s"
            borderWidth={color.border ? "1px" : "0"}
            borderColor="gray.200"
            bg={color.value}
            _hover={{ transform: "scale(1.1)" }}
            _focus={{
              outline: "none",
              boxShadow: "0 0 0 2px #FEB2B2, 0 0 0 4px white"
            }}
            onClick={() => toggleColor(color.id)}
            aria-label={color.label}
            title={color.label}
            {...(selectedColors.includes(color.id) && {
              transform: "scale(1.1)",
              boxShadow: "0 0 0 2px #FEB2B2, 0 0 0 4px white"
            })}
          >
            {selectedColors.includes(color.id) && (
              <Box
                as="svg"
                position="absolute"
                inset="0"
                m="auto"
                w="4"
                h="4"
                color={color.id === 'white' || color.id === 'yellow' ? "gray.900" : "white"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </Box>
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};






const CustomSelect = ({ value, onChange, placeholder, options }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const selectRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  return (
    <Box position="relative" flex="1" ref={selectRef}>
      <Flex
        onClick={onToggle}
        align="center"
        justify="space-between"
        px={3}
        py={2}
        bg="white"
        borderWidth="2px"
        borderRadius="lg"
        transition="all 0.2s"
        cursor="pointer"
        borderColor={value ? "red.300" : "gray.200"}
        bgColor={value ? "red.50" : "white"}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
      >
        <Flex align="center" flex="1">
          <Text
            color={value ? "red.400" : "gray.500"}
            fontWeight={value ? "semibold" : "normal"}
            fontSize="xs"
          >
            {value ? (options.find(opt => opt.value === value)?.label || value) : placeholder}
          </Text>
        </Flex>
        <Flex align="center">
          {value && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              _hover={{ bg: "red.100" }}
              borderRadius="full"
              color="red.400"
              cursor="pointer"
            >
              <LucideIcon icon={X} boxSize="14px" strokeWidth={2.5} />
            </Box>
          )}
          <Box
            as={ChevronDown}
            boxSize="5"
            color={value ? "red.400" : "gray.400"}
            transition="transform 0.2s"
            transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
            strokeWidth={2}
          />
        </Flex>
      </Flex>

      {isOpen && (
        <>
          <Box
            position="fixed"
            inset="0"
            zIndex={1500}
            onClick={onClose}
          />
          <Portal>
            <Box
              position="absolute"
              top={`${dropdownPosition.top}px`}
              left={`${dropdownPosition.left}px`}
              width={`${dropdownPosition.width}px`}
              zIndex={1600}
              bg="white"
              borderWidth="2px"
              borderColor="gray.200"
              borderRadius="lg"
              boxShadow="xl"
              maxH="240px"
              overflowY="auto"
              sx={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  bg: 'gray.50',
                },
                '&::-webkit-scrollbar-thumb': {
                  bg: 'gray.300',
                  borderRadius: 'full',
                },
              }}
            >
              <Box py="1">
                {options.map((option) => (
                  <Box
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      onClose();
                    }}
                    w="full"
                    px="4"
                    py="2"
                    textAlign="left"
                    _hover={{ bg: "gray.50" }}
                    cursor="pointer"
                    color={value === option.value ? "red.400" : "gray.700"}
                    bg={value === option.value ? "red.50" : "transparent"}
                    fontWeight={value === option.value ? "medium" : "normal"}
                  >
                    {option.label}
                  </Box>
                ))}
              </Box>
            </Box>
          </Portal>
        </>
      )}
    </Box>
  );
};

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <Flex
      as="label"
      align="center"
      cursor="pointer"
      _hover={{ "span": { color: "gray.900" } }}
    >
      <Box position="relative" display="flex" alignItems="center">
        <Box
          as="input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          h="4"
          w="4"
          borderWidth="2px"
          borderColor="gray.300"
          borderRadius="sm"
          appearance="none"
          transition="colors 0.2s"
          _hover={{ borderColor: "red.400" }}
          _checked={{ bg: "red.400", borderColor: "red.400" }}
          position="relative"
          zIndex="1"
          sx={{
            '&:checked': {
              backgroundColor: 'var(--chakra-colors-red-400)',
              borderColor: 'var(--chakra-colors-red-400)'
            }
          }}
        />
        {checked && (
          <Box
            as="svg"
            position="absolute"
            w="4"
            h="4"
            pointerEvents="none"
            color="white"
            zIndex="2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            left="0"
          >
            <polyline points="20 6 9 17 4 12" />
          </Box>
        )}
      </Box>
      <Text ml={2} color="gray.700">
        {label}
      </Text>
    </Flex>
  );
};


const ToggleButton = ({ options, value, onChange }) => {
  return (
    <Flex w="full" borderRadius="lg" overflow="hidden">
      {options.map((option, index) => (
        <Button
          key={option}
          onClick={() => onChange(option)}
          flex="1"
          py="2.5"
          fontSize="sm"
          fontWeight="medium"
          bg={value === option ? "red.400" : "white"}
          color={value === option ? "white" : "gray.700"}
          _hover={value !== option ? { bg: "gray.50" } : {}}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="0"
          borderLeftRadius={index === 0 ? "lg" : "0"}
          borderRightRadius={index === options.length - 1 ? "lg" : "0"}
          transition="colors 0.2s"
          height="42px"
        >
          {option}
        </Button>
      ))}
    </Flex>
  );
};



const MultiSelect = ({ selected = [], onChange, options = [], title, displayOrder = [], placeholder }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const selectRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Ensure selected items are objects with proper structure
  const sortedSelected = useMemo(() => {
    return [...selected]
      .sort((a, b) => {
        const aIndex = displayOrder.indexOf(a.value);
        const bIndex = displayOrder.indexOf(b.value);
        return aIndex - bIndex;
      });
  }, [selected, displayOrder]);

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

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
      return <Text color="gray.500">{placeholder}</Text>;
    }

    return (
      <Flex align="center" gap="1" flexWrap="wrap">
        {sortedSelected.map((value) => (
          <Box
            key={value.id}
            bg="red.100"
            px={3}
            py={1}
            borderRadius="md"
            display="flex"
            alignItems="center"
          >
            <Text color="red.400" fontSize="sm" fontWeight="medium">{value.label}</Text>
          </Box>
        ))}
      </Flex>
    );
  };

  // Function to check if an option is selected
  const isOptionSelected = (optionId) => {
    return selected.some(item => item.id === optionId);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading as="h2" fontSize="sm" fontWeight="bold" color="#1a1a1a">{title}</Heading>
      </Flex>
      <Box position="relative" w="full" ref={selectRef}>
        <Flex
          onClick={onToggle}
          align="center"
          justify="space-between"
          px={4}
          py={2}
          bg="white"
          borderWidth="2px"
          borderRadius="lg"
          transition="all 0.2s"
          cursor="pointer"
          borderColor={selected.length > 0 ? "red.300" : "gray.200"}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={0}
        >
          <Box flex="1" overflow="hidden">
            {renderSelectedValues()}
          </Box>
          <Box
            as={ChevronDown}
            boxSize="5"
            ml={2}
            color={selected.length > 0 ? "red.400" : "gray.400"}
            transition="transform 0.2s"
            transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
            strokeWidth={2}
          />
        </Flex>

        {isOpen && (
          <>
            <Box
              position="fixed"
              inset="0"
              zIndex={1500}
              onClick={onClose}
            />
            <Portal>
              <Box
                as="ul"
                position="absolute"
                top={`${dropdownPosition.top}px`}
                left={`${dropdownPosition.left}px`}
                width={`${dropdownPosition.width}px`}
                zIndex={1600}
                bg="white"
                borderWidth="2px"
                borderColor="gray.200"
                borderRadius="lg"
                boxShadow="xl"
                maxH="240px"
                overflowY="auto"
                role="listbox"
              >
                <Box py="1">
                  {options.map((option) => {
                    const checked = isOptionSelected(option.id);
                    return (
                      <Flex
                        as="li"
                        key={option.id}
                        align="center"
                        px={4}
                        py={2}
                        _hover={{ bg: "gray.50" }}
                        cursor="pointer"
                        role="option"
                        aria-selected={checked}
                        onClick={() => handleSelect(option)}
                      >
                        <Checkbox
                          isChecked={checked}
                          onChange={() => handleSelect(option)}
                          colorScheme="red"
                          mr={2}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Text color="gray.700">{option.label}</Text>
                      </Flex>
                    );
                  })}
                </Box>
              </Box>
            </Portal>
          </>
        )}
      </Box>
    </Box>
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
  // Make Model state
  const [isMakeModelOpen, setIsMakeModelOpen] = useState(false);
  const [makeModelFilters, setMakeModelFilters] = useState(() => {
    const makeModelParam = searchParams.get('makeModel')?.split(',').filter(Boolean) || [];
    return makeModelParam.map(param => {
      const [make, model] = param.split('-');
      return {
        id: `${make}-${model}`,
        make,
        model
      };
    });
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

    if (makeModelFilters.length > 0) {
      params.set('makeModel', makeModelFilters.map(f => f.id).join(','));
    }

    // Construct the new URL
    const newPath = `/cars${params.toString() ? `?${params.toString()}` : ''}`;

    // Only update if the path has changed
    if (router.asPath !== newPath) {
      router.push(newPath, { scroll: false });
    }
  }, [
    activeTab,
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
    makeModelFilters,
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
    selectedFeatures.length > 0 ||
    makeModelFilters.length > 0
  );

  // Reset filters
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
    setSelectedColors([]);
    setSelectedFeatures([]);
    setMakeModelFilters([]);
  };

  // Vehicle types data
  const vehicleTypes = [
    { id: 'cabriolet', label: 'Cabriolet', value: 'cabriolet' },
    { id: 'compact', label: 'Compact', value: 'compact' },
    { id: 'coupe', label: 'Coupe', value: 'coupe' },
    { id: 'estate', label: 'Estate car', value: 'estate' },
    { id: 'hatchback', label: 'Hatchback', value: 'hatchback' },
    { id: 'light', label: 'Light truck', value: 'light' },
  ];

  // Sample data for makes and models
  const makes = [
    { id: 'audi', name: 'Audi', popular: true },
    { id: 'bmw', name: 'BMW', popular: true },
    { id: 'mercedes', name: 'Mercedes-Benz', popular: true },
    { id: 'volkswagen', name: 'Volkswagen', popular: true },
    { id: 'toyota', name: 'Toyota', popular: false },
    { id: 'honda', name: 'Honda', popular: false },
    { id: 'ford', name: 'Ford', popular: false },
    { id: 'hyundai', name: 'Hyundai', popular: false }
  ];

  const models = {
    audi: [
      { id: 'all', name: 'All Models', popular: true },
      { id: 'a3', name: 'A3', popular: true },
      { id: 'a4', name: 'A4', popular: true },
      { id: 'a6', name: 'A6', popular: true },
      { id: 'q5', name: 'Q5', popular: true },
      { id: 'q7', name: 'Q7', popular: false }
    ],
    bmw: [
      { id: 'all', name: 'All Models', popular: true },
      { id: '3-series', name: '3 Series', popular: true },
      { id: '5-series', name: '5 Series', popular: true },
      { id: 'x3', name: 'X3', popular: true },
      { id: 'x5', name: 'X5', popular: true }
    ]
  };

  const MakeModelSelection = ({ selectedFilters, onRemoveFilter }) => {
    if (selectedFilters.length === 0) return null;

    return (
      <Flex mt={3} flexWrap="wrap" gap={2}>
        {selectedFilters.map(filter => (
          <Flex
            key={filter.id}
            align="center"
            gap={2}
            bg="red.50"
            px={3}
            py={1.5}
            borderRadius="lg"
            fontSize="sm"
          >
            <Text fontWeight="medium" color="red.500">
              {filter.make} {filter.model !== 'all' ? filter.model : '(All)'}
            </Text>
            <Box
              as="button"
              color="red.400"
              _hover={{ color: "red.600" }}
              onClick={() => onRemoveFilter(filter.id)}
            >
              <LucideIcon icon={X} boxSize="14px" strokeWidth={2.5} />
            </Box>
          </Flex>
        ))}
      </Flex>
    );
  };

  const MakeModelPopup = ({ isOpen, onClose, onSelect, selectedFilters = [] }) => {
    const [selectedMake, setSelectedMake] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModels, setSelectedModels] = useState([]);

    useEffect(() => {
      if (isOpen) {
        setSelectedMake(null);
        setSearchTerm('');
        setSelectedModels([]);
      }
    }, [isOpen]);

    const handleMakeSelect = (make) => {
      setSelectedMake(make);
      setSearchTerm('');
    };

    const handleModelToggle = (model) => {
      setSelectedModels(prev => {
        const modelKey = `${selectedMake.id}-${model.id}`;
        if (model.id === 'all') {
          if (prev.includes(modelKey)) {
            return prev.filter(id => !id.startsWith(selectedMake.id));
          }
          return [...prev.filter(id => !id.startsWith(selectedMake.id)), modelKey];
        }
        const withoutAll = prev.filter(id => id !== `${selectedMake.id}-all`);
        if (prev.includes(modelKey)) {
          return withoutAll.filter(id => id !== modelKey);
        }
        return [...withoutAll, modelKey];
      });
    };

    const filteredMakes = makes.filter(make =>
      make.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const popularMakes = filteredMakes.filter(make => make.popular);
    const otherMakes = filteredMakes.filter(make => !make.popular);
    const currentModels = selectedMake ? models[selectedMake.id] || [] : [];
    const popularModels = currentModels.filter(model => model.popular);
    const otherModels = currentModels.filter(model => !model.popular && model.id !== 'all');

    if (!isOpen) return null;

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(2px)" />
        <ModalContent
          w="full"
          maxW="2xl"
          maxH="90vh"
          borderRadius="xl"
          overflow="hidden"
        >
          {/* Header */}
          <ModalHeader display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth="1px">
            <Heading size="md" fontWeight="semibold">
              {selectedMake ? `Select ${selectedMake.name} Model` : 'Select Make'}
            </Heading>
            <ModalCloseButton position="static" />
          </ModalHeader>

          {/* Search */}
          <Box p={4} borderBottomWidth="1px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <LucideIcon icon={Search} color="gray.400" boxSize="5" />
              </InputLeftElement>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={selectedMake ? "Search models..." : "Search makes..."}
                borderWidth="2px"
                borderColor="gray.200"
                borderRadius="lg"
                _focus={{ borderColor: "red.300", boxShadow: "0 0 0 1px var(--chakra-colors-red-200)" }}
                pl="10"
              />
            </InputGroup>
          </Box>

          {/* Content - Scrollable */}
          <ModalBody overflowY="auto">
            {!selectedMake ? (
              <VStack spacing={6} align="stretch">
                {popularMakes.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={3}>
                      POPULAR MAKES
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                      {popularMakes.map(make => (
                        <Button
                          key={make.id}
                          onClick={() => handleMakeSelect(make)}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={3}
                          textAlign="left"
                          borderWidth="2px"
                          borderColor="gray.200"
                          borderRadius="lg"
                          bg="white"
                          _hover={{ borderColor: "red.300", bg: "red.50" }}
                          transition="all 0.2s"
                          h="auto"
                          w="full"
                          variant="unstyled"
                        >
                          <Text fontWeight="medium">{make.name}</Text>
                          <LucideIcon
                            icon={ChevronRight}
                            boxSize="5"
                            color="gray.400"
                            className="group-hover:text-red-400"
                          />
                        </Button>
                      ))}
                    </Grid>
                  </Box>
                )}

                {otherMakes.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={3}>
                      OTHER MAKES
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                      {otherMakes.map(make => (
                        <Button
                          key={make.id}
                          onClick={() => handleMakeSelect(make)}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={3}
                          textAlign="left"
                          borderWidth="2px"
                          borderColor="gray.200"
                          borderRadius="lg"
                          bg="white"
                          _hover={{ borderColor: "red.300", bg: "red.50" }}
                          transition="all 0.2s"
                          h="auto"
                          w="full"
                          variant="unstyled"
                        >
                          <Text fontWeight="medium">{make.name}</Text>
                          <LucideIcon
                            icon={ChevronRight}
                            boxSize="5"
                            color="gray.400"
                            className="group-hover:text-red-400"
                          />
                        </Button>
                      ))}
                    </Grid>
                  </Box>
                )}
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                {popularModels.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={3}>
                      POPULAR MODELS
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                      {popularModels.map(model => (
                        <Button
                          key={model.id}
                          onClick={() => handleModelToggle(model)}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={3}
                          textAlign="left"
                          borderWidth="2px"
                          borderRadius="lg"
                          h="auto"
                          w="full"
                          variant="unstyled"
                          borderColor={
                            selectedModels.includes(`${selectedMake.id}-${model.id}`)
                              ? "red.300"
                              : "gray.200"
                          }
                          bg={
                            selectedModels.includes(`${selectedMake.id}-${model.id}`)
                              ? "red.50"
                              : "white"
                          }
                          _hover={
                            !selectedModels.includes(`${selectedMake.id}-${model.id}`)
                              ? { borderColor: "red.300", bg: "red.50" }
                              : {}
                          }
                          transition="all 0.2s"
                        >
                          <Text fontWeight="medium">{model.name}</Text>
                          {selectedModels.includes(`${selectedMake.id}-${model.id}`) && (
                            <LucideIcon icon={Check} boxSize="5" color="red.400" />
                          )}
                        </Button>
                      ))}
                    </Grid>
                  </Box>
                )}

                {otherModels.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={3}>
                      OTHER MODELS
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                      {otherModels.map(model => (
                        <Button
                          key={model.id}
                          onClick={() => handleModelToggle(model)}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={3}
                          textAlign="left"
                          borderWidth="2px"
                          borderRadius="lg"
                          h="auto"
                          w="full"
                          variant="unstyled"
                          borderColor={
                            selectedModels.includes(`${selectedMake.id}-${model.id}`)
                              ? "red.300"
                              : "gray.200"
                          }
                          bg={
                            selectedModels.includes(`${selectedMake.id}-${model.id}`)
                              ? "red.50"
                              : "white"
                          }
                          _hover={
                            !selectedModels.includes(`${selectedMake.id}-${model.id}`)
                              ? { borderColor: "red.300", bg: "red.50" }
                              : {}
                          }
                          transition="all 0.2s"
                        >
                          <Text fontWeight="medium">{model.name}</Text>
                          {selectedModels.includes(`${selectedMake.id}-${model.id}`) && (
                            <LucideIcon icon={Check} boxSize="5" color="red.400" />
                          )}
                        </Button>
                      ))}
                    </Grid>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>

          {/* Footer */}
          <ModalFooter bg="gray.50" borderTopWidth="1px" borderRadius="0 0 xl xl">
            <Flex justify="space-between" w="full">
              <Button
                onClick={() => {
                  if (selectedMake) {
                    setSelectedMake(null);
                  } else {
                    onClose();
                  }
                }}
                variant="ghost"
                color="gray.600"
                _hover={{ color: "gray.800" }}
                fontWeight="medium"
              >
                {selectedMake ? 'Back' : 'Cancel'}
              </Button>
              <Button
                onClick={() => {
                  if (selectedModels.length > 0) {
                    const filters = selectedModels.map(id => {
                      const [make, model] = id.split('-');
                      return {
                        id,
                        make: makes.find(m => m.id === make)?.name,
                        model: models[make]?.find(m => m.id === model)?.name || model
                      };
                    });
                    onSelect(filters);
                    onClose();
                  }
                }}
                isDisabled={selectedModels.length === 0}
                bg={selectedModels.length > 0 ? "red.500" : "gray.100"}
                color={selectedModels.length > 0 ? "white" : "gray.400"}
                _hover={selectedModels.length > 0 ? { bg: "red.600" } : {}}
                fontWeight="medium"
                borderRadius="lg"
                px={6}
              >
                Apply ({selectedModels.length})
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const Category = ({ title, children, badge = null, defaultOpen = false }) => {
    // Create a unique key for this category's state in localStorage
    const storageKey = `category-${title.toLowerCase().replace(/\s+/g, '-')}`;

    // Initialize state from localStorage or use default
    const [isOpen, setIsOpen] = useState(() => {
      try {
        const saved = localStorage.getItem(storageKey);
        return saved !== null ? JSON.parse(saved) : defaultOpen;
      } catch {
        return defaultOpen;
      }
    });

    // Persist state changes to localStorage
    useEffect(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(isOpen));
      } catch (error) {
        console.error('Failed to save category state:', error);
      }
    }, [isOpen, storageKey]);

    // Clean up localStorage when component unmounts
    useEffect(() => {
      return () => {
        try {
          localStorage.removeItem(storageKey);
        } catch (error) {
          console.error('Failed to clean up category state:', error);
        }
      };
    }, [storageKey]);

    return (
      <Box borderBottomWidth="1px" borderColor="gray.100" _last={{ borderBottom: 0 }}>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(prev => !prev);
          }}
          w="full"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          py="10px"
          textAlign="left"
          variant="unstyled"
          _focus={{ outline: "none" }}
          _hover={{ "h2": { color: "gray.900" } }}
          h="auto"
        >
          <Flex align="center" gap={2} mb={1}>
            <Heading
              as="h2"
              fontSize="sm"
              fontWeight="bold"
              color="#1a1a1a"
            >
              {title}
            </Heading>
            {badge && (
              <Tag size="sm" bg="red.100" color="red.400" fontWeight="semibold" borderRadius="md">
                <TagLabel>{badge}</TagLabel>
              </Tag>
            )}
          </Flex>
          <Box
            as={ChevronDown}
            boxSize="5"
            mb={1}
            color="gray.400"
            transition="transform 0.2s"
            transform={isOpen ? "rotate(180deg)" : "none"}
          />
        </Button>

        <Collapse in={isOpen} animateOpacity>
          <Box
            mb={4}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </Box>
        </Collapse>
      </Box>
    );
  };

  // Features section component
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
      <Box>
        <VStack spacing={3} align="stretch">
          {visibleFeatures.map(feature => (
            <CustomCheckbox
              key={feature.id}
              label={feature.label}
              checked={selectedFeatures.includes(feature.id)}
              onChange={() => handleFeatureToggle(feature.id)}
            />
          ))}

          {!showAllFeatures && features.length > 8 && (
            <Button
              onClick={() => setShowAllFeatures(true)}
              color="red.600"
              _hover={{ color: "red.700" }}
              fontWeight="medium"
              fontSize="sm"
              variant="unstyled"
              display="flex"
              alignItems="center"
              mt={2}
              height="auto"
            >
              More features
              <Box as="svg"
                w="4"
                h="4"
                ml="1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </Box>
            </Button>
          )}
        </VStack>
      </Box>
    );
  };

  // Power Unit Toggle Component
  // Power Unit Toggle Component
  const PowerUnitToggle = ({ value, onChange }) => {
    return (
      <HStack spacing={1}>
        <Button
          onClick={() => onChange('hp')}
          size="xs"
          px={2}
          py={0.5}
          fontWeight="medium"
          borderRadius="md"
          bg={value === 'hp' ? "red.400" : "gray.100"}
          color={value === 'hp' ? "white" : "gray.600"}
          _hover={value !== 'hp' ? { bg: "gray.200" } : {}}
          transition="colors 0.2s"
        >
          hp
        </Button>
        <Button
          onClick={() => onChange('kw')}
          size="xs"
          px={2}
          py={0.5}
          fontWeight="medium"
          borderRadius="md"
          bg={value === 'kw' ? "red.400" : "gray.100"}
          color={value === 'kw' ? "white" : "gray.600"}
          _hover={value !== 'kw' ? { bg: "gray.200" } : {}}
          transition="colors 0.2s"
        >
          kw
        </Button>
      </HStack>
    );
  };



  const getPowerOptions = (unit) => {
    // Common power values in hp
    const hpValues = [
      75, 100, 125, 150, 175, 200, 225, 250, 275, 300,
      325, 350, 375, 400, 450, 500, 550, 600, 650, 700
    ];

    // Common power values in kW
    const kwValues = [
      55, 74, 92, 110, 129, 147, 165, 184, 202, 221,
      239, 257, 276, 294, 331, 368, 405, 441, 478, 515
    ];

    if (unit === 'hp') {
      return hpValues.map(value => ({
        value: String(value),
        label: `${value} hp`
      }));
    } else {
      return kwValues.map(value => ({
        value: String(value),
        label: `${value} kW`
      }));
    }
  };

  const handlePowerUnitChange = (newUnit) => {
    if (newUnit === powerUnit) return;

    // Convert powerFrom if it exists
    if (powerFrom) {
      const fromValue = parseInt(powerFrom, 10);
      if (newUnit === 'kw') {
        // Convert hp to kW
        setPowerFrom(String(Math.round(fromValue * 0.7457)));
      } else {
        // Convert kW to hp
        setPowerFrom(String(Math.round(fromValue / 0.7457)));
      }
    }

    // Convert powerTo if it exists
    if (powerTo) {
      const toValue = parseInt(powerTo, 10);
      if (newUnit === 'kw') {
        // Convert hp to kW
        setPowerTo(String(Math.round(toValue * 0.7457)));
      } else {
        // Convert kW to hp
        setPowerTo(String(Math.round(toValue / 0.7457)));
      }
    }

    // Update the power unit
    setPowerUnit(newUnit);
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
          <VStack spacing={6} align="stretch">
            <Category title="MAKE AND MODEL">
              <Box>
                <Button
                  onClick={() => setIsMakeModelOpen(true)}
                  w="full"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  px={4}
                  py={2.5}
                  borderWidth="2px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  color="red.500"
                  _hover={{ bg: "red.50" }}
                  transition="colors 0.2s"
                  variant="unstyled"
                  h="auto"
                >
                  <Flex align="center">
                    <LucideIcon icon={Plus} boxSize="5" mr="2" strokeWidth={2.5} />
                    <Text fontWeight="medium">Add a car</Text>
                  </Flex>
                  <LucideIcon icon={ChevronDown} boxSize="5" strokeWidth={2.5} />
                </Button>

                {/* Show selected make/model filters */}
                <MakeModelSelection
                  selectedFilters={makeModelFilters}
                  onRemoveFilter={(filterId) => {
                    setMakeModelFilters(prev => prev.filter(f => f.id !== filterId));
                  }}
                />

                {/* Popup */}
                <MakeModelPopup
                  isOpen={isMakeModelOpen}
                  onClose={() => setIsMakeModelOpen(false)}
                  selectedFilters={makeModelFilters}
                  onSelect={(selected) => {
                    setMakeModelFilters(prev => {
                      // Combine existing filters with new ones, removing duplicates
                      const combined = [...prev];
                      selected.forEach(filter => {
                        if (!combined.some(f => f.id === filter.id)) {
                          combined.push(filter);
                        }
                      });
                      return combined;
                    });
                  }}
                />
              </Box>
            </Category>

            {/* Price Section */}
            <Category
              title="PRICE (€)"
              badge={priceFrom || priceTo ? '1' : null}
            >
              <Box>
                <Flex justify="flex-end" align="center" mb={3}>
                  <Flex shadow="sm">
                    <Button
                      onClick={() => setPriceType('instalments')}
                      px={4}
                      py={1.5}
                      fontSize="sm"
                      fontWeight="medium"
                      transition="colors 0.2s"
                      borderRadius="l-lg"
                      borderRightRadius="0"
                      bg={priceType === 'instalments' ? "red.400" : "gray.100"}
                      color={priceType === 'instalments' ? "white" : "gray.600"}
                      _hover={priceType !== 'instalments' ? { bg: "gray.200" } : {}}
                    >
                      Instalments
                    </Button>
                    <Button
                      onClick={() => setPriceType('cash')}
                      px={4}
                      py={1.5}
                      fontSize="sm"
                      fontWeight="medium"
                      transition="colors 0.2s"
                      borderRadius="r-lg"
                      borderLeftRadius="0"
                      bg={priceType === 'cash' ? "red.400" : "gray.100"}
                      color={priceType === 'cash' ? "white" : "gray.600"}
                      _hover={priceType !== 'cash' ? { bg: "gray.200" } : {}}
                    >
                      Cash
                    </Button>
                  </Flex>
                </Flex>

                <Flex gap={2}>
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
                </Flex>
              </Box>
              {/* Checkboxes */}
              <VStack spacing={3} align="stretch" pt={4}>
                <Checkbox
                  isChecked={vatDeduction}
                  onChange={(e) => setVatDeduction(e.target.checked)}
                  colorScheme="red"
                  size="md"
                >
                  VAT deduction
                </Checkbox>
              </VStack>
            </Category>

            {/* Registration Section */}
            <Category
              title="REGISTRATION"
              badge={registrationFrom || registrationTo ? '1' : null}
            >
              <Flex gap={2}>
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
              </Flex>
            </Category>

            {/* Mileage Section */}
            <Category
              title="MILEAGE"
              badge={mileageFrom || mileageTo ? '1' : null}
            >
              <Flex gap={2}>
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
              </Flex>
            </Category>

            {/* Transmission Section */}
            <Category
              title="TRANSMISSION"
              badge={transmission ? '1' : null}
            >
              <ToggleButton
                options={['Automatic', 'Manual']}
                value={transmission}
                onChange={setTransmission}
              />
            </Category>

            <Category
              title="FUEL"
              badge={selectedFuels.length > 0 ? selectedFuels.length : null}
            >
              <MultiSelect
                selected={selectedFuels}
                onChange={(newSelected) => {
                  setSelectedFuels(newSelected);
                }}
                options={fuelData.types}
                displayOrder={fuelData.displayOrder}
                placeholder="Select fuel types"
              />
            </Category>

            {/* Electric & Hybrid Section */}
            <Category
              title="ELECTRIC & HYBRID"
              badge={(isElectricVehicle || hybridType) ? '1' : null}
            >
              <Box bg="red.50" p={4} borderRadius="lg">
                <VStack spacing={4} align="stretch">
                  <Checkbox
                    isChecked={isElectricVehicle}
                    onChange={(e) => setIsElectricVehicle(e.target.checked)}
                    colorScheme="red"
                    size="md"
                  >
                    Electric vehicles
                  </Checkbox>

                  <Box>
                    <Heading as="h3" fontSize="sm" fontWeight="bold" color="#1a1a1a" mb={2}>
                      HYBRID TYPE
                    </Heading>
                    <Flex w="full" borderRadius="lg" borderWidth="2px" borderColor="gray.200" overflow="hidden">
                      <Button
                        onClick={() => setHybridType('plug-in')}
                        flex="1"
                        py={2.5}
                        fontSize="sm"
                        fontWeight="medium"
                        transition="colors 0.2s"
                        bg={hybridType === 'plug-in' ? "red.400" : "white"}
                        color={hybridType === 'plug-in' ? "white" : "gray.700"}
                        _hover={hybridType !== 'plug-in' ? { bg: "gray.50" } : {}}
                        borderRadius="0"
                        variant="unstyled"
                        h="auto"
                      >
                        Plug-in hybrid
                      </Button>
                      <Box w="1px" bg="gray.200" />
                      <Button
                        onClick={() => setHybridType('full')}
                        flex="1"
                        py={2.5}
                        fontSize="sm"
                        fontWeight="medium"
                        transition="colors 0.2s"
                        bg={hybridType === 'full' ? "red.400" : "white"}
                        color={hybridType === 'full' ? "white" : "gray.700"}
                        _hover={hybridType !== 'full' ? { bg: "gray.50" } : {}}
                        borderRadius="0"
                        variant="unstyled"
                        h="auto"
                      >
                        Full hybrid
                      </Button>
                    </Flex>
                  </Box>
                </VStack>
              </Box>
            </Category>

            <Category
              title="POWER"
              badge={powerFrom || powerTo ? '1' : null}
            >
              <Flex justify="flex-end" mb={3}>
                <PowerUnitToggle
                  value={powerUnit}
                  onChange={handlePowerUnitChange}
                />
              </Flex>
              <Flex gap={2}>
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
              </Flex>
            </Category>

            <Category
              title="VEHICLE TYPE"
              badge={selectedVehicleTypes.length ? selectedVehicleTypes.length : null}
            >
              <MultiSelect
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

              <Box mt={4}>
                <CustomCheckbox
                  label="Drive type 4x4"
                  checked={is4x4}
                  onChange={(e) => setIs4x4(e.target.checked)}
                />
              </Box>
            </Category>

            <Category
              title="EXTERIOR COLOR"
              badge={selectedColors.length ? selectedColors.length : null}
            >
              <MultiColorSelector
                selectedColors={selectedColors}
                onColorSelect={setSelectedColors}
              />
            </Category>

            <Category
              title="FEATURES"
              badge={selectedFeatures.length ? selectedFeatures.length : null}
            >
              <FeaturesSection />
              <Button
                color="red.400"
                _hover={{ color: "red.500" }}
                fontWeight="medium"
                fontSize="sm"
                mt={4}
                rightIcon={<LucideIcon icon={ChevronRight} boxSize="4" />}
                variant="unstyled"
                display="flex"
                alignItems="center"
                height="auto"
              >
                More features
              </Button>
            </Category>

            <VStack spacing={2} pt={2}>
              <Button
                w="full"
                py={2.5}
                color="red.400"
                _hover={{ bg: "red.50" }}
                borderWidth="2px"
                borderColor="red.400"
                borderRadius="lg"
                fontWeight="medium"
                transition="colors 0.2s"
                variant="outline"
              >
                Detailed search
              </Button>
            </VStack>
          </VStack>
        );

      case 'saved':
        return (
          <Box py={8} textAlign="center">
            <LucideIcon icon={Bookmark} boxSize="12" mx="auto" mb={4} color="gray.400" />
            <Text color="gray.500">Your saved filters will appear here</Text>
          </Box>
        );

      case 'history':
        return (
          <Box py={8} textAlign="center">
            <LucideIcon icon={Clock} boxSize="12" mx="auto" mb={4} color="gray.400" />
            <Text color="gray.500">Your search history will appear here</Text>
          </Box>
        );
      default:
        return null;
    }
  };

  // Function to close mobile sidebar
  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  // Main content component to avoid repetition
  const FilterContent = () => (
    <Box p={6} bg="white" h="full" overflowY="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="#1a1a1a">Filter</Heading>
        <HStack spacing={2}>
          {hasFilters && (
            <IconButton
              onClick={resetFilters}
              aria-label="Reset filters"
              icon={<LucideIcon icon={Trash2} boxSize="5" />}
              color="gray.500"
              _hover={{ color: "gray.700" }}
              variant="ghost"
            />
          )}
          <IconButton
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            icon={<LucideIcon icon={X} boxSize="6" />}
            color="gray.500"
            _hover={{ color: "gray.700" }}
            variant="ghost"
            display={["flex", "flex", "none"]}
          />
        </HStack>
      </Flex>

      {/* Tabs */}
      <Flex borderBottomWidth="1px" borderColor="gray.200" mb={6} position="relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              display="flex"
              flexDirection="column"
              alignItems="center"
              mr={8}
              pb={2}
              position="relative"
              transition="colors 0.2s"
              color={isActive ? "red.400" : "gray.500"}
              _hover={!isActive ? { color: "gray.700" } : {}}
              variant="unstyled"
              h="auto"
            >
              <Box
                p={2}
                borderRadius="md"
                mb={1}
                transition="colors 0.2s"
                bg={isActive ? "red.50" : "transparent"}
              >
                <LucideIcon icon={Icon} boxSize="5" strokeWidth={2.5} />
              </Box>
              <Text fontSize="sm" fontWeight="medium">{tab.label}</Text>
              {isActive && (
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  w="full"
                  h="0.5"
                  bg="red.400"
                />
              )}
            </Button>
          );
        })}
      </Flex>

      {/* Tab Content */}
      <TabContent tabId={activeTab} />
    </Box>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <Box
          position="fixed"
          inset="0"
          bg="blackAlpha.500"
          zIndex="30"
          display={["block", "block", "none"]}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <Box
        position={["fixed", "fixed", "relative"]}
        top="0"
        bottom="0"
        left="0"
        w="full"
        maxW={["320px", "320px", "auto"]}
        zIndex="30"
        transform={isMobileOpen ? "translateX(0)" : ["translateX(-100%)", "translateX(-100%)", "none"]}
        transition="transform 0.3s ease"
      >
        {/* Desktop Card */}
        <Box
          display={["none", "none", "block"]}
          borderRadius="lg"
          boxShadow="lg"
        >
          <FilterContent />
        </Box>

        {/* Mobile Fullheight Sidebar */}
        <Box
          h="full"
          display={["block", "block", "none"]}
        >
          <FilterContent />
        </Box>
      </Box>
    </>
  );
};

export default FilterSidebar;