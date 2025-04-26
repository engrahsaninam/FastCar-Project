import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Text,
    VStack,
    Flex,
    Checkbox,
    Input,
    FormControl,
    FormLabel,
    Button,
    Icon,
    HStack,
    SimpleGrid,
    VisuallyHidden,
    Heading,
    Divider,
    Badge,
    Center,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Textarea,
    useToast,
    useColorModeValue,
    useBreakpointValue,
    GridItem
} from '@chakra-ui/react';
import { Package, Info, MapPin, Search, Car, Route } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with no SSR to avoid hydration issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);
const Polyline = dynamic(
    () => import('react-leaflet').then((mod) => mod.Polyline),
    { ssr: false }
);

interface DeliveryContentProps {
    onContinue: () => void;
}

// Store locations data
const storeLocations = [
    {
        id: 1,
        name: "FastCar Vienna Center",
        address: "Opernring 3-5, 1010 Wien",
        phone: "+43 1 123 456 789",
        hours: "Mon-Fri: 9:00 - 18:00, Sat: 10:00 - 15:00",
        position: [48.203, 16.369] as [number, number],
    },
    {
        id: 2,
        name: "FastCar Salzburg",
        address: "Mirabellplatz 4, 5020 Salzburg",
        phone: "+43 662 987 654 321",
        hours: "Mon-Fri: 9:00 - 18:00, Sat: 10:00 - 14:00",
        position: [47.807, 13.045] as [number, number],
    },
    {
        id: 3,
        name: "FastCar Innsbruck",
        address: "Maria-Theresien-Straße 18, 6020 Innsbruck",
        phone: "+43 512 345 678 90",
        hours: "Mon-Fri: 9:30 - 18:30, Sat: 10:00 - 14:00",
        position: [47.269, 11.403] as [number, number],
    }
];

// Car current location (for demonstration)
const carCurrentLocation = {
    position: [48.210, 16.363] as [number, number],
    name: "Your Car",
    status: "Ready for delivery"
};

// Custom styles for consistent red borders
const redBorderStyle = {
    border: '1px solid #E53E3E',
    boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)'
};

const redRadio = {
    border: '1px solid #E53E3E',
};

