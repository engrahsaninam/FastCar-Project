"use client"
import React, { useState } from 'react';
import { Car, Plus, Clock, Euro, PhoneCall } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { Heart, ShieldCheck, RotateCcw, Fuel, Settings, TagIcon } from "lucide-react";
import Layout from '@/components/layout/Layout';
import logo from '@/public/assets/imgs/template/logo-d.svg';
import logoDark from '@/public/assets/imgs/template/logo-w.svg';
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
                        <Link href="/">
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
                                    key={order.id + '-' + idx}
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
                                                    // onClick={(e) => {
                                                    //     e.preventDefault();
                                                    //     setIsFavorite(!isFavorite);
                                                    // }}
                                                    aria-label="Add to favorites"
                                                />
                                                <Image
                                                    src={order.image}
                                                    alt={order.name}
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
                                                    {order.name}
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
                                                <SimpleGrid columns={[3, 3, 5]} spacingX={[2, 2, 6]} spacingY={2} mb={[2, 2, 1]}>
                                                    <HStack spacing="1">
                                                        <LucideIcon icon={Power} boxSize="4" color={textColor} />
                                                        <Text fontSize="sm" color={textColor}>{order.power}</Text>
                                                    </HStack>
                                                    <HStack spacing="1">
                                                        <LucideIcon icon={Calendar} boxSize="4" color={textColor} />
                                                        <Text fontSize="sm" color={textColor}>{order.date}</Text>
                                                    </HStack>
                                                    <HStack spacing="1">
                                                        <LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
                                                        <Text fontSize="sm" color={textColor}>{order.mileage}</Text>
                                                    </HStack>
                                                    <HStack spacing="1">
                                                        <LucideIcon icon={Gauge} boxSize="4" color={textColor} />
                                                        <Text fontSize="sm" color={textColor} fontWeight="semibold">{order.transmission}</Text>
                                                    </HStack>
                                                    <HStack spacing="1">
                                                        <LucideIcon icon={Fuel} boxSize="4" color={textColor} />
                                                        <Text fontSize="sm" color={textColor} fontWeight="semibold">{order.fuelType}</Text>
                                                    </HStack>
                                                </SimpleGrid>
                                            </Box>

                                            {/* Features - keeping size with less vertical space */}
                                            <Flex wrap="wrap" gap={["2", "2", "1.5"]} mt="0" mb={["4", "4", "0"]} ml="1">
                                                {order.features.slice(0, 4).map((feature, index) => (
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
                                                {order.features.length > 4 && (
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
                                                        + {order.features.length - 4} more
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
                                                <Box borderRadius="md" textAlign={["right", "right", "right"]} mt={["2", "1", "3"]}>
                                                    <Text fontSize={["xl", "xl", "2xl"]} fontWeight="bold" color={priceColor}>
                                                        € {order.price.toLocaleString()}
                                                    </Text>
                                                    <Text fontSize="xs" color={textColor}>
                                                        €{(order.price / 4).toFixed(2)} without VAT
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Box mb={2}>
                                                {/* <Text fontSize="xs" color="gray.400" mb={1}>
                                                    Progress
                                                </Text> */}
                                                <Box bg="gray.100" rounded="full" h="2">
                                                    <Box
                                                        bg="red.400"
                                                        h="2"
                                                        mt={["4", "4", "0"]}
                                                        rounded="full"
                                                        transition="width 0.3s"
                                                        w={`${getStatusPercentage("Documentation")}%`}
                                                    />
                                                </Box>
                                            </Box>
                                            {/* Bottom row: Cheaper than in Spain! */}

                                        </Box>

                                    </Flex>
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