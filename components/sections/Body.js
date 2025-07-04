"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useCurrentUser } from '@/services/auth/useAuth';
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
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react'
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
import { useCar, useSaveCar, useUnsaveCar } from '@/services/cars/useCars';
// Custom Lucide icon wrapper for Chakra UI
const LucideIcon = ({ icon: Icon, ...props }) => {
  return <Box as={Icon} {...props} />;
};

// Car Card Component
export const CarCard = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const saveCarMutation = useSaveCar();
  const unsaveCarMutation = useUnsaveCar();

  const cardBg = useColorModeValue("white", "#1a1a1a");
  const cardBorderColor = useColorModeValue("gray.100", "#333333");
  const headingColor = useColorModeValue("black", "red.400");
  const priceColor = useColorModeValue("black", "white");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const buttonLinkColor = useColorModeValue("red.600", "red.300");
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

  // Format mileage with commas
  const formattedMileage = car.mileage.toLocaleString();

  // Format power with kW
  const formattedPower = `${car.power} hp`;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      if (isFavorite) {
        await unsaveCarMutation.mutateAsync(car.id);
      } else {
        await saveCarMutation.mutateAsync(car.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error saving/unsaving car:', error);
    }
  };

  return (
    <>
      <Link href={`/car?id=${car.id}`} passHref legacyBehavior>
        <ChakraLink display="block" _hover={{ textDecoration: 'none' }}>
          <Flex
            direction={["column", "row", "row"]}
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
            alignItems={["flex-start", "flex-start", "flex-start"]}
            gap={[2, 6, 6]}
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
                    onClick={handleFavoriteClick}
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
                    alt={`${car.brand} ${car.model}`}
                    fill
                    priority
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </AspectRatio>
            </Box>

            {/* Content Section */}
            <Flex
              flex="1"
              p={["4", "4", "3"]}
              flexDir="column"
              justifyContent="space-between"
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
                  >
                    {[
                      car?.brand,
                      car?.model,
                      car?.power ? `${(car.power * 0.7355).toFixed(0)} kW` : null
                    ].filter(Boolean).join(' ') || 'Car Details'}
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

                {/* Specs Row */}
                <Box mb={["2", "2", "1"]} ml="1">
                  <Flex direction="row" gap={6} mb={1}>
                    <HStack spacing="1">
                      <LucideIcon icon={Power} boxSize="4" color={textColor} />
                      <Text fontSize="sm" color={textColor}>{formattedPower}</Text>
                    </HStack>
                    <HStack spacing="1">
                      <LucideIcon icon={Calendar} boxSize="4" color={textColor} />
                      <Text fontSize="sm" color={textColor}>{car.year}</Text>
                    </HStack>
                    <HStack spacing="1">
                      <LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
                      <Text fontSize="sm" color={textColor}>{formattedMileage} km</Text>
                    </HStack>
                  </Flex>
                  <Flex direction="row" gap={6}>
                    <HStack spacing="1">
                      <LucideIcon icon={Gauge} boxSize="4" color={textColor} />
                      <Text fontSize="sm" color={textColor} fontWeight="semibold">{car.gear}</Text>
                    </HStack>
                    <HStack spacing="1">
                      <LucideIcon icon={Fuel} boxSize="4" color={textColor} />
                      <Text fontSize="sm" color={textColor} fontWeight="semibold">{car.fuel}</Text>
                    </HStack>
                  </Flex>
                </Box>

                {/* Features */}
                <Flex wrap="wrap" gap={["2", "2", "1.5"]} mt="0" mb={["4", "4", "0"]} ml="1">
                  {car.features &&
                    Object.entries(car.features)
                      .flatMap(([category, features]) => (Array.isArray(features) ? features : []))
                      .slice(0, 4)
                      .map((feature, index) => (
                        <Badge
                          key={index}
                          px="2"
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
                  {car.features &&
                    Object.entries(car.features)
                      .flatMap(([category, features]) => (Array.isArray(features) ? features : []))
                      .length > 4 && (
                      <Button
                        variant="unstyled"
                        color={buttonLinkColor}
                        fontSize="sm"
                        fontWeight="medium"
                        height="auto"
                        padding="0"
                        lineHeight="1.5"
                        _hover={{ textDecoration: "underline" }}
                        onClick={e => e.preventDefault()}
                        style={{ textTransform: "none" }}
                      >
                        + {Object.entries(car.features).flatMap(([_, features]) => features).length - 4} more
                      </Button>
                    )
                  }
                </Flex>
              </Box>

              {/* Price Section */}
              <Box
                px={["0", "0", "2"]}
                borderTopWidth="1px"
                borderColor={cardBorderColor}
              >
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
                      <Text fontSize="xs" color={textColor} fontWeight="bold" lineHeight="1">
                        € 5043
                      </Text>
                      <Text fontSize="xs" color={textColor} display="flex" alignItems="center" flexWrap="wrap" gap="1" mt="1">
                        Cheaper than <LucideIcon icon={MapPin} boxSize="3" color={textColor} /> Spain!
                      </Text>
                    </Flex>
                    </HStack>
                  </VStack>
                  <Box borderRadius="md" textAlign={["right", "right", "right"]} mt={["2", "1", "3"]} ml={["4","4","4"]}>
                    <Text fontSize={["md", "md", "md"]} fontWeight="bold" color={priceColor}>
                      € {car.price.toLocaleString()}
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      €{(car.price / 4).toFixed(2)} without VAT
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </ChakraLink>
      </Link>
      {/* Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You need to be logged in to add favorites.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => {
              setIsLoginModalOpen(false);
              router.push('/login');
            }}>
              Go to Login
            </Button>
            <Button variant="ghost" onClick={() => setIsLoginModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// Car Card Skeleton for loading state
export const CarCardSkeleton = () => {
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
export const CarListSkeleton = () => {
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

// Verified Cars Header Component
const VerifiedCarsHeader = ({ carData, currentPage, onPageChange }) => {
  // Color mode values - moved to top level
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
          <Heading fontSize="xl" fontWeight="bold" color={headingColor} fontFamily='satoshi'>
            Verified cars
          </Heading>
          <Text fontSize="sm" color={textColor}>
            {carData?.total || 0} results
          </Text>
        </Box>

        {/* Sort and Pagination */}
        <Flex alignItems="center" gap="3">
          <HStack spacing="1" display={["none", "none", "flex"]}>
            <IconButton
              aria-label="Previous page"
              icon={<LucideIcon icon={ChevronLeft} boxSize="4" />}
              variant="ghost"
              color={iconColor}
              p="1"
              size="sm"
              isDisabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            />
            {Array.from({ length: Math.min(5, carData?.pages || 1) }, (_, i) => {
              let pageNum;
              if (i < 3) {
                pageNum = i + 1;
              } else if (i === 3 && currentPage > 3 && currentPage < (carData?.pages || 1) - 1) {
                pageNum = currentPage;
              } else if (i === 4) {
                pageNum = carData?.pages || 1;
              }

              if (!pageNum) return null;

              return (
                <React.Fragment key={pageNum}>
                  {i === 3 && currentPage > 3 && currentPage < (carData?.pages || 1) - 1 && (
                    <Text px="1" color={textColor}>...</Text>
                  )}
                  <Button
                    w="6"
                    h="6"
                    borderRadius="md"
                    bg={pageNum === currentPage ? paginationActiveBg : "transparent"}
                    color={pageNum === currentPage ? paginationActiveColor : paginationInactiveColor}
                    variant={pageNum === currentPage ? "solid" : "ghost"}
                    _hover={{ bg: pageNum === currentPage ? paginationActiveBg : paginationHoverBg }}
                    fontSize="xs"
                    minW="6"
                    p="0"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                  {i === 3 && currentPage > 3 && currentPage < (carData?.pages || 1) - 1 && (
                    <Text px="1" color={textColor}>...</Text>
                  )}
                </React.Fragment>
              );
            })}
            <IconButton
              aria-label="Next page"
              icon={<LucideIcon icon={ChevronRight} boxSize="4" />}
              variant="ghost"
              color={iconColor}
              p="1"
              size="sm"
              isDisabled={currentPage === (carData?.pages || 1)}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

// Car List Component
const CarList = ({ carData, isLoading }) => {
  const textColor = useColorModeValue("gray.600", "gray.400");

  if (isLoading) {
    return <CarListSkeleton />;
  }

  return (
    <Box w="full">
      <Box w="full">
        <VStack spacing="4" mt="4" align="stretch">
          {carData?.data?.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </VStack>
        <Text
          textAlign="center"
          color={textColor}
          fontSize="sm"
          mt="2"
        >
          Showing {carData?.data?.length || 0} of {carData?.total || 0} cars
        </Text>
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
  'cabriolett': 'Cabriolett',
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

const BodyWithParams = ({ openMobileFilter, isFilterOpen, setIsFilterOpen }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLaptop, setIsLaptop] = useState(false);

  // Get the current page from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');

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
  const saveSearchBg = useColorModeValue("red.500", "red.600");
  const saveSearchHoverBg = useColorModeValue("red.600", "red.700");

  // Get all filter parameters from URL
  const filters = {
    tab: searchParams.get('tab'),
    priceType: searchParams.get('priceType'),
    min_price: searchParams.get('min_price'),
    max_price: searchParams.get('max_price'),
    min_year: searchParams.get('min_year'),
    max_year: searchParams.get('max_year'),
    min_mileage: searchParams.get('min_mileage'),
    max_mileage: searchParams.get('max_mileage'),
    gear: searchParams.get('gear'),
    vat: searchParams.get('vat'),
    discounted: searchParams.get('discounted'),
    fuel: searchParams.get('fuel')?.split(',').filter(Boolean),
    electric: searchParams.get('electric'),
    hybridType: searchParams.get('hybridType'),
    powerUnit: searchParams.get('powerUnit'),
    powerFrom: searchParams.get('powerFrom'),
    powerTo: searchParams.get('powerTo'),
    body_type: searchParams.get('body_type')?.split(',').filter(Boolean),
    colour: searchParams.get('colour')?.split(',').filter(Boolean),
    features: searchParams.get('features')?.split(',').filter(Boolean),
    makeModel: searchParams.get('makeModel')?.split(',').filter(Boolean),
    brand: searchParams.getAll('brand'),
    model: searchParams.getAll('model'),
  };

  const { data: carData, isLoading } = useCar(currentPage, '20', filters);
  const priceRange = useMemo(() => {
    if (!carData) return null;
    // ...fetch or calculate price range
  }, [carData]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/cars?${params.toString()}`, { scroll: false });
  };

  // Check screen size on mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLaptop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    setIsFilterOpen(window.innerWidth >= 1024);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [setIsFilterOpen]);

  const removeFilter = (filterId) => {
    const params = new URLSearchParams(searchParams.toString());

    switch (filterId) {
      case 'price':
        params.delete('min_price');
        params.delete('max_price');
        params.delete('priceType');
        break;
      case 'registration':
        params.delete('min_year');
        params.delete('max_year');
        break;
      case 'mileage':
        params.delete('min_mileage');
        params.delete('max_mileage');
        break;
      case 'gear':
        params.delete('gear');
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
      case 'body_type':
        params.delete('body_type');
        break;
      default:
        if (filterId.startsWith('colour-')) {
          const colour = filterId.replace('colour-', '');
          const currentColours = params.get('colour')?.split(',') || [];
          const newColours = currentColours.filter(c => c !== colour);
          if (newColours.length) {
            params.set('colour', newColours.join(','));
          } else {
            params.delete('colour');
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
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const priceType = searchParams.get('priceType');
    if (min_price || max_price) {
      filters.push({
        id: 'price',
        label: `${formatPrice(min_price || 0)} - ${formatPrice(max_price || 0)}}`
      });
    }

    // Registration period
    const min_year = searchParams.get('min_year');
    const max_year = searchParams.get('max_year');
    if (min_year || max_year) {
      filters.push({
        id: 'registration',
        label: min_year === max_year
          ? `Registration: ${min_year}`
          : `Registration: ${min_year || ''} - ${max_year || ''}`
      });
    }

    // Mileage
    const min_mileage = searchParams.get('min_mileage');
    const max_mileage = searchParams.get('max_mileage');
    if (min_mileage || max_mileage) {
      filters.push({
        id: 'mileage',
        label: `${parseInt(min_mileage || '0').toLocaleString()} - ${parseInt(max_mileage || '0').toLocaleString()} km`
      });
    }

    // Transmission
    const gear = searchParams.get('gear');
    if (gear) {
      filters.push({
        id: 'gear',
        label: gear
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
    const body_type = searchParams.get('body_type')?.split(',') || [];
    body_type.forEach(type => {
      if (vehicleTypesMap[type]) {
        filters.push({
          id: `body_type-${type}`,
          label: vehicleTypesMap[type]
        });
      }
    });

    // Colours
    const colours = searchParams.get('colour')?.split(',') || [];
    colours.forEach(colour => {
      if (colorMap[colour]) {
        filters.push({
          id: `colour-${colour}`,
          label: colorMap[colour]
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
    // const is4x4 = searchParams.get('is4x4');
    // if (is4x4 === 'true') {
    //   filters.push({
    //     id: '4x4',
    //     label: 'Drive type 4x4'
    //   });
    // }

    setActiveFilters(filters);
  }, [searchParams]);

  // if (isLoading) return <CarListSkeleton />;

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
            <VerifiedCarsHeader
              carData={carData}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
            <Suspense fallback={<CarListSkeleton />}>
              <CarList carData={carData} isLoading={isLoading} />
            </Suspense>
          </Box>
        </Flex>

        {/* Desktop Version */}
        <Flex
          display={["none", "none", "flex"]}
          flexDir="column"
          w="full"
        // bg={bg}
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
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>

            <Button
              leftIcon={<LucideIcon icon={Bell} boxSize="4" />}
              bg={saveSearchBg}
              color={buttonColor}
              px="4"
              py="1.5"
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ bg: saveSearchHoverBg }}
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
          <VerifiedCarsHeader
            carData={carData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          <Suspense fallback={<CarListSkeleton />}>
            <CarList carData={carData} isLoading={isLoading} />
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