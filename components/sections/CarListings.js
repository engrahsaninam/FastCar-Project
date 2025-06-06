"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { usePriceRange, useMileageRange, useyearsRange, useFuelType, useTransmissionType, useBrands, useModels, useBodyTypes, useColors, useFeatures } from '@/services/cars/useCars';
import { useRouter } from 'next/navigation';
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
  useColorMode,
  useColorModeValue,
  Skeleton,
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
  Heart,
} from 'lucide-react';

// Custom icon wrapper for Chakra UI
const LucideIcon = ({ icon: Icon, ...props }) => {
  return <Box as={Icon} {...props} />;
};

const colorOptions = [
  { id: 'Black', value: '#000000', label: 'Black' },
  { id: 'White', value: '#FFFFFF', label: 'White', border: true },
  { id: 'Grey', value: '#64748B', label: 'Gray Blue' },
  { id: 'Red', value: '#EF4444', label: 'Red' },
  { id: 'Blue', value: '#3B82F6', label: 'Blue' },
  { id: 'Silver', value: '#E2E8F0', label: 'Silver', border: true },
  { id: 'Green', value: '#22C55E', label: 'Green' },
  { id: 'Beige', value: '#E3D3C3', label: 'Beige', border: true },
  { id: 'Yellow', value: '#FBBF24', label: 'Yellow' },
  { id: 'Orange', value: '#F97316', label: 'Orange' },
  { id: 'Brown', value: '#92400E', label: 'Brown' },
  { id: 'Gold', value: '#EAB308', label: 'Gold' },
  { id: 'Purple', value: '#7C3AED', label: 'Purple' }
];

