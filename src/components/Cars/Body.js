"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Badge,
  Skeleton,
  SkeletonText,
  HStack,
  VStack,
  Heading,
  Container,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  Link as ChakraLink,
  Select,
  AspectRatio,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import {
  Heart,
  MapPin,
  ParkingMeterIcon,
  Calendar,
  Gauge,
  Power,
  Fuel,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Bell,
} from 'lucide-react';
import Image from 'next/image';
import OptionsModal from './FinancingModal';
import SearchBar from './carSearchComponent';
import Link from 'next/link';
import { Suspense } from 'react';
import logo from '@/assets/logo.png';

// Custom Lucide icon wrapper for Chakra UI
const LucideIcon = ({ icon: Icon, ...props }) => {
  return <Box as={Icon} {...props} />;
};

// Car Card Skeleton for loading state
const CarCardSkeleton = () => {
  return (
    <Flex
      direction={["column", "column", "row"]}
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor="gray.100"
    >
      {/* Image Skeleton */}
      <Box position="relative" w={["full", "full", "250px"]}>
        <AspectRatio ratio={[16 / 9, 16 / 9, 4 / 3]} w="full">
          <Skeleton w="full" h="full" />
        </AspectRatio>
      </Box>

      {/* Content Skeleton */}
      <Flex flex="1" p="3" flexDir="column" gap="2">
        <Flex justify="space-between">
          <Skeleton height="6" width="48" borderRadius="md" />
          <Skeleton height="8" width="24" borderRadius="md" />
        </Flex>

        {/* Specs Row Skeleton */}
        <Flex flexWrap="wrap" gap="4" mb="3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height="4" width="20" borderRadius="md" />
          ))}
        </Flex>

        {/* Features Skeleton */}
        <Flex flexWrap="wrap" gap="1.5" mb="3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="5" width="24" borderRadius="md" />
          ))}
        </Flex>

        {/* Location and Price Skeleton */}
        <Flex
          mt="auto"
          justify="space-between"
          align="center"
          gap="2"
          pt="2"
          borderTopWidth="1px"
          borderColor="gray.100"
        >
          <Skeleton height="4" width="32" borderRadius="md" />
          <Skeleton height="6" width="24" borderRadius="md" />
        </Flex>
      </Flex>
    </Flex>
  );
};

