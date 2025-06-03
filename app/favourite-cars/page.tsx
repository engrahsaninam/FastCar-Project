"use client";
import React, { useState } from "react";
import { Heart, ShieldCheck, RotateCcw, Clock, Fuel, Settings, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/Layout";

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
    AccordionPanel,
    AccordionIcon,
    AccordionButton,
    SimpleGrid,
    Accordion,
    AccordionItem,
} from '@chakra-ui/react';

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    SmallCloseIcon,
} from '@chakra-ui/icons';
import {
    MapPin,
    ParkingMeterIcon,
    Calendar,
    Gauge,
    Power,
    X,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    Bell,
} from 'lucide-react';
import { Suspense } from 'react';
import logo from '@/public/assets/imgs/template/logo-d.svg';
import logoDark from '@/public/assets/imgs/template/logo-w.svg';
import { useGetSavedCars, useSaveCar, useUnsaveCar } from '@/services/cars/useCars';

// Define the car type for TypeScript
interface Car {
    id: number;
    name: string;
    year: number;
    mileage: number;
    price: number;
    fuel: string;
    gear: string;
    power: string;
    image: string;
    date: string;
    features: string[];
}

// Fix: Add type for LucideIcon props
interface LucideIconProps {
    icon: React.ElementType;
    [key: string]: any;
}
const LucideIcon = ({ icon: Icon, ...props }: LucideIconProps) => {
    return <Box as={Icon} {...props} />;
};

