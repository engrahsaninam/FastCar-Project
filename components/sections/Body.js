"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  useColorModeValue,
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
import Link from 'next/link';
import { Suspense } from 'react';
import logo from '@/public/assets/imgs/template/logo-d.svg';
import logoDark from '@/public/assets/imgs/template/logo-w.svg';
// Custom Lucide icon wrapper for Chakra UI
const LucideIcon = ({ icon: Icon, ...props }) => {
  return <Box as={Icon} {...props} />;
};

// Car Card Component
const CarCard = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const cardBg = useColorModeValue("white", "#1a1a1a");
  const cardBorderColor = useColorModeValue("gray.100", "#333333");
  const headingColor = useColorModeValue("black", "red.400");
  const priceColor = useColorModeValue("black", "white");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const buttonLinkColor = useColorModeValue("red.600", "red.300");
  // Fix: separate the useColorModeValue calls from the conditional logic
  const favoriteColor = useColorModeValue("red.600", "red.400");
  const nonFavoriteColor = useColorModeValue("gray.600", "gray.400");
  const heartColor = isFavorite ? favoriteColor : nonFavoriteColor;
  const heartFill = isFavorite ? favoriteColor : "none";
  const badgeBg = useColorModeValue("red.50", "rgba(255, 69, 58, 0.15)");
  const badgeColor = useColorModeValue("red.400", "red.300");
  const navBtnBg = useColorModeValue("white", "#333333");

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => prev === 0 ? car.images.length - 1 : prev - 1);
  };

  return (
    <Link href={`/car?id=${car.id}`} passHref legacyBehavior>
      <ChakraLink display="block" _hover={{ textDecoration: 'none' }}>
        <Flex
          direction={["column", "column", "row"]}
          bg={cardBg}
          borderRadius="md"
          overflow="hidden"
          borderWidth="1px"
          borderColor={cardBorderColor}
          transition="all 0.3s ease"
          _hover={{
            boxShadow: "xl",
            transform: "scale(1.02)",
            borderColor: "red.200"
          }}
          w="full"
          position="relative"
          zIndex="1"
        >
          {/* Image Section */}
          <Box position="relative" w={["full", "full", "260px"]} h={["200px", "160px", "full"]}>
            <AspectRatio ratio={[16 / 9, 16 / 9, 4 / 3]} w="full">
              <Box position="relative" w="full" h="full">
                {/* Heart/Favorite Button */}
                <IconButton
                  position="absolute"
                  top="2"
                  right="2"
                  zIndex="20"
                  size="sm"
                  icon={<LucideIcon icon={Heart} boxSize="4" color={heartColor} fill={heartFill} />}
                  borderRadius="full"
                  bg={navBtnBg}
                  opacity="0.9"
                  minW="8"
                  h="8"
                  _hover={{ bg: navBtnBg, opacity: "1" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFavorite(!isFavorite);
                  }}
                  aria-label="Add to favorites"
                />

                {/* Navigation Arrows */}
                <IconButton
                  position="absolute"
                  left="2"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex="10"
                  size="sm"
                  icon={<LucideIcon icon={ChevronLeft} boxSize="4" />}
                  borderRadius="full"
                  bg={navBtnBg}
                  opacity="0.8"
                  minW="8"
                  h="8"
                  _hover={{ bg: navBtnBg, opacity: "1" }}
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
                  bg={navBtnBg}
                  opacity="0.8"
                  minW="8"
                  h="8"
                  _hover={{ bg: navBtnBg, opacity: "1" }}
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

          {/* Content Section - maintain size but reduce spacing */}
          <Flex
            flex="1"
            p={["4", "4", "3"]}
            flexDir="column"
            justifyContent="space-between"
          // mt={["3", "3", "0"]}
          >
            <Box>
              <Flex
                direction={["row", "row", "row"]}
                justify="space-between"
                align="center"
                mb={["3", "3", "2"]}
              mt={["2", "2", "0"]}
              >
                <Heading
                  as="h3"
                  ml='1'
                  fontSize={["lg", "lg", "xl"]}
                  fontWeight="bold"
                  color={headingColor}
                  letterSpacing="wide"
                  fontFamily="inter"
                  _hover={{ color: "red.500" }}
                // mb={["1", "1", "0"]}
                >
                  {car.name}
                </Heading>
                <Box mt={["1", "1", "0"]} className='light-mode'>
                  <Image
                    src={logo.src}
                    alt="Logo"
                    width={70}
                    height={35}
                    style={{ display: "inline-block" }}
                  />
                </Box>
                <Box mt={["1", "1", "0"]} className='dark-mode'>
                  <Image
                    src={logoDark.src}
                    alt="Logo"
                    width={70}
                    height={35}
                    style={{ display: "inline-block" }}
                  />
                </Box>
              </Flex>

              {/* Specs Row - inline with minimal spacing */}
              <Box mb={["2", "2", "1"]} ml="1">
                <Flex direction="row" gap={6} mb={1}>
                  <HStack spacing="1">
                    <LucideIcon icon={Power} boxSize="4" color={textColor} />
                    <Text fontSize="sm" color={textColor}>{car.power}</Text>
                  </HStack>
                  <HStack spacing="1">
                    <LucideIcon icon={Calendar} boxSize="4" color={textColor} />
                    <Text fontSize="sm" color={textColor}>{car.date}</Text>
                  </HStack>
                  <HStack spacing="1">
                    <LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
                    <Text fontSize="sm" color={textColor}>{car.mileage}</Text>
                  </HStack>
                </Flex>
                <Flex direction="row" gap={6}>
                  <HStack spacing="1">
                    <LucideIcon icon={Gauge} boxSize="4" color={textColor} />
                    <Text fontSize="sm" color={textColor} fontWeight="semibold">{car.transmission}</Text>
                  </HStack>
                  <HStack spacing="1">
                    <LucideIcon icon={Fuel} boxSize="4" color={textColor} />
                    <Text fontSize="sm" color={textColor} fontWeight="semibold">{car.fuelType}</Text>
                  </HStack>
                </Flex>
              </Box>

              {/* Features - keeping size with less vertical space */}
              <Flex wrap="wrap" gap={["2", "2", "1.5"]} mt="0" mb={["4", "4", "0"]} ml="1">
                {car.features.slice(0, 4).map((feature, index) => (
                  <Badge
                    key={index}
                    px="2"
                    // py="0.5"
                    bg={badgeBg}
                    color={badgeColor}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="medium"
                    style={{ textTransform: "none" }}
                  >
                    {feature}
                  </Badge>
                ))}
                {car.features.length > 4 && (
                  <Button
                    variant="unstyled"
                    color={buttonLinkColor}
                    fontSize="sm"
                    fontWeight="medium"
                    height="auto"
                    padding="0"
                    lineHeight="1.5"
                    // mt="0.5"
                    _hover={{ textDecoration: "underline" }}
                    onClick={(e) => e.preventDefault()}
                    style={{ textTransform: "none" }}
                  >
                    + {car.features.length - 4} more
                  </Button>
                )}
              </Flex>
            </Box>

            {/* Location and Price - maintain size with reduced space */}
            <Box
              // pt={["3", "3", "1.5"]}
              px={["0", "0", "2"]}
              borderTopWidth="1px"
              borderColor={cardBorderColor}
            // mt={["2", "2", "1"]}
            >
              {/* Top row: Very Good Price (left) and Main Price (right) */}

              <Flex direction="row" justify="space-between" alignItems="flex-start" align="flex-start" w="100%">
                <VStack display="flex" alignItems="flex-start" gap="1" mt="3" ml="0">
                  <HStack spacing="1" >
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} w="7px" h="7px" borderRadius="full" bg="#64E364" />
                    ))}
                    <Text fontSize="sm" color={textColor} fontWeight="semibold" mb="0">
                      Very Good Price
                    </Text>
                  </HStack>
                  <HStack> <Flex align="center" gap="1">
                    <Text fontSize="md" color={textColor} fontWeight="bold" lineHeight="1">
                      € 5043
                    </Text>
                    <Text fontSize="xs" color={textColor} display="flex" alignItems="center" flexWrap="wrap" gap="1" mt="1">
                      Cheaper than <LucideIcon icon={MapPin} boxSize="3" color={textColor} /> Spain!
                    </Text>
                  </Flex>
                  </HStack>
                </VStack>
                <Box borderRadius="md" textAlign="right" mt={["2", "1", "3"]}>
                  <Text fontSize={["xl", "xl", "2xl"]} fontWeight="bold" color={priceColor}>
                    € {car.price.toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color={textColor}>
                    €{(car.price / 4).toFixed(2)} without VAT
                  </Text>
                </Box>
              </Flex>
              {/* Bottom row: Cheaper than in Spain! */}

            </Box>

          </Flex>
        </Flex>
      </ChakraLink>
    </Link>
  );
};