// List of Car Card Skeletons
const CarListSkeleton = () => {
  return (
    <Box w="full">
      <Container maxW="7xl" px="4">
        <VStack spacing="4" mt="4" align="stretch">
          {[1, 2, 3, 4].map((i) => (
            <CarCardSkeleton key={i} />
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

// Car Card Component
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
    <Link href={`/cars/car?id=${car.id}`} passHref legacyBehavior>
      <ChakraLink display="block" _hover={{ textDecoration: 'none' }}>
        <Flex
          direction={["column", "column", "row"]}
          bg="white"
          borderRadius="lg"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.100"
          transition="all 0.2s"
          _hover={{ boxShadow: "md" }}
        >
          {/* Image Section */}
          <Box position="relative" w={["full", "full", "300px"]}>
            <AspectRatio ratio={[16 / 9, 16 / 9, 4 / 3]} w="full">
              <Box position="relative" w="full" h="full">
                {/* Heart/Favorite Button - always visible */}
                <IconButton
                  position="absolute"
                  top="2"
                  right="2"
                  zIndex="20"
                  size="sm"
                  icon={
                    <LucideIcon
                      icon={Heart}
                      boxSize="4"
                      color={isFavorite ? "red.600" : "gray.600"}
                      fill={isFavorite ? "red.600" : "none"}
                    />
                  }
                  borderRadius="full"
                  bg="white"
                  opacity="0.9"
                  _hover={{ bg: "white", opacity: "1" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFavorite(!isFavorite);
                  }}
                  aria-label="Add to favorites"
                />

                {/* Navigation Arrows - always visible for consistency */}
                <IconButton
                  position="absolute"
                  left="2"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex="10"
                  size="sm"
                  icon={<LucideIcon icon={ChevronLeft} boxSize="4" />}
                  borderRadius="full"
                  bg="white"
                  opacity="0.8"
                  _hover={{ bg: "white", opacity: "1" }}
                  onClick={(e) => {
                    e.preventDefault();
                    previousImage();
                  }}
                  aria-label="Previous image"
                />
                <IconButton
                  position="absolute"
                  right="2"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex="10"
                  size="sm"
                  icon={<LucideIcon icon={ChevronRight} boxSize="4" />}
                  borderRadius="full"
                  bg="white"
                  opacity="0.8"
                  _hover={{ bg: "white", opacity: "1" }}
                  onClick={(e) => {
                    e.preventDefault();
                    nextImage();
                  }}
                  aria-label="Next image"
                />

                <Image
                  src={car.images[currentImageIndex]}
                  alt={car.name}
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </AspectRatio>
          </Box>

          {/* Content Section */}
          <Flex flex="1" p="3" flexDir="column" gap="2">
            <Flex justify="space-between">
              <Heading
                as="h3"
                fontSize="xl"
                fontWeight="bold"
                color="red.500"
                mb="2"
                letterSpacing="wide"
                transition="colors 0.2s"
                _hover={{ color: "red.600" }}
              >
                {car.name}
              </Heading>
              <Box>
                <Image
                  src={logo.src}
                  alt="Logo"
                  width={100}
                  height={50}
                  style={{ display: "inline-block" }}
                />
              </Box>
            </Flex>

            {/* Specs Row */}
            <Flex flexWrap="wrap" gap="4" mb="3" rowGap="1.5">
              <HStack spacing="1.5">
                <LucideIcon icon={ParkingMeterIcon} boxSize="3.5" color="gray.400" />
                <Text fontSize="xs" color="gray.700">{car.mileage}</Text>
              </HStack>
              <HStack spacing="1.5">
                <LucideIcon icon={Calendar} boxSize="3.5" color="gray.400" />
                <Text fontSize="xs" color="gray.700">{car.date}</Text>
              </HStack>
              <HStack spacing="1.5">
                <LucideIcon icon={Power} boxSize="3.5" color="gray.400" />
                <Text fontSize="xs" color="gray.700">{car.power}</Text>
              </HStack>
              <HStack spacing="1.5">
                <LucideIcon icon={Gauge} boxSize="3.5" color="gray.400" />
                <Text fontSize="xs" color="gray.700">{car.transmission}</Text>
              </HStack>
              <HStack spacing="1.5">
                <LucideIcon icon={Fuel} boxSize="3.5" color="gray.400" />
                <Text fontSize="xs" color="gray.700">{car.fuelType}</Text>
              </HStack>
            </Flex>

            {/* Features */}
            <Flex flexWrap="wrap" gap="1.5" mb="3">
              {car.features.slice(0, 4).map((feature, index) => (
                <Badge
                  key={index}
                  px="2"
                  py="0.5"
                  bg="red.50"
                  color="red.400"
                  borderRadius="md"
                  fontSize="xs"
                  fontWeight="medium"
                >
                  {feature}
                </Badge>
              ))}
              {car.features.length > 4 && (
                <Button
                  variant="unstyled"
                  color="red.600"
                  fontSize="xs"
                  fontWeight="medium"
                  height="auto"
                  px="2"
                  py="0.5"
                  onClick={(e) => e.preventDefault()}
                >
                  + {car.features.length - 4} more
                </Button>
              )}
            </Flex>

            {/* Location and Price */}
            <Flex
              mt="auto"
              justify="space-between"
              align="center"
              gap="2"
              pt="2"
              borderTopWidth="1px"
              borderColor="gray.100"
            >
              <HStack spacing="1.5" color="gray.600">
                <LucideIcon icon={MapPin} boxSize="3.5" />
                <Text fontSize="xs">Germany, delivery:</Text>
                <Button
                  variant="unstyled"
                  color="red.600"
                  fontSize="xs"
                  fontWeight="medium"
                  textDecoration="underline"
                  height="auto"
                  _hover={{ color: "red.700" }}
                  onClick={(e) => e.preventDefault()}
                >
                  Enter ZIP code
                </Button>
              </HStack>

              <Box textAlign="right">
                <Text fontSize="lg" fontWeight="bold" color="gray.900">
                  €{car.price.toLocaleString()}
                </Text>
                {/* Uncomment if needed
                <Text fontSize="xs" color="gray.500">
                  €{car.priceWithoutVat?.toLocaleString()} without VAT
                </Text>
                */}
              </Box>
            </Flex>

            {/* Financing Modal */}
            <OptionsModal
              car={car}
              isOpen={isOptionsModalOpen}
              onClose={() => setIsOptionsModalOpen(false)}
            />
          </Flex>
        </Flex>
      </ChakraLink>
    </Link>
  );
};

// Car List Component
const CarList = () => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const cars = [
    {
      id: 1,
      name: "BMW Cooper 100 kW",
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
    // More cars can be added here as in the original code
  ];

  useEffect(() => {
    // Simulate API loading delay
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFilteredCars(cars);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <CarListSkeleton />;
  }

  return (
    <Suspense fallback={<CarListSkeleton />}>
 <Box w="full">
        <Box w="full" px="10px">
          <VStack spacing="4" mt="4" align="stretch">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </VStack>
        </Box>
      </Box>
    </Suspense>
  );
};

// Maps for filter display
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

// Verified Cars Header Component
const VerifiedCarsHeader = () => {
  return (
    <Box w="full" bg="transparent">
      <Flex
        flexDir="row"
        alignItems={["flex-start", "flex-start", "center"]}
        justify="space-between"
        gap="2"
        px="4"
        py="4"
      >
        {/* Title and Results Count */}
        <Box>
          <Heading as="h1" fontSize="2xl" fontWeight="bold" color="gray.900">
            Verified cars
          </Heading>
          <Text fontSize="sm" color="gray.600">
            194 475 results
          </Text>
        </Box>

        {/* Sort and Pagination */}
        <Flex alignItems="center" gap="4">
          <Select
            size="sm"
            bg="white"
            borderColor="gray.200"
            borderRadius="lg"
            px="1"
            py="2"
            fontSize="sm"
            color="gray.700"
            defaultValue="newest"
          >
            <option value="newest">Newest ad</option>
            <option value="oldest">Oldest ad</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Select>

          {/* Pagination */}
          <HStack spacing="2" display={["none", "none", "flex"]}>
            <IconButton
              aria-label="Previous page"
              icon={<LucideIcon icon={ChevronLeft} boxSize="5" />}
              variant="ghost"
              color="gray.400"
              p="2"
            />
            <Button
              w="8"
              h="8"
              borderRadius="lg"
              bg="red.400"
              color="white"
              variant="solid"
              fontSize="sm"
            >
              1
            </Button>
            <Button
              w="8"
              h="8"
              borderRadius="lg"
              variant="ghost"
              color="gray.600"
              _hover={{ bg: "gray.100" }}
              fontSize="sm"
            >
              2
            </Button>
            <Button
              w="8"
              h="8"
              borderRadius="lg"
              variant="ghost"
              color="gray.600"
              _hover={{ bg: "gray.100" }}
              fontSize="sm"
            >
              3
            </Button>
            <Button
              w="8"
              h="8"
              borderRadius="lg"
              variant="ghost"
              color="gray.600"
              _hover={{ bg: "gray.100" }}
              fontSize="sm"
            >
              4
            </Button>
            <Text px="2">...</Text>
            <Button
              w="8"
              h="8"
              borderRadius="lg"
              variant="ghost"
              color="gray.600"
              _hover={{ bg: "gray.100" }}
              fontSize="sm"
            >
              973
            </Button>
            <IconButton
              aria-label="Next page"
              icon={<LucideIcon icon={ChevronRight} boxSize="5" />}
              variant="ghost"
              color="gray.400"
              p="2"
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

// Main Body Component
const Body = ({ openMobileFilter, isFilterOpen, setIsFilterOpen }) => {
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
        if (filterId.startsWith('makeModel-')) {
          const makeModelId = filterId.replace('makeModel-', '');
          const currentMakeModels = params.get('makeModel')?.split(',') || [];
          const newMakeModels = currentMakeModels.filter(mm => mm !== makeModelId);
          if (newMakeModels.length) {
            params.set('makeModel', newMakeModels.join(','));
          } else {
            params.delete('makeModel');
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

    // Make and Model filters
    const makeModels = searchParams.get('makeModel')?.split(',') || [];
    makeModels.forEach(makeModel => {
      const [make, model] = makeModel.split('-');
      filters.push({
        id: `makeModel-${makeModel}`,
        label: model === 'all' ?
          `${make} (All Models)` :
          `${make} ${model}`
      });
    });

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

  return (
    <Box w="full">
      <Flex flexDir="column" overflow="hidden" bg={["white", "white", "transparent"]}>
        {/* Filter Bar for Mobile */}
        <Flex
          display={["flex", "flex", "none"]}
          flexDir="column"
        >
          <Flex
            flexDir="row"
            alignItems="flex-start"
            gap="2"
            p="3.5"
            overflow="hidden"
          >
            <Button
              onClick={openMobileFilter}
              display={["flex", "flex", "none"]}
              alignItems="center"
              gap="2"
              px="4"
              py="2"
              bg="red.400"
              color="white"
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: "red.500" }}
              transition="colors 0.2s"
              leftIcon={<LucideIcon icon={SlidersHorizontal} boxSize="4" />}
            >
              Filter
            </Button>

            {/* Horizontal scroll for chips */}
            <Box
              flex="1"
              overflowX="auto"
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                'scrollbarWidth': 'none',
              }}
            >
              <Flex gap="2" pb="2">
                {activeFilters.map((filter) => (
                  <Flex
                    key={filter.id}
                    flexShrink="0"
                    alignItems="center"
                    gap="2"
                    px="4"
                    py="2"
                    bg="red.100"
                    color="red.500"
                    borderRadius="md"
                    fontWeight="medium"
                    fontSize="sm"
                  >
                    {filter.label}
                    <IconButton
                      onClick={() => removeFilter(filter.id)}
                      aria-label={`Remove ${filter.label} filter`}
                      icon={<LucideIcon icon={X} boxSize="3.5" />}
                      size="xs"
                      variant="ghost"
                      color="red.400"
                      borderRadius="full"
                      _hover={{ bg: "red.200" }}
                    />
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Flex>
          <Box>
            <VerifiedCarsHeader />
            <CarList />
          </Box>
        </Flex>

        {/* Desktop Version */}
        <Flex
          display={["none", "none", "flex"]}
          flexDir="column"
          w="full"
        >
          <Flex flexWrap="wrap" alignItems="center" gap="2" mb="2">
            {/* Filter button - always visible */}
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              leftIcon={<LucideIcon icon={SlidersHorizontal} boxSize="4" />}
              bg="red.400"
              color="white"
              px="4"
              py="2"
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: "red.500" }}
              transition="colors 0.2s"
            >
              Filter
            </Button>

            <Button
              leftIcon={<LucideIcon icon={Bell} boxSize="4" />}
              bg="red.500"
              color="white"
              px="4"
              py="1.5"
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: "red.600" }}
              transition="colors 0.2s"
            >
              Save search
            </Button>

            {activeFilters.map((filter) => (
              <Flex
                key={filter.id}
                alignItems="center"
                gap="2"
                px="4"
                py="1.5"
                bg="red.100"
                color="red.400"
                borderRadius="md"
                fontWeight="medium"
                fontSize="sm"
              >
                {filter.label}
                <IconButton
                  onClick={() => removeFilter(filter.id)}
                  aria-label={`Remove ${filter.label} filter`}
                  icon={<LucideIcon icon={X} boxSize="3.5" />}
                  size="xs"
                  variant="ghost"
                  color="red.400"
                  borderRadius="full"
                  _hover={{ bg: "red.200" }}
                />
              </Flex>
            ))}
          </Flex>
          <VerifiedCarsHeader />
          <CarList />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Body;