const CarCard = ({ car }: { car: Car }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(true);
    const saveCarMutation = useSaveCar();
    const unsaveCarMutation = useUnsaveCar();

    const cardBg = useColorModeValue("white", "#1a1a1a");
    const cardBorderColor = useColorModeValue("#f7fafc", "#333333");
    const headingColor = useColorModeValue("black", "#f5656");
    const priceColor = useColorModeValue("black", "white");
    const textColor = useColorModeValue("#2d3748", "#e2e8f0");
    const buttonLinkColor = useColorModeValue("#e53e3e", "#fc8181");
    // Fix: separate the useColorModeValue calls from the conditional logic
    const favoriteColor = useColorModeValue("#e53e3e", "#f56565");
    const nonFavoriteColor = useColorModeValue("#4a5568", "#cbd5e0");
    const heartColor = isFavorite ? favoriteColor : nonFavoriteColor;
    const heartFill = isFavorite ? favoriteColor : "none";
    const badgeBg = useColorModeValue("#fff5f5", "rgba(255, 69, 58, 0.15)");
    const badgeColor = useColorModeValue("#f56565", "#fc8181");
    const navBtnBg = useColorModeValue("white", "#333333");

    const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            if (isFavorite) {
                await unsaveCarMutation.mutateAsync(car.id.toString());
            } else {
                await saveCarMutation.mutateAsync(car.id.toString());
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error saving/unsaving car:', error);
        }
    };

    // const nextImage = () => {
    //     setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    // };

    // const previousImage = () => {
    //     setCurrentImageIndex((prev) => prev === 0 ? car.images.length - 1 : prev - 1);
    // };

    return (
        <Link href={`/car?id=${car.id}`} passHref legacyBehavior>
            <ChakraLink display="block" _hover={{ textDecoration: 'none', }} marginInline={["10px", "10px", "30px"]} marginBlock={["10px", "10px", "30px"]}>
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
                                <Image
                                    src={car.image}
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
                                        <Text fontSize="sm" color={textColor}>{car.year}</Text>
                                    </HStack>
                                    <HStack spacing="1">
                                        <LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
                                        <Text fontSize="sm" color={textColor}>{car.mileage}</Text>
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

                            {/* Features - keeping size with less vertical space */}
                            {/* <Flex wrap="wrap" gap={["2", "2", "1.5"]} mt="0" mb={["4", "4", "0"]} ml="1">
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
                            </Flex> */}
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
                                <Box borderRadius="md" textAlign={["right", "right", "right"]} mt={["2", "1", "3"]}>
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


const FavoritesSection: React.FC = () => {
    const { data: savedCars, isLoading } = useGetSavedCars();
    const hasFavorites = savedCars?.length > 0;
    const bgColor = useColorModeValue("#f9faf", "#1a202c");
    const cardBg = useColorModeValue("white", "#1a1a1a");
    const cardBorder = useColorModeValue("#f7fafc", "#2d3748");
    const textColor = useColorModeValue("#1a202c", "#f7fafc");
    const subTextColor = useColorModeValue("#4a5568", "#e2e8f0");
    const hoverBgColor = useColorModeValue("#f7fafc", "#2d3748");
    const hovertextColor = useColorModeValue("#1a202c", "#f7fafc");
    const stepCardBg = useColorModeValue("white", "gray.800");
    const stepCardShadow = useColorModeValue("md", "dark-lg");
    const stepNumberColor = useColorModeValue("red.500", "red.300");
    const cardborder = useColorModeValue("white", "#2d3748");
    const guarantees = [
        {
            icon: "/cashback.png",
            title: "Comprehensive Warranty",
            description: "Every vehicle comes with our premium warranty package covering major mechanical components for complete peace of mind."
        },
        {
            icon: "/payment-method.png",
            title: "Quality Verified",
            description: "Each car undergoes rigorous 150-point inspection by certified technicians to ensure top-tier quality and reliability."
        },
        {
            icon: "/guarantee.png",
            title: "Secure Transaction",
            description: "Your purchase is protected with our secure payment system and transparent documentation process."
        }
    ];

    const bg = useColorModeValue("#f7fafc", "#1a1a1a")
    return (
        <Layout>
            <Box w="full" minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
                <Container maxW="7xl" py={10}>
                    {/* Header */}
                    <Flex align="center" mb={8}>
                        <Link href="/">
                            <IconButton
                                aria-label="Back"
                                icon={<ChevronLeft />}
                                variant="ghost"
                                colorScheme="gray"
                                mr={2}
                            />
                        </Link>
                        <Heading size="lg" color={useColorModeValue("gray.800", "white")} style={{ fontFamily: "satoshi", fontWeight: 900 }}>
                            Favourite cars
                        </Heading>
                    </Flex>

                    {/* Conditional Content */}
                    {isLoading ? (
                        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 mt-12 text-center">
                            <div className="max-w-[280px] mx-auto">
                                <div className="relative w-full aspect-square mb-6">
                                    <Image
                                        src="/loading.svg"
                                        alt="Loading"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <p className="text-gray mb-6">
                                    Loading your favorite cars...
                                </p>
                            </div>
                        </div>
                    ) : !hasFavorites ? (
                        /* Empty State Card */
                        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 mt-12 text-center">
                            <div className="max-w-[280px] mx-auto">
                                <div className="relative w-full aspect-square mb-6">
                                    <Image
                                        src="/favorite-cars.svg"
                                        alt="Favorite cars"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <p className="text-gray mb-6">
                                    You add a car to favourites by clicking on a heart icon.
                                </p>
                                <Link href="/cars">
                                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 px-4 rounded-lg transition-colors text-sm font-medium">
                                        1 166 631 Offers
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Favorite Cars List */
                        <div className="">
                            {savedCars?.map((car: Car) => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    )}

                    {/* Features Grid */}
                    {/* <Box
                        mt={{ base: 8 }}
                        zIndex="1"
                    >
                        <Container maxW="container.xl">
                            <SimpleGrid
                                columns={{ base: 1, md: 3 }}
                                spacing={8}
                                bg={bg}
                                p={{ base: 4, md: 10 }}
                                rounded="3xl"
                                shadow="2xl"
                                display={{ base: "none", md: "grid" }}
                            >
                                {guarantees.map((item, index) => (
                                    <Box
                                        key={index}
                                        position="relative"
                                        overflow="hidden"
                                        bg={bg}
                                        p={8}
                                        rounded="2xl"
                                        border="1px solid"
                                        borderColor={cardBorder}
                                        transition="all 0.4s ease"
                                        _hover={{
                                            transform: 'translateY(-8px)',
                                            shadow: '2xl',
                                            color: hovertextColor
                                        }}
                                    >
                                        <Box
                                            position="absolute"
                                            top="0"
                                            right="0"
                                            w="100px"
                                            h="100px"
                                            bg="red.50"
                                            opacity="0.1"
                                            transform="rotate(45deg) translate(30%, -30%)"
                                            rounded="full"
                                        />
                                        <Flex
                                            direction="column"
                                            align="start"
                                            gap={6}
                                        >
                                            <Box
                                                bg="red.50"
                                                p={4}
                                                rounded="xl"
                                                transform="rotate(-5deg)"
                                            >
                                                <Image
                                                    src={item.icon}
                                                    alt={item.title}
                                                    width={32}
                                                    height={32}
                                                    objectFit="contain"
                                                />
                                            </Box>
                                            <Box>
                                                <Heading
                                                    size="md"
                                                    color="red.500"
                                                    fontWeight="bold"
                                                    mb={3}
                                                    fontSize="xl"
                                                >
                                                    {item.title}
                                                </Heading>
                                                <Text
                                                    color={subTextColor}
                                                    fontSize="md"
                                                    lineHeight="1.7"
                                                >
                                                    {item.description}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Box>
                                ))}
                            </SimpleGrid>

                            <Box
                                display={{ base: "block", md: "none" }}
                                bg={bgColor}
                                p={4}
                                rounded="3xl"
                                shadow="2xl"
                            >
                                <Accordion allowMultiple>
                                    {guarantees.map((item, index) => (
                                        <AccordionItem
                                            key={index}
                                            border="none"
                                            mb={4}
                                            bg={cardBg}
                                            rounded="xl"
                                            overflow="hidden"
                                        >
                                            <AccordionButton
                                                py={4}
                                                px={6}
                                                _hover={{ bg: "transparent" }}
                                            >
                                                <Flex align="center" flex="1">
                                                    <Box
                                                        bg="red.50"
                                                        p={2}
                                                        rounded="lg"
                                                        mr={4}
                                                    >
                                                        <Image
                                                            src={item.icon}
                                                            alt={item.title}
                                                            width={24}
                                                            height={24}
                                                            objectFit="contain"
                                                        />
                                                    </Box>
                                                    <Heading
                                                        size="sm"
                                                        color="red.500"
                                                        fontWeight="bold"
                                                        flex="1"
                                                        textAlign="left"
                                                    >
                                                        {item.title}
                                                    </Heading>
                                                    <AccordionIcon color="red.500" />
                                                </Flex>
                                            </AccordionButton>
                                            <AccordionPanel pb={4} px={6}>
                                                <Text
                                                    color={subTextColor}
                                                    fontSize="sm"
                                                    lineHeight="1.6"
                                                >
                                                    {item.description}
                                                </Text>
                                            </AccordionPanel>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Box>
                        </Container>
                    </Box> */}
                </Container>
            </Box>
        </Layout>
    );
};

export default FavoritesSection; 