const MultiColorSelector = ({ selectedColors, onColorSelect }) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const checkColor = useColorModeValue("white", "white");
  const darkCheckColor = useColorModeValue("gray.900", "gray.900");
  const boxShadowColor = useColorModeValue(
    "0 0 0 2px #FEB2B2, 0 0 0 4px white",
    "0 0 0 2px #FEB2B2, 0 0 0 4px #1e2934"
  );

  const toggleColor = (colorId) => {
    if (selectedColors.includes(colorId)) {
      onColorSelect(selectedColors.filter(id => id !== colorId));
    } else {
      onColorSelect([...selectedColors, colorId]);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}></Flex>
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
            borderColor={borderColor}
            bg={color.value}
            _hover={{ transform: "scale(1.1)" }}
            _focus={{
              outline: "none",
              boxShadow: boxShadowColor
            }}
            onClick={() => toggleColor(color.id)}
            aria-label={color.label}
            title={color.label}
            {...(selectedColors.includes(color.id) && {
              transform: "scale(1.1)",
              boxShadow: boxShadowColor
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
                color={color.id === 'white' || color.id === 'yellow' ? darkCheckColor : checkColor}
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

  // Color mode values
  const bgColor = useColorModeValue("white", "#2B2020FF");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgSelected = useColorModeValue("red.50", "rgba(254, 178, 178, 0.12)");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const optionTextColor = useColorModeValue("gray.700", "gray.300");
  const selectedOptionTextColor = useColorModeValue("red.400", "red.300");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const scrollTrackBg = useColorModeValue("gray.50", "gray.700");
  const scrollThumbBg = useColorModeValue("gray.300", "gray.600");

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
    <Box position="relative" flex="1" ref={selectRef} className="custom-select">
      <Flex
        onClick={onToggle}
        align="center"
        justify="space-between"
        px={3}
        py={2}
        bg={bgColor}
        borderWidth="1px"
        borderRadius="md"
        transition="all 0.2s"
        cursor="pointer"
        borderColor={borderColor}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        sx={{
          // Force these styles to have higher specificity to override Bootstrap
          borderWidth: '1px !important',
          borderStyle: 'solid !important',
          borderRadius: 'var(--chakra-radii-md) !important',
          padding: '0.5rem 0.75rem !important',
          height: '38px !important',
          '&:focus': {
            borderColor: 'var(--chakra-colors-gray-200) !important',
            boxShadow: 'none !important'
          },
          // Ensure there are no other styles overriding the border
          '&': {
            outline: 'none !important'
          }
        }}
      >
        <Flex align="center" flex="1">
          <Text
            color={textColor}
            fontWeight="normal"
            fontSize="sm"
            sx={{
              fontSize: 'var(--chakra-fontSizes-sm) !important',
              color: `${textColor} !important`
            }}
          >
            {value ? (options.find(opt => opt.value === value)?.label || value) : placeholder}
          </Text>
        </Flex>
        <Box
          as={ChevronDown}
          boxSize="4"
          color={iconColor}
          transition="transform 0.2s"
          transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
          strokeWidth={2}
          sx={{
            width: '1rem !important',
            height: '1rem !important'
          }}
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
              position="absolute"
              top={`${dropdownPosition.top}px`}
              left={`${dropdownPosition.left}px`}
              width={`${dropdownPosition.width}px`}
              zIndex={1600}
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              boxShadow="sm"
              maxH="240px"
              overflowY="auto"
              sx={{
                // Ensure dropdown border is visible too
                borderWidth: '1px !important',
                borderStyle: 'solid !important',
                borderRadius: 'var(--chakra-radii-md) !important',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  bg: scrollTrackBg,
                },
                '&::-webkit-scrollbar-thumb': {
                  bg: scrollThumbBg,
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
                    px="3"
                    py="1.5"
                    textAlign="left"
                    _hover={{ bg: hoverBgColor }}
                    cursor="pointer"
                    color={value === option.value ? selectedOptionTextColor : optionTextColor}
                    bg={value === option.value ? bgSelected : "transparent"}
                    fontWeight={value === option.value ? "medium" : "normal"}
                    sx={{
                      padding: '0.375rem 0.75rem !important'
                    }}
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
  const bgColor = useColorModeValue("white", "#2B2020FF");
  const borderColor = useColorModeValue(
    checked ? "red.500" : "gray.400",
    checked ? "red.500" : "gray.500"
  );
  const textColor = useColorModeValue("gray.700", "gray.300");
  const hoverTextColor = useColorModeValue("gray.900", "white");
  const checkedBgColor = useColorModeValue("red.500", "red.500");

  return (
    <Flex
      as="label"
      align="center"
      cursor="pointer"
      _hover={{ "span": { color: hoverTextColor } }}
      py={0.5}  // Added small vertical padding
    >
      <Box position="relative" display="flex" alignItems="center">
        <Box
          as="input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          h="4"  // Reduced from 5
          w="4"  // Reduced from 5
          borderWidth="1.5px"  // Reduced from 2px
          borderColor={borderColor}
          borderRadius="sm"
          appearance="none"
          transition="colors 0.2s"
          _hover={{ borderColor: "red.400" }}
          _checked={{ bg: checkedBgColor, borderColor: checkedBgColor }}
          position="relative"
          zIndex="1"
          outline="none"
          visibility="visible"
          opacity="1"
          display="inline-flex"
          bg={checked ? checkedBgColor : bgColor}
          sx={{
            '&:checked': {
              backgroundColor: 'var(--chakra-colors-red-500)',
              borderColor: 'var(--chakra-colors-red-500)'
            }
          }}
        />
        {checked && (
          <Box
            as="svg"
            position="absolute"
            inset="0"
            m="auto"
            w="3"  // Reduced from 4
            h="3"  // Reduced from 4
            pointerEvents="none"
            color="white"
            zIndex="2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </Box>
        )}
      </Box>
      <Text ml={1.5} fontSize="sm" color={textColor}>
        {label}
      </Text>
    </Flex>
  );
};

const ToggleButton = ({ options, value, onChange }) => {
  const buttonBg = useColorModeValue("white", "#2B2020FF");
  const activeBg = useColorModeValue("red.400", "red.500");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const activeTextColor = useColorModeValue("white", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Flex w="full" borderRadius="lg" overflow="hidden">
      {options.map((option, index) => (
        <Button
          key={option}
          onClick={() => onChange(option)}
          flex="1"
          py="1.5"  // Reduced from 2.5
          fontSize="xs"  // Reduced from sm
          fontWeight="medium"
          bg={value === option ? activeBg : buttonBg}
          color={value === option ? activeTextColor : textColor}
          _hover={value !== option ? { bg: hoverBg } : {}}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="0"
          borderLeftRadius={index === 0 ? "lg" : "0"}
          borderRightRadius={index === options.length - 1 ? "lg" : "0"}
          transition="colors 0.2s"
          height="36px"  // Reduced from 42px
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

  // Color mode values
  const bgColor = useColorModeValue("white", "#2B2020FF");
  const borderColor = useColorModeValue(
    selected.length > 0 ? "red.300" : "gray.200",
    selected.length > 0 ? "red.400" : "gray.600"
  );
  const textColor = useColorModeValue("gray.500", "gray.400");
  const chipBg = useColorModeValue("red.100", "rgba(254, 178, 178, 0.25)");
  const chipTextColor = useColorModeValue("red.400", "red.300");
  const iconColor = useColorModeValue(
    selected.length > 0 ? "red.400" : "gray.400",
    selected.length > 0 ? "red.300" : "gray.500"
  );
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const optionTextColor = useColorModeValue("gray.700", "gray.300");
  const headingColor = useColorModeValue("#1a1a1a", "white");
  const scrollTrackBg = useColorModeValue("gray.50", "gray.700");
  const scrollThumbBg = useColorModeValue("gray.300", "gray.600");

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
      return <Text color={textColor}>{placeholder}</Text>;
    }

    return (
      <Flex align="center" gap="1" flexWrap="wrap">
        {sortedSelected.map((value) => (
          <Box
            key={value.id}
            bg={chipBg}
            px={3}
            py={1}
            borderRadius="md"
            display="flex"
            alignItems="center"
          >
            <Text color={chipTextColor} fontSize="sm" fontWeight="medium">{value.label}</Text>
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
    <Box className="multi-select-wrapper">
      <Flex justify="space-between" align="center" mb={3}>
        <Heading as="h2" fontSize="sm" fontWeight="bold" color={headingColor}>{title}</Heading>
      </Flex>
      <Box position="relative" w="full" ref={selectRef}>
        <Flex
          onClick={onToggle}
          align="center"
          justify="space-between"
          px={4}
          py={2}
          bg={bgColor}
          borderWidth="2px"
          borderRadius="lg"
          transition="all 0.2s"
          cursor="pointer"
          borderColor={borderColor}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={0}
          sx={{
            // Force these styles to have higher specificity to override Bootstrap
            borderWidth: '2px !important',
            borderStyle: 'solid !important',
            '&:focus': {
              borderColor: selected.length > 0 ? 'var(--chakra-colors-red-300) !important' : 'var(--chakra-colors-gray-200) !important',
              boxShadow: 'none !important'
            },
            '&': {
              outline: 'none !important'
            }
          }}
        >
          <Box flex="1" overflow="hidden">
            {renderSelectedValues()}
          </Box>
          <Box
            as={ChevronDown}
            boxSize="5"
            ml={2}
            color={iconColor}
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
                bg={bgColor}
                borderWidth="2px"
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="xl"
                maxH="240px"
                overflowY="auto"
                role="listbox"
                sx={{
                  // Ensure dropdown border is visible
                  borderWidth: '2px !important',
                  borderStyle: 'solid !important',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    bg: scrollTrackBg,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bg: scrollThumbBg,
                    borderRadius: 'full',
                  },
                }}
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
                        _hover={{ bg: hoverBg }}
                        cursor="pointer"
                        role="option"
                        aria-selected={checked}
                        onClick={() => handleSelect(option)}
                      >
                        <CustomCheckbox
                          label=""
                          checked={checked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelect(option);
                          }}
                        />
                        <Text color={optionTextColor} ml={2}>{option.label}</Text>
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

// Wrap the component with Suspense for useSearchParams
const FilterSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  return (
    <Suspense >
      <div
        style={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px !important",
          width: "100% !important",
          height: "100% !important"
        }}
        className="force-shadow"
      >
        <FilterSidebarWithParams
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>
    </Suspense>
  );
};

const FilterSidebarWithParams = ({ isMobileOpen, setIsMobileOpen }) => {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const { data: priceRangeData, isLoading: isPriceRangeLoading } = usePriceRange();
  const { data: mileageRangeData, isLoading: isMileageRangeLoading } = useMileageRange();
  const { data: yearsRangeData, isLoading: isYearsRangeLoading } = useyearsRange();
  const { data: fuelTypeData, isLoading: isFuelTypeLoading } = useFuelType();
  const { data: transmissionTypeData, isLoading: isTransmissionTypeLoading } = useTransmissionType();
  const { data: bodyTypesData, isLoading: isBodyTypesLoading } = useBodyTypes();
  const { data: colorsData, isLoading: isColorsLoading } = useColors();
  const { data: featuresData, isLoading: isFeaturesLoading } = useFeatures();

  // Color mode values
  const bgColor = useColorModeValue("white", "#261919FF");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const headingColor = useColorModeValue("#1a1a1a", "white");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("red.400", "red.300");
  const accentColorDark = useColorModeValue("red.500", "red.400");
  const accentBgLight = useColorModeValue("red.50", "rgba(254, 178, 178, 0.12)");
  const accentBgMedium = useColorModeValue("red.100", "rgba(254, 178, 178, 0.25)");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const inputBgColor = useColorModeValue("white", "#2B2020FF");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const toggleBgInactive = useColorModeValue("gray.100", "gray.700");
  const toggleTextInactive = useColorModeValue("gray.600", "gray.400");

  // Generate fuel type options based on API data
  const fuelOptions = useMemo(() => {
    if (!fuelTypeData) return [];

    return fuelTypeData.filter(Boolean).map(fuel => ({
      id: fuel.toLowerCase().replace(/\s+/g, '-'),
      value: fuel,
      label: fuel

    }));
  }, [fuelTypeData]);

  // Get display order from API data if available, otherwise use default order
  const fuelDisplayOrder = useMemo(() => {
    if (!fuelTypeData) return [];
    return fuelTypeData.filter(Boolean).map(fuel => fuel.toLowerCase().replace(/\s+/g, '-'));
  }, [fuelTypeData]);

  // Generate price options based on API data
  const priceOptions = useMemo(() => {
    if (!priceRangeData) return [];

    const { min_price, max_price } = priceRangeData;
    const step = Math.ceil((max_price - min_price) / 20); // Create 20 steps

    return Array.from(
      { length: 21 },
      (_, i) => ({
        value: String(min_price + (i * step)),
        label: `${(min_price + (i * step)).toLocaleString()} €`
      })
    );
  }, [priceRangeData]);

  // Generate mileage options based on API data
  const mileageOptions = useMemo(() => {
    if (!mileageRangeData) return [];

    const { min_mileage, max_mileage } = mileageRangeData;
    const step = Math.ceil((max_mileage - min_mileage) / 20); // Create 20 steps

    return Array.from(
      { length: 21 },
      (_, i) => ({
        value: String(min_mileage + (i * step)),
        label: `${(min_mileage + (i * step)).toLocaleString()} km`
      })
    );
  }, [mileageRangeData]);

  // Generate registration year options based on API data
  const registrationYears = useMemo(() => {
    if (!yearsRangeData) return [];

    const { min_year, max_year } = yearsRangeData;
    return Array.from(
      { length: max_year - min_year + 1 },
      (_, i) => ({
        value: String(max_year - i),
        label: String(max_year - i)
      })
    );
  }, [yearsRangeData]);

  // Generate transmission options based on API data
  const transmissionOptions = useMemo(() => {
    if (!transmissionTypeData) return [];

    return transmissionTypeData.filter(Boolean).map(type => ({
      id: type.toLowerCase().replace(/\s+/g, '-'),
      value: type,
      label: type
    }));
  }, [transmissionTypeData]);

  // All your existing state declarations that use searchParams
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [priceType, setPriceType] = useState(searchParams.get('priceType') || 'cash');
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [min_price, setMin_price] = useState(searchParams.get('min_price') || '');
  const [max_price, setMax_price] = useState(searchParams.get('max_price') || '');
  const [min_year, setMin_year] = useState(searchParams.get('min_year') || '');
  const [max_year, setMax_year] = useState(searchParams.get('max_year') || '');
  const [min_mileage, setMin_mileage] = useState(searchParams.get('min_mileage') || '');
  const [max_mileage, setMax_mileage] = useState(searchParams.get('max_mileage') || '');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '');
  const [vatDeduction, setVatDeduction] = useState(searchParams.get('vat') === 'true');
  const [discountedCars, setDiscountedCars] = useState(searchParams.get('discounted') === 'true');
  const [isElectricVehicle, setIsElectricVehicle] = useState(searchParams.get('electric') === 'true');
  const [hybridType, setHybridType] = useState(searchParams.get('hybridType') || '');
  const [powerUnit, setPowerUnit] = useState(searchParams.get('powerUnit') || 'hp');
  const [powerFrom, setPowerFrom] = useState(searchParams.get('powerFrom') || '');
  const [powerTo, setPowerTo] = useState(searchParams.get('powerTo') || '');
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState(() => {
    const types = searchParams.get('body_type')?.split(',').filter(Boolean) || [];
    return types;
  });
  const [is4x4, setIs4x4] = useState(searchParams.get('is4x4') === 'true');
  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    const featuresParam = searchParams.get('features')?.split(',').filter(Boolean) || [];
    return featuresParam;
  });
  const [selectedColours, setSelectedColours] = useState(() => {
    const colourParam = searchParams.get('colour')?.split(',').filter(Boolean) || [];
    return colourParam;
  });
  const [selectedFuels, setSelectedFuels] = useState(() => {
    const fuelParam = searchParams.get('fuel')?.split(',').filter(Boolean) || [];
    return fuelParam.map(fuelValue => {
      const fuelType = fuelData.types.find(f => f.value === fuelValue);
      return fuelType || null;
    }).filter(Boolean);
  });
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

  // Generate body type options based on API data
  const bodyTypeOptions = useMemo(() => {
    if (!bodyTypesData) return [];
    return bodyTypesData.filter(Boolean).map(type => ({
      id: type.toLowerCase().replace(/\s+/g, '-'),
      value: type,
      label: type
    }));
  }, [bodyTypesData]);

  // Generate feature options based on API data
  const featureOptions = useMemo(() => {
    if (!featuresData) return [];
    return featuresData.filter(Boolean).map(feature => ({
      id: feature.toLowerCase().replace(/\s+/g, '-'),
      value: feature,
      label: feature
    }));
  }, [featuresData]);

  // Continuing from where we left off

  useEffect(() => {
    const params = new URLSearchParams();

    // Add tab to URL if it's not 'all'
    if (activeTab !== 'all') params.set('tab', activeTab);

    // Only add parameters if they have values
    if (priceType !== 'cash') params.set('priceType', priceType);
    if (min_price) params.set('min_price', min_price);
    if (max_price) params.set('max_price', max_price);
    if (min_year) params.set('min_year', min_year);
    if (max_year) params.set('max_year', max_year);
    if (min_mileage) params.set('min_mileage', min_mileage);
    if (max_mileage) params.set('max_mileage', max_mileage);
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
    if (selectedVehicleTypes.length > 0) params.set('body_type', selectedVehicleTypes.join(','));
    if (selectedColours.length > 0) params.set('colour', selectedColours.join(','));
    if (is4x4) params.set('is4x4', 'true');

    if (makeModelFilters.length > 0) {
      makeModelFilters.forEach(filter => {
        if (filter.brand) params.append('brand', filter.brand);
        if (filter.model) params.append('model', filter.model);
      });
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
    min_price,
    max_price,
    min_year,
    max_year,
    min_mileage,
    max_mileage,
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
    selectedColours,
    is4x4,
    selectedFeatures,
    makeModelFilters,
    router
  ]);

  // hasFilters check
  const hasFilters = Boolean(
    min_price ||
    max_price ||
    min_year ||
    max_year ||
    min_mileage ||
    max_mileage ||
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
    selectedColours.length > 0 ||
    selectedFeatures.length > 0 ||
    makeModelFilters.length > 0
  );

  // Reset filters
  const resetFilters = () => {
    setMin_price('');
    setMax_price('');
    setMin_year('');
    setMax_year('');
    setMin_mileage('');
    setMax_mileage('');
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
    setSelectedColours([]);
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
            bg={accentBgLight}
            px={3}
            py={1.5}
            borderRadius="lg"
            fontSize="sm"
          >
            <Text fontWeight="medium" color={accentColor}>
              {filter.brand} {filter.model ? filter.model : ''}
            </Text>
            <Box
              as="button"
              color={accentColor}
              _hover={{ color: accentColorDark }}
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

    // Fetch brands and models from API
    const { data: brandsData, isLoading: isBrandsLoading } = useBrands();
    const { data: modelsData, isLoading: isModelsLoading } = useModels(selectedMake?.id || '');

    // Filter brands based on search term
    const filteredBrands = useMemo(() => {
      if (!brandsData) return [];
      return brandsData
        .filter(brand => brand.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(brand => ({
          id: brand,
          value: brand,
          label: brand,
        }));
    }, [brandsData, searchTerm]);

    // Filter models based on search term
    const filteredModels = useMemo(() => {
      if (!modelsData) return [];
      // Ensure modelsData is treated as an array
      const modelsArray = Array.isArray(modelsData) ? modelsData : [modelsData];
      return modelsArray
        .filter(model => model.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(model => ({
          id: model,
          value: model,
          label: model,
        }));
    }, [modelsData, searchTerm]);

    // Modal colors
    const modalBg = useColorModeValue("white", "#22303f");
    const modalHeaderBg = useColorModeValue("white", "#22303f");
    const headerBorderColor = useColorModeValue("gray.200", "gray.600");
    const inputBg = useColorModeValue("white", "#2B2020FF");
    const inputBorderColor = useColorModeValue("gray.200", "gray.600");
    const labelColor = useColorModeValue("gray.500", "gray.400");
    const buttonBg = useColorModeValue("white", "#2B2020FF");
    const buttonBorderColor = useColorModeValue("gray.200", "gray.600");
    const buttonHoverBg = useColorModeValue("red.50", "rgba(254, 178, 178, 0.12)");
    const buttonHoverBorderColor = useColorModeValue("red.300", "red.400");
    const footerBg = useColorModeValue("gray.50", "#1e2934");
    const applyBtnDisabledBg = useColorModeValue("gray.100", "gray.700");
    const applyBtnDisabledColor = useColorModeValue("gray.400", "gray.500");
    const iconColor = useColorModeValue("gray.400", "gray.500");
    const activeIconColor = useColorModeValue("red.400", "red.300");

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
          bg={modalBg}
        >
          {/* Header */}
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth="1px"
            borderBottomColor={headerBorderColor}
            bg={modalHeaderBg}
          >
            <Heading size="md" fontWeight="semibold" color={headingColor}>
              {selectedMake ? `Select ${selectedMake.label} Model` : 'Select Make'}
            </Heading>
            <ModalCloseButton position="static" color={textColor} />
          </ModalHeader>

          {/* Search */}
          <Box p={4} borderBottomWidth="1px" borderBottomColor={headerBorderColor}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <LucideIcon icon={Search} color={iconColor} boxSize="5" />
              </InputLeftElement>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={selectedMake ? "Search models..." : "Search makes..."}
                borderWidth="2px"
                borderColor={inputBorderColor}
                borderRadius="lg"
                _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px var(--chakra-colors-red-200)" }}
                bg={inputBg}
                color={textColor}
                pl="10"
              />
            </InputGroup>
          </Box>

          {/* Content - Scrollable */}
          <ModalBody overflowY="auto" bg={modalBg}>
            {!selectedMake ? (
              <VStack spacing={6} align="stretch">
                {isBrandsLoading ? (
                  <Flex gap={2}>
                    <Skeleton height="40px" flex="1" />
                    <Skeleton height="40px" flex="1" />
                  </Flex>
                ) : (
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {filteredBrands.map(brand => (
                      <Button
                        key={brand.id}
                        onClick={() => handleMakeSelect(brand)}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={3}
                        textAlign="left"
                        borderWidth="2px"
                        borderColor={buttonBorderColor}
                        borderRadius="lg"
                        bg={buttonBg}
                        _hover={{ borderColor: buttonHoverBorderColor, bg: buttonHoverBg }}
                        transition="all 0.2s"
                        h="auto"
                        w="full"
                        variant="unstyled"
                      >
                        <Text fontWeight="medium" color={textColor}>{brand.label}</Text>
                        <LucideIcon
                          icon={ChevronRight}
                          boxSize="5"
                          color={iconColor}
                        />
                      </Button>
                    ))}
                  </Grid>
                )}
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                {isModelsLoading ? (
                  <Flex gap={2}>
                    <Skeleton height="40px" flex="1" />
                    <Skeleton height="40px" flex="1" />
                  </Flex>
                ) : (
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {filteredModels.map(model => {
                      const isSelected = selectedModels.includes(`${selectedMake.id}-${model.id}`);
                      return (
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
                          borderColor={isSelected ? buttonHoverBorderColor : buttonBorderColor}
                          bg={isSelected ? accentBgLight : buttonBg}
                          _hover={!isSelected ? { borderColor: buttonHoverBorderColor, bg: buttonHoverBg } : {}}
                          transition="all 0.2s"
                        >
                          <Text fontWeight="medium" color={textColor}>{model.label}</Text>
                          {isSelected && (
                            <LucideIcon icon={Check} boxSize="5" color={activeIconColor} />
                          )}
                        </Button>
                      );
                    })}
                  </Grid>
                )}
              </VStack>
            )}
          </ModalBody>

          {/* Footer */}
          <ModalFooter
            bg={footerBg}
            borderTopWidth="1px"
            borderTopColor={headerBorderColor}
            borderRadius="0 0 xl xl"
          >
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
                color={textColor}
                _hover={{ color: headingColor }}
                fontWeight="medium"
              >
                {selectedMake ? 'Back' : 'Cancel'}
              </Button>
              <Button
                onClick={() => {
                  if (selectedModels.length > 0) {
                    const filters = selectedModels.map(id => {
                      const [brand, model] = id.split('-');
                      return {
                        id,
                        brand,
                        model: model === 'all' ? '' : model
                      };
                    });
                    onSelect(filters);
                    onClose();
                  }
                }}
                isDisabled={selectedModels.length === 0}
                bg={selectedModels.length > 0 ? accentColorDark : applyBtnDisabledBg}
                color={selectedModels.length > 0 ? "white" : applyBtnDisabledColor}
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

    // Category colors
    const categoryBorderColor = useColorModeValue("gray.200", "gray.600");
    const iconColor = useColorModeValue("gray.800", "gray.300");
    const badgeBg = useColorModeValue("red.100", "rgba(254, 178, 178, 0.25)");
    const badgeTextColor = useColorModeValue("red.400", "red.300");

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
      <Box
        borderBottomWidth="1px"
        borderColor={categoryBorderColor}
        _last={{ borderBottom: 0 }}
        sx={{
          // Increase bottom padding
          paddingBottom: '5px !important',  // Increased from 4px 
          borderBottomWidth: '1px !important',
          borderBottomStyle: 'solid !important',
          '&:last-of-type': {
            borderBottom: '0 !important'
          }
        }}
      >
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
          textAlign="left"
          variant="unstyled"
          _focus={{ outline: "none" }}
          _hover={{ "h2": { color: headingColor } }}
          h="auto"
          sx={{
            // Increase padding
            padding: '8px 0 !important',  // Increased from 6px
            height: 'auto !important',
            boxShadow: 'none !important',
            width: '100% !important',
            display: 'flex !important',
            justifyContent: 'space-between !important',
            alignItems: 'center !important',
            textAlign: 'left !important',
            '&:focus': {
              outline: 'none !important',
              boxShadow: 'none !important'
            }
          }}
        >
          <Flex
            align="center"
            gap={2}  // Increased from 1
            mb={1}  // Increased from 0.5
            sx={{
              display: 'flex !important',
              alignItems: 'center !important'
            }}
          >
            <Heading
              as="h2"
              fontSize="sm"  // Increased from xs
              fontWeight="bold"
              color={headingColor}
              sx={{
                fontSize: 'var(--chakra-fontSizes-sm) !important',  // Increased from xs
                fontWeight: 'bold !important',
                margin: '0 !important'
              }}
            >
              {title}
            </Heading>
            {badge && (
              <Tag
                size="sm"
                bg={badgeBg}
                color={badgeTextColor}
                fontWeight="semibold"
                borderRadius="md"
                sx={{
                  fontWeight: 'semibold !important',
                  borderRadius: 'var(--chakra-radii-md) !important',
                  padding: '0.2rem 0.4rem !important'  // Increased padding
                }}
              >
                <TagLabel>{badge}</TagLabel>
              </Tag>
            )}
          </Flex>
          <Box
            as={ChevronDown}
            boxSize="5"  // Increased from 4
            mb={1}  // Increased from 0.5
            color={iconColor}
            transition="transform 0.2s"
            transform={isOpen ? "rotate(180deg)" : "none"}
            sx={{
              transition: 'transform 0.2s !important',
              transform: isOpen ? 'rotate(180deg) !important' : 'none !important',
              marginBottom: '0.25rem !important',
              width: '1.25rem !important',  // Increased from 1rem
              height: '1.25rem !important'  // Increased from 1rem
            }}
          />
        </Button>

        <Collapse in={isOpen} animateOpacity>
          <Box
            mb={3}  // Increased from 2
            mt={1}  // Added top margin
            onClick={(e) => e.stopPropagation()}
            sx={{
              marginBottom: '0.75rem !important',  // Increased from 0.5rem
              marginTop: '0.25rem !important'  // Added top margin
            }}
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
    const moreBtnColor = useColorModeValue("red.600", "red.300");
    const moreBtnHoverColor = useColorModeValue("red.700", "red.200");

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
              color={moreBtnColor}
              _hover={{ color: moreBtnHoverColor }}
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
  // const PowerUnitToggle = ({ value, onChange }) => {
  //   const activeBg = useColorModeValue("red.400", "red.500");
  //   const inactiveBg = useColorModeValue("gray.100", "gray.700");
  //   const activeTextColor = "white";
  //   const inactiveTextColor = useColorModeValue("gray.600", "gray.400");
  //   const hoverBg = useColorModeValue("gray.200", "gray.600");

  //   return (
  //     <HStack spacing={1}>
  //       <Button
  //         onClick={() => onChange('hp')}
  //         size="xs"
  //         px={2}
  //         py={0.5}
  //         fontWeight="medium"
  //         borderRadius="md"
  //         bg={value === 'hp' ? activeBg : inactiveBg}
  //         color={value === 'hp' ? activeTextColor : inactiveTextColor}
  //         _hover={value !== 'hp' ? { bg: hoverBg } : {}}
  //         transition="colors 0.2s"
  //       >
  //         hp
  //       </Button>
  //       <Button
  //         onClick={() => onChange('kw')}
  //         size="xs"
  //         px={2}
  //         py={0.5}
  //         fontWeight="medium"
  //         borderRadius="md"
  //         bg={value === 'kw' ? activeBg : inactiveBg}
  //         color={value === 'kw' ? activeTextColor : inactiveTextColor}
  //         _hover={value !== 'kw' ? { bg: hoverBg } : {}}
  //         transition="colors 0.2s"
  //       >
  //         kw
  //       </Button>
  //     </HStack>
  //   );
  // };

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

  // Tabs configuration
  const tabs = [
    { id: 'all', label: 'All', icon: Sliders },
    // { id: 'saved', label: 'Favourites', icon: Heart },
    { id: 'history', label: 'History', icon: Clock },
  ];

  const TabContent = ({ tabId }) => {
    // Colors for specific elements
    const hybridBoxBg = useColorModeValue("red.50", "rgba(254, 178, 178, 0.08)");
    const buttonBorderColor = useColorModeValue("gray.200", "gray.600");
    const addCarBtnColor = useColorModeValue("red.500", "red.300");
    const addCarBtnHoverBg = useColorModeValue("red.50", "rgba(254, 178, 178, 0.12)");
    const moreFeaturesBtnColor = useColorModeValue("red.400", "red.300");
    const moreFeaturesBtnHoverColor = useColorModeValue("red.500", "red.200");
    const outlineButtonColor = useColorModeValue("red.400", "red.300");
    const outlineButtonBorderColor = useColorModeValue("red.400", "red.300");
    const outlineButtonHoverBg = useColorModeValue("red.50", "rgba(254, 178, 178, 0.12)");
    const emptyStateMsgColor = useColorModeValue("gray.500", "gray.400");
    const emptyStateIconColor = useColorModeValue("gray.400", "gray.500");

    switch (tabId) {
      case 'all':
        return (
          <VStack spacing={6} marginTop={5} align="stretch">
            <Category title="MAKE AND MODEL" defaultOpen={true}>
              <Box>
                <Button
                  onClick={() => setIsMakeModelOpen(true)}
                  w="full"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  px={3}  // Reduced from 4
                  py={2}  // Reduced from 2.5
                  borderWidth="1.5px"  // Reduced from 2px
                  borderColor={buttonBorderColor}
                  borderRadius="lg"
                  color={addCarBtnColor}
                  _hover={{ bg: addCarBtnHoverBg }}
                  transition="colors 0.2s"
                  variant="unstyled"
                  h="auto"
                  bg={bgColor}
                >
                  <Flex align="center">
                    <LucideIcon icon={Plus} boxSize="4" mr="1.5" strokeWidth={2.5} />
                    <Text fontWeight="medium" fontSize="sm">Add a car</Text>
                  </Flex>
                  <LucideIcon icon={ChevronDown} boxSize="4" strokeWidth={2.5} />
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
              badge={min_price || max_price ? '1' : null}
              defaultOpen={true}
            >
              <Box>
                {/* <Flex justify="flex-end" align="center" mb={3}>
                  <Flex shadow="sm" borderRadius="md" overflow="hidden">
                  
                  </Flex>
                </Flex> */}

                {isPriceRangeLoading ? (
                  <Flex gap={2}>
                    <Skeleton height="40px" flex="1" />
                    <Skeleton height="40px" flex="1" />
                  </Flex>
                ) : (
                  <Flex gap={2}>
                    <CustomSelect
                      value={min_price}
                      onChange={setMin_price}
                      placeholder="From"
                      options={priceOptions}
                    />
                    <CustomSelect
                      value={max_price}
                      onChange={setMax_price}
                      placeholder="To"
                      options={priceOptions}
                    />
                  </Flex>
                )}
              </Box>
              {/* <VStack spacing={3} align="stretch" pt={4}>
                <CustomCheckbox
                  label="VAT deduction"
                  checked={vatDeduction}
                  onChange={(e) => setVatDeduction(e.target.checked)}
                />
              </VStack> */}
            </Category>

            {/* Registration Section */}
            <Category
              title="REGISTRATION"
              badge={min_year || max_year ? '1' : null}
              defaultOpen={true}
            >
              {isYearsRangeLoading ? (
                <Flex gap={2}>
                  <Skeleton height="40px" flex="1" />
                  <Skeleton height="40px" flex="1" />
                </Flex>
              ) : (
                <Flex gap={2}>
                  <CustomSelect
                    value={min_year}
                    onChange={setMin_year}
                    placeholder="From"
                    options={registrationYears}
                  />
                  <CustomSelect
                    value={max_year}
                    onChange={setMax_year}
                    placeholder="To"
                    options={registrationYears}
                  />
                </Flex>
              )}
            </Category>

            {/* Mileage Section */}
            <Category
              title="MILEAGE"
              badge={min_mileage || max_mileage ? '1' : null}
              defaultOpen={true}
            >
              {isMileageRangeLoading ? (
                <Flex gap={2}>
                  <Skeleton height="40px" flex="1" />
                  <Skeleton height="40px" flex="1" />
                </Flex>
              ) : (
                <Flex gap={2}>
                  <CustomSelect
                    value={min_mileage}
                    onChange={setMin_mileage}
                    placeholder="From"
                    options={mileageOptions}
                  />
                  <CustomSelect
                    value={max_mileage}
                    onChange={setMax_mileage}
                    placeholder="To"
                    options={mileageOptions}
                  />
                </Flex>
              )}
            </Category>

            {/* Transmission Section */}
            <Category
              title="TRANSMISSION"
              badge={transmission ? '1' : null}
              defaultOpen={true}
            >
              {isTransmissionTypeLoading ? (
                <Flex gap={2}>
                  <Skeleton height="40px" flex="1" />
                </Flex>
              ) : (
                <ToggleButton
                  options={transmissionOptions.map(opt => opt.label)}
                  value={transmission}
                  onChange={setTransmission}
                />
              )}
            </Category>

            <Category
              title="FUEL"
              badge={selectedFuels.length > 0 ? selectedFuels.length : null}
              defaultOpen={true}
            >
              {isFuelTypeLoading ? (
                <Flex gap={2}>
                  <Skeleton height="40px" flex="1" />
                </Flex>
              ) : (
                <MultiSelect
                  selected={selectedFuels}
                  onChange={(newSelected) => {
                    setSelectedFuels(newSelected);
                  }}
                  options={fuelOptions}
                  displayOrder={fuelDisplayOrder}
                  placeholder="Select fuel types"
                />
              )}
            </Category>

            {/* Electric & Hybrid Section */}
            {/* <Category
              title="ELECTRIC & HYBRID"
              badge={(isElectricVehicle || hybridType) ? '1' : null}
              defaultOpen={true}
            >
              <Box bg={hybridBoxBg} p={4} borderRadius="lg">
                <VStack spacing={4} align="stretch">
                  <CustomCheckbox
                    label="Electric vehicles"
                    checked={isElectricVehicle}
                    onChange={(e) => setIsElectricVehicle(e.target.checked)}
                  />
                  <Box>
                    <Heading as="h3" fontSize="sm" fontWeight="bold" color={headingColor} mb={2}>
                      HYBRID TYPE
                    </Heading>
                    <Flex w="full" borderRadius="lg" borderWidth="2px" borderColor={buttonBorderColor} overflow="hidden">
                      <Button
                        onClick={() => setHybridType('plug-in')}
                        flex="1"
                        py={2.5}
                        fontSize="sm"
                        fontWeight="medium"
                        transition="colors 0.2s"
                        bg={hybridType === 'plug-in' ? accentColor : bgColor}
                        color={hybridType === 'plug-in' ? "white" : textColor}
                        _hover={hybridType !== 'plug-in' ? { bg: hoverBgColor } : {}}
                        borderRadius="0"
                        variant="unstyled"
                        h="auto"
                      >
                        Plug-in hybrid
                      </Button>
                      <Box w="1px" bg={borderColor} />
                      <Button
                        onClick={() => setHybridType('full')}
                        flex="1"
                        py={2.5}
                        fontSize="sm"
                        fontWeight="medium"
                        transition="colors 0.2s"
                        bg={hybridType === 'full' ? accentColor : bgColor}
                        color={hybridType === 'full' ? "white" : textColor}
                        _hover={hybridType !== 'full' ? { bg: hoverBgColor } : {}}
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
            </Category> */}

            <Category
              title="POWER"
              badge={powerFrom || powerTo ? '1' : null}
              defaultOpen={true}
            >
              {/* <Flex justify="flex-end" mb={3}>
                <PowerUnitToggle
                  value={powerUnit}
                  onChange={handlePowerUnitChange}
                />
              </Flex> */}
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
              defaultOpen={true}
            >
              {isBodyTypesLoading ? (
                <Flex gap={2}>
                  <Skeleton height="40px" flex="1" />
                  <Skeleton height="40px" flex="1" />
                </Flex>
              ) : (
                <MultiSelect
                  selected={selectedVehicleTypes.map(type => ({
                    id: type,
                    value: type,
                    label: bodyTypeOptions?.find(t => t.value === type)?.label || type
                  }))}
                  onChange={(newSelected) => {
                    setSelectedVehicleTypes(newSelected.map(s => s.value));
                  }}
                  options={bodyTypeOptions || []}
                  displayOrder={selectedVehicleTypes?.map(t => t.value) || []}
                  placeholder="All"
                />
              )}
            </Category>

            <Category
              title="EXTERIOR COLOR"
              badge={selectedColours.length ? selectedColours.length : null}
              defaultOpen={true}
            >
              {isColorsLoading ? (
                <Flex gap={2}>
                  <Skeleton height="40px" flex="1" />
                  <Skeleton height="40px" flex="1" />
                </Flex>
              ) : (
                <MultiSelect
                  selected={selectedColours.map(colour => ({
                    id: colour,
                    value: colour,
                    label: colour
                  }))}
                  onChange={(newSelected) => {
                    setSelectedColours(newSelected.map(s => s.id));
                  }}
                  options={colorOptions || []}
                  displayOrder={colorOptions?.map(c => c.id) || []}
                  placeholder="Select colours"
                />
              )}
            </Category>

            <Category
              title="FEATURES"
              badge={selectedFeatures.length ? selectedFeatures.length : null}
              defaultOpen={true}
            >
              {isFeaturesLoading ? (
                <Flex gap={2}>
                  <Skeleton height="40px" flex="1" />
                  <Skeleton height="40px" flex="1" />
                </Flex>
              ) : (
                <MultiSelect
                  selected={selectedFeatures.map(feature => ({
                    id: feature,
                    value: feature,
                    label: featureOptions?.find(f => f.value === feature)?.label || feature
                  }))}
                  onChange={(newSelected) => {
                    setSelectedFeatures(newSelected.map(s => s.value));
                  }}
                  options={featureOptions || []}
                  displayOrder={featureOptions?.map(f => f.value) || []}
                  placeholder="Select features"
                />
              )}
            </Category>

            <VStack spacing={2} pt={2}>
              <Button
                w="full"
                py={2.5}
                color={outlineButtonColor}
                _hover={{ bg: outlineButtonHoverBg }}
                borderWidth="2px"
                borderColor={outlineButtonBorderColor}
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

      // case 'saved':
      //   return (
      //     <Box py={8} textAlign="center">
      //       <LucideIcon icon={Heart} boxSize="12" mx="auto" mb={4} color={emptyStateIconColor} />
      //       <Text color={emptyStateMsgColor}>Your favourite cars will appear here</Text>
      //     </Box>
      //   );

      case 'history':
        return (
          <Box py={8} textAlign="center">
            <LucideIcon icon={Clock} boxSize="12" mx="auto" mb={4} color={emptyStateIconColor} />
            <Text color={emptyStateMsgColor}>Your search history will appear here</Text>
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

  const FilterContent = () => (
    <Box
      p={4}
      bg={bgColor}
      h="full"
      borderRadius="xl"
      overflowY="auto"
      sx={{
        padding: "1rem !important",
        background: `${bgColor} !important`,
        height: "100% !important",
        overflowY: "auto !important",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08) !important"
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        sx={{
          display: "flex !important",
          justifyContent: "space-between !important",
          alignItems: "center !important",
          marginBottom: "1rem !important"
        }}
      >
        <Heading
          as="h1"
          fontSize="xl"
          fontWeight="bold"
          color={headingColor}
          sx={{
            fontSize: "var(--chakra-fontSizes-xl) !important",
            fontWeight: "bold !important",
            color: `${headingColor} !important`,
            margin: "0 !important"
          }}
        >
          Filter
        </Heading>
        <HStack
          spacing={2}
          sx={{
            display: "flex !important",
            gap: "0.5rem !important"
          }}
        >
          {hasFilters && (
            <IconButton
              onClick={resetFilters}
              aria-label="Reset filters"
              icon={<LucideIcon icon={Trash2} boxSize="4" />}
              color={iconColor}
              _hover={{ color: textColor }}
              variant="ghost"
              size="sm"
              sx={{
                background: "transparent !important",
                padding: "0.5rem !important",
                border: "none !important",
                boxShadow: "none !important"
              }}
            />
          )}
          <IconButton
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            icon={<LucideIcon icon={X} boxSize="5" />}
            color={iconColor}
            _hover={{ color: textColor }}
            variant="ghost"
            size="sm"
            display={["flex", "flex", "none"]}
            sx={{
              background: "transparent !important",
              padding: "0.5rem !important",
              border: "none !important",
              boxShadow: "none !important",
              display: ["flex !important", "flex !important", "none !important"]
            }}
          />
        </HStack>
      </Flex>

      <Flex
        borderBottomWidth="1px"
        borderColor={borderColor}
        mb={4}
        pb={1}
        position="relative"
        sx={{
          display: "flex !important",
          borderBottomWidth: "1px !important",
          borderBottomStyle: "solid !important",
          borderBottomColor: `${borderColor} !important`,
          marginBottom: "1rem !important",
          paddingBottom: "0.25rem !important",
          position: "relative !important",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05) !important"
        }}
      >
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
              mr={5}
              pb={2}
              position="relative"
              transition="colors 0.2s"
              color={isActive ? accentColor : iconColor}
              _hover={!isActive ? { color: textColor } : {}}
              variant="unstyled"
              h="auto"
              sx={{
                display: "flex !important",
                flexDirection: "column !important",
                alignItems: "center !important",
                marginRight: "1.25rem !important",
                paddingBottom: "0.5rem !important",
                position: "relative !important",
                transition: "colors 0.2s !important",
                color: `${isActive ? accentColor : iconColor} !important`,
                background: "transparent !important",
                border: "none !important",
                outline: "none !important",
                boxShadow: "none !important",
                height: "auto !important",
                padding: "0 !important",
                "&:hover": {
                  color: `${!isActive ? textColor : accentColor} !important`,
                  background: "transparent !important"
                }
              }}
            >
              <Box
                p={1.5}
                borderRadius="md"
                mb={1}
                transition="colors 0.2s"
                bg={isActive ? accentBgLight : "transparent"}
                sx={{
                  padding: "0.375rem !important",
                  borderRadius: "var(--chakra-radii-md) !important",
                  marginBottom: "0.25rem !important",
                  transition: "colors 0.2s !important",
                  background: `${isActive ? accentBgLight : "transparent"} !important`
                }}
              >
                <LucideIcon
                  icon={Icon}
                  boxSize="5"
                  strokeWidth={2}
                  sx={{
                    width: "1.25rem !important",
                    height: "1.25rem !important",
                    strokeWidth: "2 !important"
                  }}
                />
              </Box>
              <Text
                fontSize="sm"
                fontWeight="medium"
                sx={{
                  fontSize: "var(--chakra-fontSizes-sm) !important",
                  fontWeight: "medium !important",
                  margin: "0 !important"
                }}
              >
                {tab.label}
              </Text>
              {isActive && (
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  w="full"
                  h="1"
                  bg={accentColor}
                  sx={{
                    position: "absolute !important",
                    bottom: "0 !important",
                    left: "0 !important",
                    width: "100% !important",
                    height: "2px !important",
                    background: `${accentColor} !important`,
                    boxShadow: "0 1px 2px rgba(239, 68, 68, 0.2) !important"
                  }}
                />
              )}
            </Button>
          );
        })}
      </Flex>

      <Box
        mb={3}
        sx={{
          marginBottom: "0.75rem !important"
        }}
      >
        <TabContent tabId={activeTab} />
      </Box>
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
          bg={bgColor}
        >
          <FilterContent />
        </Box>

        {/* Mobile Fullheight Sidebar */}
        <Box
          h="full"
          display={["block", "block", "none"]}
          bg={bgColor}
        >
          <FilterContent />
        </Box>
      </Box>
    </>
  );
};

export default FilterSidebar;