// Add a utility function for geocoding using OpenStreetMap's Nominatim service
const geocodeAddress = async (address: string) => {
    try {
        // Nominatim API URL (free, but should be used with care in production)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);

        if (!response.ok) {
            throw new Error('Geocoding service unavailable');
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const location = data[0];
            return {
                success: true as const,
                position: [parseFloat(location.lat), parseFloat(location.lon)] as [number, number],
                displayName: location.display_name as string
            };
        } else {
            return {
                success: false as const,
                error: 'No results found'
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return {
            success: false as const,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

const DeliveryContent: React.FC<DeliveryContentProps> = ({ onContinue }) => {
    // State for the delivery form
    const [selected, setSelected] = useState<'home' | 'pickup'>('home');
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [sameAddress, setSameAddress] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [homeLocation, setHomeLocation] = useState<[number, number] | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(true);

    // Common values based on breakpoints
    const isMobile = useBreakpointValue({ base: true, md: false });
    const mapHeight = { base: '250px', md: '350px' };
    const buttonSize = isMobile ? "md" : "lg";
    const buttonPadding = isMobile ? 4 : 8;
    const headingSize = isMobile ? "xs" : "sm";
    const contactData = {
        name: "Laraib khan",
        address: "st 9 Fazal town phase 2, Rawalpindi, 37139",
        email: "517laraibkhan@gmail.com",
        phone: "+39 3471234567"
    }
    // Colors
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.900", "white");
    const subTextColor = useColorModeValue("gray.600", "gray.400");
    const headingColor = useColorModeValue("gray.800", "white");
    const contentPadding = useBreakpointValue({ base: 4, md: 6 });
    const subheadingSize = useBreakpointValue({ base: "lg", md: "xl" });
    const textSize = useBreakpointValue({ base: "sm", md: "md" });
    const paymentIconSize = useBreakpointValue({ base: "24px", md: "30px" });
    const paymentIconWidth = useBreakpointValue({ base: "40px", md: "50px" });
    const buttonBgColor = useColorModeValue("red.500", "red.500");
    const buttonHoverBgColor = useColorModeValue("red.600", "red.400");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const dividerColor = useColorModeValue("gray.200", "gray.700");
    const inputBgColor = useColorModeValue("white", "gray.800");
    const inputBorderColor = useColorModeValue("gray.300", "gray.600");
    const mapLoadingBg = useColorModeValue("gray.100", "gray.700");
    const infoBoxBg = useColorModeValue("blue.50", "blue.900");
    const infoIconColor = useColorModeValue("blue.500", "blue.300");
    const searchIconColor = useColorModeValue("gray.400", "gray.500");

    // Store specific colors - move these out of the map callback
    const selectedStoreBg = useColorModeValue("red.500", "red.600");
    const unselectedStoreBg = useColorModeValue("white", "gray.800");

    const selectedStoreColor = useColorModeValue("white", "white");
    const unselectedStoreColor = useColorModeValue("inherit", "gray.300");

    const selectedStoreHoverBg = useColorModeValue("red.600", "red.700");
    const unselectedStoreHoverBg = useColorModeValue("red.50", "gray.700");

    const selectedStoreDetailColor = useColorModeValue("white", "white");
    const unselectedStoreDetailColor = useColorModeValue("gray.600", "gray.400");

    const selectedStoreDetailSmallColor = useColorModeValue("white", "white");
    const unselectedStoreDetailSmallColor = useColorModeValue("gray.500", "gray.500");

    // Placeholder colors
    const placeholderColor = useColorModeValue("gray.400", "gray.500");

    // Form focus colors
    const inputHoverBorderColor = useColorModeValue("gray.400", "gray.500");
    const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");

    // Checkbox border color
    const checkboxUncheckedBorderColor = useColorModeValue("gray.400", "gray.500");

    // Info box border color
    const infoBoxBorderColor = useColorModeValue("gray.200", "gray.600");

    // Error notification colors
    const errorBg = useColorModeValue("red.50", "red.900");
    const errorColor = useColorModeValue("red.600", "red.300");
    const errorBorderColor = useColorModeValue("red.100", "red.800");

    // Success notification colors
    const successBg = useColorModeValue("green.50", "green.900");
    const successColor = useColorModeValue("green.600", "green.300");
    const successBorderColor = useColorModeValue("green.100", "green.800");

    // Delivery option colors for home
    const homeOptionBg = useColorModeValue(
        selected === 'home' ? "red.500" : "white",
        selected === 'home' ? "red.600" : "gray.800"
    );
    const homeOptionColor = useColorModeValue(
        selected === 'home' ? "white" : "inherit",
        selected === 'home' ? "white" : "gray.300"
    );
    const homeHoverBg = useColorModeValue(
        selected === 'home' ? "red.500" : "red.50",
        selected === 'home' ? "red.600" : "gray.700"
    );
    const homeTitleColor = useColorModeValue(
        selected === 'home' ? "white" : "#1A202C",
        selected === 'home' ? "white" : "gray.200"
    );
    const homeBadgeBg = useColorModeValue(
        selected === 'home' ? "white" : "red.100",
        selected === 'home' ? "white" : "red.900"
    );
    const homeBadgeColor = useColorModeValue(
        selected === 'home' ? "red.500" : "gray.800",
        selected === 'home' ? "red.600" : "gray.200"
    );
    const homeRadioBorderColor = useColorModeValue(
        selected === 'home' ? "white" : "#E53E3E",
        selected === 'home' ? "white" : "#FC8181"
    );

    // Delivery option colors for pickup
    const pickupOptionBg = useColorModeValue(
        selected === 'pickup' ? "red.500" : "white",
        selected === 'pickup' ? "red.600" : "gray.800"
    );
    const pickupOptionColor = useColorModeValue(
        selected === 'pickup' ? "white" : "inherit",
        selected === 'pickup' ? "white" : "gray.300"
    );
    const pickupHoverBg = useColorModeValue(
        selected === 'pickup' ? "red.500" : "red.50",
        selected === 'pickup' ? "red.600" : "gray.700"
    );
    const pickupTitleColor = useColorModeValue(
        selected === 'pickup' ? "white" : "#1A202C",
        selected === 'pickup' ? "white" : "gray.200"
    );
    const pickupBadgeBg = useColorModeValue(
        selected === 'pickup' ? "white" : "red.100",
        selected === 'pickup' ? "white" : "red.900"
    );
    const pickupBadgeColor = useColorModeValue(
        selected === 'pickup' ? "red.500" : "gray.800",
        selected === 'pickup' ? "red.600" : "gray.200"
    );
    const pickupRadioBorderColor = useColorModeValue(
        selected === 'pickup' ? "white" : "#E53E3E",
        selected === 'pickup' ? "white" : "#FC8181"
    );

    const [distance, setDistance] = useState<number | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const mapRef = useRef(null);
    const toast = useToast();

    // Custom styles for selected store
    const redBorderStyle = {
        borderColor: buttonBgColor,
        borderWidth: "2px"
    };

    // Home delivery variables
    const homeDeliveryColors = {
        optionBg: homeOptionBg,
        optionColor: homeOptionColor,
        hoverBg: homeHoverBg,
        titleColor: homeTitleColor,
        badgeBg: homeBadgeBg,
        badgeColor: homeBadgeColor,
        radioBorderColor: homeRadioBorderColor
    };

    // Pickup delivery variables
    const pickupDeliveryColors = {
        optionBg: pickupOptionBg,
        optionColor: pickupOptionColor,
        hoverBg: pickupHoverBg,
        titleColor: pickupTitleColor,
        badgeBg: pickupBadgeBg,
        badgeColor: pickupBadgeColor,
        radioBorderColor: pickupRadioBorderColor
    };

    // More border colors
    const addressInfoBorderColor = useColorModeValue("gray.200", "gray.600");
    const inputPlaceholderColor = useColorModeValue('gray.400', 'gray.500');

    // Additional border colors for info boxes
    const infoBoxStyle = {
        bg: infoBoxBg,
        borderColor: useColorModeValue("gray.200", "gray.600"),
        borderWidth: "1px",
        borderRadius: "md"
    };

    // Pickup store info box border
    const pickupInfoBorderColor = useColorModeValue("gray.200", "gray.600");

    // Checkbox styling
    const checkboxActiveColor = useColorModeValue('red.500', 'red.300');
    const checkboxBorderStyle = {
        '.chakra-checkbox__control': {
            borderColor: checkboxUncheckedBorderColor,
            backgroundColor: 'transparent',
        },
        '.chakra-checkbox__control[data-checked]': {
            borderColor: buttonBgColor,
            backgroundColor: buttonBgColor,
        }
    };

    // Input placeholder style
    const placeholderStyle = {
        color: inputPlaceholderColor,
        fontSize: isMobile ? 'xs' : 'sm'
    };

    // Load the Leaflet CSS when component mounts
    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            // Import leaflet css
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);

            // Manually fix the icon paths issue in Leaflet
            import('leaflet').then(L => {
                // Use type assertion to bypass TypeScript checking
                const DefaultIcon = L.Icon.Default as any;
                delete DefaultIcon.prototype._getIconUrl;

                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                });
                setIsMapLoaded(true);
            });
        }
    }, []);

    // Calculate distance when home location changes
    useEffect(() => {
        if (homeLocation && isMapLoaded) {
            calculateDistance(carCurrentLocation.position, homeLocation);
        }
    }, [homeLocation, isMapLoaded]);

    const calculateDistance = (from: [number, number], to: [number, number]) => {
        // This is a simplified distance calculation - in a real app you'd use a routing API
        if (typeof window !== 'undefined' && window.L) {
            const L = window.L as any;
            const distanceInMeters = L.latLng(from).distanceTo(L.latLng(to));
            const distanceInKm = Math.round(distanceInMeters / 100) / 10; // Round to 1 decimal place
            setDistance(distanceInKm);

            // Estimate delivery time (simplified)
            const averageSpeedKmh = 50; // Average speed in km/h
            const hoursToDeliver = distanceInKm / averageSpeedKmh;
            const daysToDeliver = Math.ceil(hoursToDeliver / 8); // Assuming 8 hours of driving per day

            setEstimatedTime(daysToDeliver <= 1 ? "Tomorrow" : `${daysToDeliver} days`);
        }
    };

    const handleSearchLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() === "") return;

        setIsSearching(true);
        setSearchError(null);

        try {
            const result = await geocodeAddress(searchQuery);

            if (result.success) {
                setHomeLocation(result.position);
                setDeliveryAddress(result.displayName);
                toast({
                    title: "Location found",
                    description: "We've found your address and set it as your delivery location",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                setSearchError(result.error || "Unknown error");
                toast({
                    title: "Address not found",
                    description: result.error || "No address found",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            setSearchError("An unexpected error occurred");
            toast({
                title: "Search failed",
                description: "We couldn't process your address search",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate if a store is selected for pickup option
        if (selected === 'pickup' && selectedStore === null) {
            alert('Please select a pickup location');
            return;
        }

        // Validate if home location is selected for home delivery
        if (selected === 'home' && homeLocation === null) {
            alert('Please select your delivery location on the map');
            return;
        }

        onContinue();
    };

    const handleStoreSelect = (storeId: number) => {
        setSelectedStore(storeId);
    };

    // Show info toast when map is clicked
    const onMapAreaClick = () => {
        if (!homeLocation) {
            toast({
                title: "Click directly on the map",
                description: "Please use the buttons below to set your delivery location",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Use the pre-calculated color objects instead of the function
    const DeliveryOption = ({
        type,
        title,
        price,
    }: {
        type: 'home' | 'pickup';
        title: string;
        price: string;
    }) => {
        const colors = type === 'home' ? homeDeliveryColors : pickupDeliveryColors;

        return (
            <Box
                as="label"
                borderWidth="1px"
                borderRadius="md"
                p={buttonPadding}
                cursor="pointer"
                transition="all 0.2s"
                onClick={() => setSelected(type)}
                bg={colors.optionBg}
                color={colors.optionColor}
                shadow="md"
                _hover={{
                    bg: colors.hoverBg,
                    shadow: "lg"
                }}
                _active={{
                    transform: "scale(0.98)",
                    shadow: "sm"
                }}
                htmlFor={`delivery-${type}`}
                role="radio"
                aria-checked={selected === type}
                style={redBorderStyle}
                width="100%"
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <Flex
                    justify="space-between"
                    align="center"
                    flexDir={isMobile ? "column" : "row"}
                    gap={isMobile ? 2 : 0}
                >
                    <HStack spacing={4} align="center" justify={isMobile ? "center" : "flex-start"} width={isMobile ? "100%" : "auto"}>
                        <Flex
                            w={isMobile ? "18px" : "20px"}
                            h={isMobile ? "18px" : "20px"}
                            borderRadius="full"
                            borderWidth="2px"
                            borderColor={colors.radioBorderColor}
                            bg={selected === type ? buttonBgColor : "transparent"}
                            alignItems="center"
                            justifyContent="center"
                            transition="all 0.2s"
                            aria-hidden="true"
                            flexShrink={0}
                        >
                            {selected === type && (
                                <Box
                                    w={isMobile ? "8px" : "10px"}
                                    h={isMobile ? "8px" : "10px"}
                                    borderRadius="full"
                                    bg="white"
                                />
                            )}
                        </Flex>
                        <Box>
                            <Text
                                fontSize={isMobile ? "sm" : "md"}
                                fontWeight="medium"
                                color={colors.titleColor}
                                textAlign={isMobile ? "center" : "left"}
                            >
                                {title}
                            </Text>
                        </Box>
                    </HStack>
                    <Badge
                        px={2}
                        py={1}
                        fontSize={isMobile ? "xs" : "sm"}
                        fontWeight="bold"
                        bg={colors.badgeBg}
                        color={colors.badgeColor}
                        borderRadius="md"
                        mt={isMobile ? 1 : 0}
                    >
                        {price}
                    </Badge>
                </Flex>
                <input
                    type="radio"
                    id={`delivery-${type}`}
                    name="delivery-option"
                    value={type}
                    checked={selected === type}
                    onChange={() => setSelected(type)}
                    style={{ position: 'absolute', opacity: 0 }}
                    aria-label={`${title} delivery option for ${price}`}
                />
            </Box>
        );
    };

    // Render the map component for pickup locations
    const renderPickupMap = () => {
        if (!isMapLoaded) return <Box height={mapHeight} bg={mapLoadingBg} borderRadius="md" display="flex" alignItems="center" justifyContent="center" color={textColor}>Loading map...</Box>;

        const centerPosition: [number, number] = selectedStore !== null
            ? storeLocations.find(store => store.id === selectedStore)?.position || [47.516, 14.550]
            : [47.516, 14.550]; // Center of Austria

        return (
            <Box height={mapHeight} borderRadius="md" overflow="hidden" shadow="md">
                <MapContainer
                    center={centerPosition}
                    zoom={selectedStore !== null ? 13 : 7}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {storeLocations.map((store) => (
                        <Marker
                            key={store.id}
                            position={store.position}
                            eventHandlers={{
                                click: () => handleStoreSelect(store.id),
                            }}
                        >
                            <Popup>
                                <Box p={1}>
                                    <Text fontWeight="bold" fontSize={isMobile ? "xs" : "sm"}>{store.name}</Text>
                                    <Text fontSize={isMobile ? "xs" : "sm"}>{store.address}</Text>
                                    <Text fontSize="xs" mt={1}>{store.hours}</Text>
                                    <Text fontSize="xs">{store.phone}</Text>
                                </Box>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Box>
        );
    };

    // Render the store list
    const renderStoreList = () => (
        <VStack spacing={3} align="stretch">
            <Heading size="sm" mb={2} color={headingColor}>Select a pickup location</Heading>
            {storeLocations.map((store) => {
                const isSelected = selectedStore === store.id;
                const storeBg = isSelected ? selectedStoreBg : unselectedStoreBg;
                const storeColor = isSelected ? selectedStoreColor : unselectedStoreColor;
                const storeHoverBg = isSelected ? selectedStoreHoverBg : unselectedStoreHoverBg;
                const storeDetailColor = isSelected ? selectedStoreDetailColor : unselectedStoreDetailColor;
                const storeDetailSmallColor = isSelected ? selectedStoreDetailSmallColor : unselectedStoreDetailSmallColor;

                return (
                    <Box
                        key={store.id}
                        p={isMobile ? 2 : 3}
                        borderWidth="1px"
                        borderRadius="md"
                        style={isSelected ? redBorderStyle : undefined}
                        bg={storeBg}
                        color={storeColor}
                        onClick={() => handleStoreSelect(store.id)}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ bg: storeHoverBg }}
                        role="button"
                        aria-pressed={isSelected}
                        aria-label={`Select ${store.name} as pickup location`}
                        shadow="md"
                        borderColor={borderColor}
                    >
                        <Flex align="center">
                            <Icon
                                as={MapPin}
                                color={isSelected ? "white" : buttonBgColor}
                                mr={3}
                                boxSize={isMobile ? 4 : 5}
                            />
                            <Box>
                                <Text fontWeight="medium" fontSize={isMobile ? "sm" : "md"}>{store.name}</Text>
                                <Text
                                    fontSize={isMobile ? "xs" : "sm"}
                                    color={storeDetailColor}
                                >
                                    {store.address}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    color={storeDetailSmallColor}
                                    mt={1}
                                >
                                    {store.hours}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                );
            })}
        </VStack>
    );

    // Render the map component for home delivery
    const renderHomeDeliveryMap = () => {
        if (!isMapLoaded) return (
            <Box
                height={mapHeight}
                bg={mapLoadingBg}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={textColor}
            >
                Loading map...
            </Box>
        );

        const centerPosition: [number, number] = homeLocation || carCurrentLocation.position;

        return (
            <Box
                height={mapHeight}
                borderRadius="md"
                overflow="hidden"
                shadow="md"
                position="relative"
                onClick={onMapAreaClick}
            >
                <MapContainer
                    center={centerPosition}
                    zoom={homeLocation ? 13 : 11}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Car location marker */}
                    <Marker position={carCurrentLocation.position}>
                        <Popup>
                            <Box p={1}>
                                <Text fontWeight="bold" fontSize={isMobile ? "xs" : "sm"}>{carCurrentLocation.name}</Text>
                                <Text fontSize={isMobile ? "xs" : "sm"}>{carCurrentLocation.status}</Text>
                            </Box>
                        </Popup>
                    </Marker>

                    {/* Home location marker (if selected) */}
                    {homeLocation && (
                        <Marker position={homeLocation}>
                            <Popup>
                                <Box p={1}>
                                    <Text fontWeight="bold" fontSize={isMobile ? "xs" : "sm"}>Your Delivery Location</Text>
                                    <Text fontSize={isMobile ? "xs" : "sm"}>{deliveryAddress || "Your delivery address"}</Text>
                                </Box>
                            </Popup>
                        </Marker>
                    )}

                    {/* Route line from car to home */}
                    {homeLocation && (
                        <Polyline
                            positions={[carCurrentLocation.position, homeLocation]}
                            color="red"
                            weight={3}
                            dashArray="5, 10"
                        />
                    )}
                </MapContainer>

                {/* Map instructions overlay */}
                <Box
                    position="absolute"
                    bottom="10px"
                    right="10px"
                    bg={bgColor}
                    p={isMobile ? 2 : 3}
                    borderRadius="md"
                    shadow="md"
                    maxWidth={isMobile ? "150px" : "200px"}
                    zIndex={1000}
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <Text fontSize="xs" fontWeight="bold" color={textColor}>Select a delivery location below</Text>
                </Box>

                {/* Example location buttons */}
                <HStack
                    position="absolute"
                    bottom={isMobile ? "50px" : "70px"}
                    left="10px"
                    spacing={isMobile ? 1 : 2}
                    zIndex={1000}
                >
                    <Button
                        size="xs"
                        colorScheme="red"
                        leftIcon={<Icon as={MapPin} boxSize={isMobile ? 3 : 4} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            const viennaLocation: [number, number] = [48.208, 16.373];
                            setHomeLocation(viennaLocation);
                            setDeliveryAddress("Vienna City Center");
                        }}
                        fontSize={isMobile ? "xs" : "sm"}
                        py={isMobile ? 1 : 2}
                        px={isMobile ? 2 : 3}
                    >
                        Vienna
                    </Button>
                    <Button
                        size="xs"
                        colorScheme="red"
                        leftIcon={<Icon as={MapPin} boxSize={isMobile ? 3 : 4} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            const grazLocation: [number, number] = [47.070, 15.439];
                            setHomeLocation(grazLocation);
                            setDeliveryAddress("Graz City Center");
                        }}
                        fontSize={isMobile ? "xs" : "sm"}
                        py={isMobile ? 1 : 2}
                        px={isMobile ? 2 : 3}
                    >
                        Graz
                    </Button>
                    <Button
                        size="xs"
                        colorScheme="red"
                        leftIcon={<Icon as={MapPin} boxSize={isMobile ? 3 : 4} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            const linzLocation: [number, number] = [48.306, 14.286];
                            setHomeLocation(linzLocation);
                            setDeliveryAddress("Linz City Center");
                        }}
                        fontSize={isMobile ? "xs" : "sm"}
                        py={isMobile ? 1 : 2}
                        px={isMobile ? 2 : 3}
                    >
                        Linz
                    </Button>
                </HStack>
            </Box>
        );
    };

    // Render home delivery search and details
    const renderHomeDeliveryDetails = () => (
        <VStack spacing={4} align="stretch">
            {/* <Heading size="sm" mb={2} color={headingColor}>Set your delivery location</Heading> */}

            {/* Address search with loading state */}
            <GridItem>
                <VStack align="stretch" spacing={{ base: 2, md: 3 }} alignContent="center">
                    {/* <Text color={subTextColor} fontSize={textSize}>Contact data, where we can reach you regarding your purchase</Text> */}

                    <Text fontWeight="medium" mt={2} color={textColor}>{contactData.name}</Text>
                    <Text color={textColor}>{contactData.address}</Text>
                    <Text color={textColor}>{contactData.email}</Text>
                    <Text color={textColor}>{contactData.phone}</Text>
                </VStack>
            </GridItem>
            {/* Error message if search fails */}
            {searchError && (
                <Box p={2} bg={errorBg} color={errorColor} borderRadius="md" fontSize={isMobile ? "xs" : "sm"} borderWidth="1px" borderColor={errorBorderColor}>
                    <Text>{searchError}</Text>
                </Box>
            )}

            {/* Delivery information if location is selected */}
            {homeLocation && (
                <Box
                    bg={infoBoxBg}
                    p={isMobile ? 3 : 4}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderLeftColor={infoBoxBorderColor}
                    borderWidth="1px"
                    borderColor={addressInfoBorderColor}
                >
                    <VStack align="start" spacing={isMobile ? 1 : 2}>
                        <Flex align="center" gap={2}>
                            <Icon as={Car} color={buttonBgColor} boxSize={isMobile ? 4 : 5} />
                            <Text fontWeight="medium" color={textColor} fontSize={isMobile ? "sm" : "md"}>Car Current Location</Text>
                        </Flex>
                        <Text fontSize={isMobile ? "xs" : "sm"} ml={isMobile ? 5 : 6} color={subTextColor}>Vienna, Austria</Text>

                        <Flex align="center" gap={2}>
                            <Icon as={MapPin} color={buttonBgColor} boxSize={isMobile ? 4 : 5} />
                            <Text fontWeight="medium" color={textColor} fontSize={isMobile ? "sm" : "md"}>Delivery Location</Text>
                        </Flex>
                        <Text fontSize={isMobile ? "xs" : "sm"} ml={isMobile ? 5 : 6} fontWeight="medium" color={textColor}>{deliveryAddress || "Custom location selected on map"}</Text>

                        <Flex align="center" gap={2}>
                            <Icon as={Route} color={buttonBgColor} boxSize={isMobile ? 4 : 5} />
                            <Text fontWeight="medium" color={textColor} fontSize={isMobile ? "sm" : "md"}>Distance & Delivery Time</Text>
                        </Flex>
                        <Text fontSize={isMobile ? "xs" : "sm"} ml={isMobile ? 5 : 6} color={subTextColor}>
                            {distance && `${distance} km • Estimated delivery: ${estimatedTime}`}
                        </Text>
                    </VStack>
                </Box>
            )}
        </VStack>
    );

    return (
        <Box
            p={buttonPadding}
            as="section"
            aria-labelledby="delivery-content-title"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
        >
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    {/* Header (if needed) */}
                    <VisuallyHidden id="delivery-content-title">Delivery Options</VisuallyHidden>

                    {/* Delivery Options as RadioGroup */}
                    <FormControl as="fieldset" role="radiogroup" aria-labelledby="delivery-options-group">
                        <FormLabel as="legend" id="delivery-options-group" srOnly>Delivery Options</FormLabel>
                        <HStack
                            spacing={{ base: 3, md: 6 }}
                            align="stretch"
                            width="100%"
                            minH={{ base: "auto", md: "100px" }}
                            flexDirection={{ base: "column", sm: "row" }}
                        >
                            {/* Home Delivery */}
                            <DeliveryOption
                                type="home"
                                title="Home Delivery"
                                price="€1,400"
                            />

                            {/* Pick-Up Option */}
                            <DeliveryOption
                                type="pickup"
                                title="Pick-Up at Our Location"
                                price="€990"
                            />
                        </HStack>
                    </FormControl>

                    {/* Map and Store Locations for Pickup Option */}
                    {selected === 'pickup' && (
                        <Box pt={4} borderTop="1px" borderColor={dividerColor} as="section" aria-labelledby="pickup-locations-section">
                            <Heading as="h3" size={headingSize} id="pickup-locations-section" mb={4} color={headingColor}>
                                Pickup Locations
                            </Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
                                <Box>
                                    {renderStoreList()}
                                </Box>
                                <Box>
                                    {renderPickupMap()}
                                </Box>
                            </SimpleGrid>
                            {selectedStore && (
                                <Box
                                    mt={4}
                                    p={3}
                                    bg={infoBoxBg}
                                    borderRadius="md"
                                    borderWidth="1px"
                                    borderColor={pickupInfoBorderColor}
                                >
                                    <Flex align={isMobile ? "flex-start" : "center"}>
                                        <Icon as={Info} color={infoIconColor} mr={2} mt={isMobile ? "3px" : 0} />
                                        <Text fontSize={isMobile ? "xs" : "sm"} color={textColor}>
                                            You've selected{" "}
                                            <Text as="span" fontWeight="bold">
                                                {storeLocations.find(store => store.id === selectedStore)?.name}
                                            </Text>
                                            {" "}as your pickup location. You'll receive instructions for pickup after your order is confirmed.
                                        </Text>
                                    </Flex>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Map and Address for Home Delivery Option */}
                    {selected === 'home' && (
                        <Box pt={4} borderTop="1px" borderColor={dividerColor} as="section" aria-labelledby="home-delivery-section">
                            <Heading as="h3" size={headingSize} id="home-delivery-section" mb={4} color={headingColor}>
                                Home Delivery Details
                            </Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
                                <Box>
                                    {renderHomeDeliveryDetails()}
                                </Box>
                                <Box>
                                    {renderHomeDeliveryMap()}
                                </Box>
                            </SimpleGrid>
                        </Box>
                    )}

                    {/* Address Confirmation (only shown if same address is unchecked) */}
                    {selected === 'home' && (
                        <Box pt={4} borderTop="1px" borderColor={dividerColor} as="section" aria-labelledby="address-section">
                            <FormControl>
                                <FormLabel htmlFor="same-address" id="address-section" fontSize={isMobile ? "xs" : "sm"} fontWeight="medium" color={textColor}>
                                    <Checkbox
                                        id="same-address"
                                        isChecked={sameAddress}
                                        onChange={(e) => setSameAddress(e.target.checked)}
                                        colorScheme="red"
                                        size={isMobile ? "sm" : "md"}
                                        sx={checkboxBorderStyle}
                                        aria-describedby="same-address-description"
                                    >
                                        My billing and delivery address are the same
                                    </Checkbox>
                                    <Text id="same-address-description" fontSize="xs" color={subTextColor} mt={1} ml={isMobile ? 6 : 8}>
                                        Uncheck this box if you need to provide a different delivery address
                                    </Text>
                                </FormLabel>
                            </FormControl>

                            {!sameAddress && (
                                <Box mt={4} as="fieldset">
                                    <VisuallyHidden as="legend">Delivery Address</VisuallyHidden>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <FormControl>
                                            <FormLabel htmlFor="delivery-address" fontSize="xs" color={subTextColor}>Delivery Address</FormLabel>
                                            <Input
                                                id="delivery-address"
                                                value={deliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                                placeholder="Enter address"
                                                _placeholder={placeholderStyle}
                                                aria-required="true"
                                                autoComplete="shipping postal-code"
                                                inputMode="numeric"
                                                bg={inputBgColor}
                                                color={textColor}
                                                borderColor={inputBorderColor}
                                                size={isMobile ? "md" : "sm"}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="delivery-city" fontSize="xs" color={subTextColor}>City</FormLabel>
                                            <Input
                                                id="delivery-city"
                                                size={isMobile ? "md" : "sm"}
                                                borderRadius="md"
                                                placeholder="Enter city"
                                                _placeholder={placeholderStyle}
                                                aria-required="true"
                                                autoComplete="shipping address-level2"
                                                bg={inputBgColor}
                                                color={textColor}
                                                borderColor={inputBorderColor}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="delivery-postal" fontSize="xs" color={subTextColor}>Postal Code</FormLabel>
                                            <Input
                                                id="delivery-postal"
                                                size={isMobile ? "md" : "sm"}
                                                borderRadius="md"
                                                placeholder="Enter postal code"
                                                _placeholder={placeholderStyle}
                                                aria-required="true"
                                                autoComplete="shipping postal-code"
                                                inputMode="numeric"
                                                bg={inputBgColor}
                                                color={textColor}
                                                borderColor={inputBorderColor}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="delivery-country" fontSize="xs" color={subTextColor}>Country</FormLabel>
                                            <Input
                                                id="delivery-country"
                                                size={isMobile ? "md" : "sm"}
                                                borderRadius="md"
                                                placeholder="Enter country"
                                                _placeholder={placeholderStyle}
                                                aria-required="true"
                                                autoComplete="shipping country-name"
                                                bg={inputBgColor}
                                                color={textColor}
                                                borderColor={inputBorderColor}
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Continue Button */}
                    <Flex justify="center" mt={6}>
                        <Button
                            type="submit"
                            bg={buttonBgColor}
                            color="white"
                            size={buttonSize}
                            px={buttonPadding}
                            width={isMobile ? "100%" : "auto"}
                            shadow="md"
                            _hover={{
                                bg: buttonHoverBgColor,
                                shadow: "lg",
                                transform: "translateY(-1px)"
                            }}
                            _active={{
                                shadow: "sm",
                                transform: "translateY(1px)"
                            }}
                            aria-label="Continue to next step"
                            isDisabled={(selected === 'pickup' && selectedStore === null) ||
                                (selected === 'home' && homeLocation === null)}
                        >
                            Continue
                        </Button>
                    </Flex>
                </VStack>
            </form>
        </Box>
    );
};

export default DeliveryContent; 