// Car Card Skeleton for loading state
const CarCardSkeleton = () => {
  const cardBg = useColorModeValue("white", "#1a1a1a");
  const cardBorderColor = useColorModeValue("gray.100", "#333333");

  return (
    <Flex
      direction={["column", "column", "row"]}
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor={cardBorderColor}
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
          borderColor={cardBorderColor}
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
      <Box w="full" px="10px">
        <VStack spacing="4" mt="4" align="stretch">
          {[1, 2, 3, 4].map((i) => (
            <CarCardSkeleton key={i} />
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

// Car List Component
const CarList = () => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use useMemo to memoize the cars array
  const cars = useMemo(() => [
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
  ], []); // Empty dependency array since this data is static

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay or actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFilteredCars(cars);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [cars]);


  if (isLoading) {
    return <CarListSkeleton />;
  }

  return (
    <Box w="full">
      <Box w="full">
        <VStack spacing="4" mt="4" align="stretch">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </VStack>
      </Box>
    </Box>
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
// Verified Cars Header Component with reduced padding
const VerifiedCarsHeader = () => {
  // Color mode values
  const headerBg = useColorModeValue("transparent", "transparent");
  const headingColor = useColorModeValue("gray.900", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const selectBg = useColorModeValue("white", "#212121");
  const selectBorderColor = useColorModeValue("gray.200", "#333333");
  const selectTextColor = useColorModeValue("gray.700", "gray.300");
  const paginationActiveBg = useColorModeValue("red.400", "red.500");
  const paginationActiveColor = useColorModeValue("white", "white");
  const paginationInactiveColor = useColorModeValue("gray.600", "gray.400");
  const paginationHoverBg = useColorModeValue("gray.100", "#333333");
  const iconColor = useColorModeValue("gray.400", "gray.500");

  return (
    <Box w="full" bg={headerBg}>
      <Flex
        flexDir="row"
        alignItems={["flex-start", "flex-start", "center"]}
        justify="space-between"
        gap="2"
        px="3"
        py="3"
      >
        {/* Title and Results Count */}
        <Box>
          <Heading fontSize="xl" fontWeight="bold" color={headingColor}>
            Verified cars
          </Heading>
          <Text fontSize="sm" color={textColor}>
            194 475 results
          </Text>
        </Box>

        {/* Sort and Pagination */}
        <Flex alignItems="center" gap="3">
          <Select
            size="sm"
            bg={selectBg}
            borderColor={selectBorderColor}
            borderRadius="md"
            px="1"
            py="1.5"
            fontSize="sm"
            color={selectTextColor}
            defaultValue="newest"
            h="32px"
          >
            <option value="newest">Newest ad</option>
            <option value="oldest">Oldest ad</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Select>

          {/* Pagination - smaller buttons */}
          <HStack spacing="1" display={["none", "none", "flex"]}>
            <IconButton
              aria-label="Previous page"
              icon={<LucideIcon icon={ChevronLeft} boxSize="4" />}
              variant="ghost"
              color={iconColor}
              p="1"
              size="sm"
            />
            <Button
              w="6"
              h="6"
              borderRadius="md"
              bg={paginationActiveBg}
              color={paginationActiveColor}
              variant="solid"
              fontSize="xs"
              minW="6"
              p="0"
            >
              1
            </Button>
            <Button
              w="6"
              h="6"
              borderRadius="md"
              variant="ghost"
              color={paginationInactiveColor}
              _hover={{ bg: paginationHoverBg }}
              fontSize="xs"
              minW="6"
              p="0"
            >
              2
            </Button>
            <Button
              w="6"
              h="6"
              borderRadius="md"
              variant="ghost"
              color={paginationInactiveColor}
              _hover={{ bg: paginationHoverBg }}
              fontSize="xs"
              minW="6"
              p="0"
            >
              3
            </Button>
            <Button
              w="6"
              h="6"
              borderRadius="md"
              variant="ghost"
              color={paginationInactiveColor}
              _hover={{ bg: paginationHoverBg }}
              fontSize="xs"
              minW="6"
              p="0"
            >
              4
            </Button>
            <Text px="1" color={textColor}>...</Text>
            <Button
              w="6"
              h="6"
              borderRadius="md"
              variant="ghost"
              color={paginationInactiveColor}
              _hover={{ bg: paginationHoverBg }}
              fontSize="xs"
              minW="8"
              p="0"
            >
              973
            </Button>
            <IconButton
              aria-label="Next page"
              icon={<LucideIcon icon={ChevronRight} boxSize="4" />}
              variant="ghost"
              color={iconColor}
              p="1"
              size="sm"
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

const BodyWithParams = ({ openMobileFilter, isFilterOpen, setIsFilterOpen }) => {
  const { useRouter, useSearchParams } = require('next/navigation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState([]);

  // Color mode values
  const bg = useColorModeValue("transparent", "#0e0e0e");
  const mobileBg = useColorModeValue("transparent", "#121212");
  const chipBg = useColorModeValue("red.100", "rgba(255, 69, 58, 0.2)");
  const chipColor = useColorModeValue("red.500", "red.300");
  const buttonBg = useColorModeValue("red.400", "red.500");
  const buttonColor = useColorModeValue("white", "white");
  const buttonHoverBg = useColorModeValue("red.500", "red.600");
  const closeIconColor = useColorModeValue("red.400", "red.300");
  const closeIconHoverBg = useColorModeValue("red.200", "rgba(255, 69, 58, 0.3)");

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
        // label: fuel.charAt(0).toUpperCase() + fuel.slice(1)
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
        // label: `${hybridType.charAt(0).toUpperCase() + hybridType.slice(1)} hybrid`
      });
    }

    // Power
    const powerFrom = searchParams.get('powerFrom');
    const powerTo = searchParams.get('powerTo');
    const powerUnit = searchParams.get('powerUnit') || 'hp';
    if (powerFrom || powerTo) {
      filters.push({
        id: 'power',
        // label: `${powerFrom || '0'} - ${powerTo || '0'} ${powerUnit.toUpperCase()}`
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
    <Box w="full" maxW="100vw" overflowX="hidden" px={[0, 2, 4]}>
      <Flex flexDir="column" overflow="hidden" bg={["mobileBg", "mobileBg", "transparent"]}>
        {/* Filter Bar for Mobile */}
        <Flex
          display={["flex", "flex", "none"]}
          flexDir="column"
        >
          <Flex
            flexDir="row"
            alignItems="flex-start"
            gap="2"
            py="3.5"
            overflow="hidden"
            bg={mobileBg}
          >
            <Button
              onClick={openMobileFilter}
              display={["flex", "flex", "none"]}
              alignItems="center"
              gap="2"
              px="4"
              py="2"
              bg={buttonBg}
              color={buttonColor}
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: buttonHoverBg }}
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
                    bg={chipBg}
                    color={chipColor}
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
                      color={closeIconColor}
                      borderRadius="full"
                      _hover={{ bg: closeIconHoverBg }}
                    />
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Flex>
          <Box>
            <VerifiedCarsHeader />
            <Suspense fallback={<CarListSkeleton />}>
              <CarList />
            </Suspense>
          </Box>
        </Flex>

        {/* Desktop Version */}
        <Flex
          display={["none", "none", "flex"]}
          flexDir="column"
          w="full"
          bg={bg}
        >
          <Flex flexWrap="wrap" alignItems="center" gap="2" mb="2">
            {/* Filter button - always visible */}
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              leftIcon={<LucideIcon icon={SlidersHorizontal} boxSize="4" />}
              bg={buttonBg}
              color={buttonColor}
              px="4"
              py="2"
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: buttonHoverBg }}
              transition="colors 0.2s"
            >
              Filter
            </Button>

            <Button
              leftIcon={<LucideIcon icon={Bell} boxSize="4" />}
              bg={useColorModeValue("red.500", "red.600")}
              color={buttonColor}
              px="4"
              py="1.5"
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: useColorModeValue("red.600", "red.700") }}
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
                bg={chipBg}
                color={chipColor}
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
                  color={closeIconColor}
                  borderRadius="full"
                  _hover={{ bg: closeIconHoverBg }}
                />
              </Flex>
            ))}
          </Flex>
          <VerifiedCarsHeader />
          <Suspense fallback={<CarListSkeleton />}>
            <CarList />
          </Suspense>
        </Flex>
      </Flex>
    </Box>
  );
};

const Body = (props) => {
  return <BodyWithParams {...props} />;
};

export default Body;