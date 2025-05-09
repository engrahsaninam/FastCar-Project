"use client"
import React, { useState } from 'react';
import { Car, Plus, Clock, Euro, PhoneCall } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { Heart, ShieldCheck, RotateCcw, Fuel, Settings, TagIcon } from "lucide-react";
import Layout from '@/components/layout/Layout';
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
const OrdersInProgress = () => {
    // Toggle this to false to see empty state
    const hasOrders = true;
    const totalOffers = "1 139 268";

    // Dummy orders data
    const orders = [
        {
            id: 1,
            name: "BMW Cooper 100 kW",
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
            logo: "/Logo/logo.png",
            image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",

        },
        {
            id: 1,
            name: "BMW Cooper 100 kW",
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
            logo: "/Logo/logo.png",
            image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        },
        {
            id: 1,
            name: "BMW Cooper 100 kW",
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
            logo: "/Logo/logo.png",
            image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        }
    ];

    const getStatusPercentage = (status: string) => {
        switch (status) {
            case 'Documentation': return 33;
            case 'Transport': return 66;
            case 'Payment Processing': return 90;
            default: return 100;
        }
    };
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    interface LucideIconProps {
        icon: React.ElementType;
        [key: string]: any;
    }
    const LucideIcon = ({ icon: Icon, ...props }: LucideIconProps) => {
        return <Box as={Icon} {...props} />;
    };

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
    return (
        <Layout>
            <Box w="full" minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
                <Container maxW="7xl" py={10}>
                    {/* Header */}
                    <Flex align="center" mb={8}>
                        <Link href="/dashboard">
                            <IconButton
                                aria-label="Back"
                                icon={<ChevronLeft />}
                                variant="ghost"
                                colorScheme="gray"
                                mr={2}
                            />
                        </Link>
                        <Heading size="lg" color={useColorModeValue("gray.800", "white")}>
                            Orders in progress
                        </Heading>
                    </Flex>

                    {/* Main Content */}
                    {hasOrders ? (
                        <VStack spacing={8} align="stretch">
                            {orders.map((order, idx) => (
                                <Flex
                                    key={order.id + idx}
                                    direction={{ base: "column", md: "row" }}
                                    bg={cardBg}
                                    rounded="2xl"
                                    shadow="md"
                                    borderWidth="1px"
                                    borderColor={cardBorderColor}
                                    overflow="hidden"
                                    _hover={{ shadow: "xl", borderColor: "red.300" }}
                                    transition="all 0.2s"
                                >
                                    {/* Car Image */}
                                    <Box pos="relative" w={{ base: "100%", md: "300px" }} minH="220px">
                                        <Image
                                            src={order.image}
                                            alt={order.name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="rounded-l-2xl"
                                            priority
                                        />
                                        {/* <IconButton
                                            aria-label="Favorite"
                                            icon={<Heart />}
                                            pos="absolute"
                                            top={3}
                                            right={3}
                                            bg="whiteAlpha.800"
                                            color="red.400"
                                            rounded="full"
                                            size="sm"
                                            shadow="md"
                                            _hover={{ bg: "red.50" }}
                                        /> */}
                                    </Box>
                                    {/* Order Details */}
                                    <Box flex="1" p={{ base: 4, md: 6 }}>
                                        <Flex justify="space-between" align="center" mb={2}>
                                            <Badge colorScheme="red" fontSize="0.9em" px={2} py={1} rounded="md">
                                                {order.transmission}
                                            </Badge>
                                            <Text fontWeight="bold" color="red.500" fontSize="xl">
                                                €{order.price.toLocaleString()}
                                            </Text>
                                        </Flex>
                                        <Heading size="md" mb={2} color={headingColor}>
                                            {order.name}
                                        </Heading>
                                        <HStack spacing={4} mb={2}>
                                            <Text fontSize="sm" color={textColor}>
                                                <Calendar size={16} style={{ display: "inline" }} /> {order.date}
                                            </Text>
                                            <Text fontSize="sm" color={textColor}>
                                                <Fuel size={16} style={{ display: "inline" }} /> {order.fuelType}
                                            </Text>
                                            <Text fontSize="sm" color={textColor}>
                                                <Gauge size={16} style={{ display: "inline" }} /> {order.mileage}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={2} mb={2}>
                                            {order.features.slice(0, 3).map((feature, i) => (
                                                <Badge key={i} colorScheme="gray" variant="subtle" rounded="md">
                                                    {feature}
                                                </Badge>
                                            ))}
                                            {order.features.length > 3 && (
                                                <Badge colorScheme="red" variant="outline" rounded="md">
                                                    +{order.features.length - 3} more
                                                </Badge>
                                            )}
                                        </HStack>
                                        <Flex align="center" mb={2}>
                                            <Text fontSize="sm" color="gray.500" mr={2}>
                                                Status:
                                            </Text>
                                            <Badge colorScheme="yellow" rounded="md">
                                                Documentation
                                            </Badge>
                                            <Text fontSize="sm" color="gray.400" ml={4}>
                                                ETA: {order.date}
                                            </Text>
                                        </Flex>
                                        {/* Progress Bar */}
                                        <Box mb={2}>
                                            <Text fontSize="xs" color="gray.400" mb={1}>
                                                Progress
                                            </Text>
                                            <Box bg="gray.100" rounded="full" h="2">
                                                <Box
                                                    bg="red.400"
                                                    h="2"
                                                    rounded="full"
                                                    transition="width 0.3s"
                                                    w={`${getStatusPercentage("Documentation")}%`}
                                                />
                                            </Box>
                                        </Box>
                                        <Flex justify="flex-end" mt={4}>
                                            <Link href={`/car?id=${order.id}`}>
                                                <Button colorScheme="red" variant="solid" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </Flex>
                                    </Box>
                                </Flex>
                            ))}
                        </VStack>
                    ) : (
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            bg={cardBg}
                            rounded="2xl"
                            shadow="md"
                            borderWidth="1px"
                            borderColor={cardBorderColor}
                            p={12}
                            minH="300px"
                        >
                            <Car size={80} className="text-red-200 mb-4" />
                            <Text color={textColor} fontSize="lg" mb={4}>
                                Here you will see cars in transaction process.
                            </Text>
                            <Link href="/cars">
                                <Button colorScheme="red" size="lg">
                                    {totalOffers} Offers
                                </Button>
                            </Link>
                        </Flex>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

const CategoryLink = ({ label, count }: { label: string, count: string }) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <span className="text-gray-600 group-hover:text-red-500 transition-colors">
            {label}
        </span>
        <span className="text-gray-400 text-sm">
            {count}
        </span>
    </div>
);

export default OrdersInProgress; 