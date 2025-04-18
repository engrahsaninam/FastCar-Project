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
    useToast,
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
    const [selected, setSelected] = useState<'home' | 'pickup'>('home');
    const [sameAddress, setSameAddress] = useState(true);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [homeLocation, setHomeLocation] = useState<[number, number] | null>(null);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [distance, setDistance] = useState<number | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const mapRef = useRef(null);
    const toast = useToast();

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

    const DeliveryOption = ({
        type,
        title,
        price,
        // deliveryDate,
        // note
    }: {
        type: 'home' | 'pickup';
        title: string;
        price: string;
        // deliveryDate: string;
        // note: string;
    }) => (
        <Box
            as="label"
            borderWidth="1px"
            borderRadius="md"
            p={5}
            cursor="pointer"
            transition="all 0.2s"
            onClick={() => setSelected(type)}
            bg={selected === type ? "red.500" : "white"}
            color={selected === type ? "white" : "inherit"}
            shadow="md"
            _hover={{
                bg: selected === type ? "red.500" : "red.50",
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
            <Flex justify="space-between" align="center">
                <HStack spacing={4}>
                    <Flex
                        w="20px"
                        h="20px"
                        borderRadius="full"
                        borderWidth="2px"
                        borderColor={selected === type ? "white" : "#E53E3E"}
                        bg={selected === type ? "#E53E3E" : "white"}
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.2s"
                        aria-hidden="true"
                        style={{ borderColor: selected === type ? "white" : "#E53E3E" }}
                    >
                        {selected === type && (
                            <Box
                                w="10px"
                                h="10px"
                                borderRadius="full"
                                bg="white"
                            />
                        )}
                    </Flex>
                    <Box>
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={selected === type ? "white" : "#1A202C"}
                        >
                            {title}
                        </Text>
                        {/* <Text
                            color={selected === type ? "white" : "gray.700"}
                            mt={2}
                        >
                            {description}
                        </Text> */}
                        {/* <Flex align="center" gap={2} mt={3}>
                            <Icon
                                as={Package}
                                w={4}
                                h={4}
                                color={selected === type ? "white" : "gray.500"}
                                aria-hidden="true"
                            />
                            <Text
                                fontSize="sm"
                                color={selected === type ? "white" : "gray.600"}
                            >
                                {deliveryDate}
                            </Text>
                        </Flex> */}
                        {/* <Text
                            fontSize="xs"
                            color={selected === type ? "white" : "gray.500"}
                            mt={1}
                        >
                            {note}
                        </Text> */}
                    </Box>
                </HStack>
                <Badge
                    px={2}
                    py={1}
                    fontSize="sm"
                    fontWeight="bold"
                    bg={selected === type ? "white" : "red.100"}
                    color={selected === type ? "red.500" : "gray.800"}
                    borderRadius="md"
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

    // Render the map component for pickup locations
    const renderPickupMap = () => {
        if (!isMapLoaded) return <Box height="400px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">Loading map...</Box>;

        const centerPosition: [number, number] = selectedStore !== null
            ? storeLocations.find(store => store.id === selectedStore)?.position || [47.516, 14.550]
            : [47.516, 14.550]; // Center of Austria

        return (
            <Box height="400px" borderRadius="md" overflow="hidden" shadow="md">
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
                                    <Text fontWeight="bold">{store.name}</Text>
                                    <Text fontSize="sm">{store.address}</Text>
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

    // Render the map component for home delivery
    const renderHomeDeliveryMap = () => {
        if (!isMapLoaded) return <Box height="400px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">Loading map...</Box>;

        const centerPosition: [number, number] = homeLocation || carCurrentLocation.position;

        return (
            <Box
                height="400px"
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
                                <Text fontWeight="bold">{carCurrentLocation.name}</Text>
                                <Text fontSize="sm">{carCurrentLocation.status}</Text>
                            </Box>
                        </Popup>
                    </Marker>

                    {/* Home location marker (if selected) */}
                    {homeLocation && (
                        <Marker position={homeLocation}>
                            <Popup>
                                <Box p={1}>
                                    <Text fontWeight="bold">Your Delivery Location</Text>
                                    <Text fontSize="sm">{deliveryAddress || "Your delivery address"}</Text>
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
                    bg="white"
                    p={3}
                    borderRadius="md"
                    shadow="md"
                    maxWidth="200px"
                    zIndex={1000}
                >
                    <Text fontSize="xs" fontWeight="bold">Select a delivery location below</Text>
                </Box>

                {/* Example location buttons */}
                <HStack
                    position="absolute"
                    bottom="70px"
                    left="10px"
                    spacing={2}
                    zIndex={1000}
                >
                    <Button
                        size="xs"
                        colorScheme="red"
                        leftIcon={<Icon as={MapPin} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            const viennaLocation: [number, number] = [48.208, 16.373];
                            setHomeLocation(viennaLocation);
                            setDeliveryAddress("Vienna City Center");
                        }}
                    >
                        Vienna
                    </Button>
                    <Button
                        size="xs"
                        colorScheme="red"
                        leftIcon={<Icon as={MapPin} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            const grazLocation: [number, number] = [47.070, 15.439];
                            setHomeLocation(grazLocation);
                            setDeliveryAddress("Graz City Center");
                        }}
                    >
                        Graz
                    </Button>
                    <Button
                        size="xs"
                        colorScheme="red"
                        leftIcon={<Icon as={MapPin} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            const linzLocation: [number, number] = [48.306, 14.286];
                            setHomeLocation(linzLocation);
                            setDeliveryAddress("Linz City Center");
                        }}
                    >
                        Linz
                    </Button>
                </HStack>
            </Box>
        );
    };

    // Render the store list
    const renderStoreList = () => (
        <VStack spacing={3} align="stretch">
            <Heading size="sm" mb={2}>Select a pickup location</Heading>
            {storeLocations.map((store) => (
                <Box
                    key={store.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    style={selectedStore === store.id ? redBorderStyle : undefined}
                    bg={selectedStore === store.id ? "red.500" : "white"}
                    color={selectedStore === store.id ? "white" : "inherit"}
                    onClick={() => handleStoreSelect(store.id)}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: selectedStore === store.id ? "red.600" : "red.50" }}
                    role="button"
                    aria-pressed={selectedStore === store.id}
                    aria-label={`Select ${store.name} as pickup location`}
                    shadow="md"
                >
                    <Flex align="center">
                        <Icon as={MapPin} color={selectedStore === store.id ? "white" : "red.500"} mr={3} />
                        <Box>
                            <Text fontWeight="medium">{store.name}</Text>
                            <Text
                                fontSize="sm"
                                color={selectedStore === store.id ? "white" : "gray.600"}
                            >
                                {store.address}
                            </Text>
                            <Text
                                fontSize="xs"
                                color={selectedStore === store.id ? "white" : "gray.500"}
                                mt={1}
                            >
                                {store.hours}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            ))}
        </VStack>
    );

    // Render home delivery search and details
    const renderHomeDeliveryDetails = () => (
        <VStack spacing={4} align="stretch">
            <Heading size="sm" mb={2}>Set your delivery location</Heading>

            {/* Address search with loading state */}
            <form onSubmit={handleSearchLocation}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={Search} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Search for your address"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        borderRadius="md"
                        isDisabled={isSearching}
                    />
                    <Button
                        ml={2}
                        colorScheme="red"
                        type="submit"
                        isLoading={isSearching}
                        loadingText="Searching"
                    >
                        Search
                    </Button>
                </InputGroup>
            </form>

            {/* Error message if search fails */}
            {searchError && (
                <Box p={2} bg="red.50" color="red.600" borderRadius="md" fontSize="sm">
                    <Text>{searchError}</Text>
                </Box>
            )}

            {/* Delivery information if location is selected */}
            {homeLocation && (
                <Box bg="gray.50" p={4} borderRadius="md" borderLeft="4px solid" borderLeftColor="red.500">
                    <VStack align="start" spacing={2}>
                        <Flex align="center" gap={2}>
                            <Icon as={Car} color="red.500" />
                            <Text fontWeight="medium">Car Current Location</Text>
                        </Flex>
                        <Text fontSize="sm" ml={6}>Vienna, Austria</Text>

                        <Flex align="center" gap={2}>
                            <Icon as={MapPin} color="red.500" />
                            <Text fontWeight="medium">Delivery Location</Text>
                        </Flex>
                        <Text fontSize="sm" ml={6} fontWeight="medium">{deliveryAddress || "Custom location selected on map"}</Text>

                        <Flex align="center" gap={2}>
                            <Icon as={Route} color="red.500" />
                            <Text fontWeight="medium">Distance & Delivery Time</Text>
                        </Flex>
                        <Text fontSize="sm" ml={6}>
                            {distance && `${distance} km • Estimated delivery: ${estimatedTime}`}
                        </Text>
                    </VStack>
                </Box>
            )}
        </VStack>
    );

    return (
        <Box p={6} as="section" aria-labelledby="delivery-content-title" border="1px solid #D3D3D3" borderRadius="lg">
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    {/* Header (if needed) */}
                    <VisuallyHidden id="delivery-content-title">Delivery Options</VisuallyHidden>

                    {/* Delivery Options as RadioGroup */}
                    <FormControl as="fieldset" role="radiogroup" aria-labelledby="delivery-options-group">
                        <FormLabel as="legend" id="delivery-options-group" srOnly>Delivery Options</FormLabel>
                        <HStack spacing={6} align="stretch" width="100%" minH="100px">
                            {/* Home Delivery */}
                            <DeliveryOption
                                type="home"
                                title="Home Delivery"
                                price="€1,400"
                            // deliveryDate="Estimated Delivery: Monday, April 29 – Monday, May 13"
                            // note="No appointment needed. If your order includes extra services, delivery may align with the latest completion."
                            />

                            {/* Pick-Up Option */}
                            <DeliveryOption
                                type="pickup"
                                title="Pick-Up at Our Location"
                                price="€990"
                            // deliveryDate="Ready for Pick-Up: Wednesday, May 1 – Wednesday, May 15"
                            // note="You'll receive a notification once ready. Schedule your pick-up within 5 business days."
                            />
                        </HStack>
                    </FormControl>

                    {/* Map and Store Locations for Pickup Option */}
                    {selected === 'pickup' && (
                        <Box pt={4} borderTop="1px" borderColor="gray.100" as="section" aria-labelledby="pickup-locations-section">
                            <Heading as="h3" size="md" id="pickup-locations-section" mb={4}>
                                Pickup Locations
                            </Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                <Box>
                                    {renderStoreList()}
                                </Box>
                                <Box>
                                    {renderPickupMap()}
                                </Box>
                            </SimpleGrid>
                            {selectedStore && (
                                <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                                    <Flex align="center">
                                        <Icon as={Info} color="blue.500" mr={2} />
                                        <Text fontSize="sm">
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
                        <Box pt={4} borderTop="1px" borderColor="gray.100" as="section" aria-labelledby="home-delivery-section">
                            <Heading as="h3" size="md" id="home-delivery-section" mb={4}>
                                Home Delivery Details
                            </Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
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
                        <Box pt={4} borderTop="1px" borderColor="gray.100" as="section" aria-labelledby="address-section">
                            <FormControl>
                                <FormLabel htmlFor="same-address" id="address-section" fontSize="sm" fontWeight="medium" color="gray.700">
                                    <Checkbox
                                        id="same-address"
                                        isChecked={sameAddress}
                                        onChange={(e) => setSameAddress(e.target.checked)}
                                        colorScheme="red"
                                        size="md"
                                        sx={{
                                            '.chakra-checkbox__control': {
                                                borderColor: sameAddress ? 'red.500' : 'gray.400',
                                                backgroundColor: sameAddress ? 'red.500' : 'transparent',
                                            },
                                        }}
                                        aria-describedby="same-address-description"
                                    >
                                        My billing and delivery address are the same
                                    </Checkbox>
                                    <Text id="same-address-description" fontSize="xs" color="gray.500" mt={1} ml={8}>
                                        Uncheck this box if you need to provide a different delivery address
                                    </Text>
                                </FormLabel>
                            </FormControl>

                            {!sameAddress && (
                                <Box mt={4} as="fieldset">
                                    <VisuallyHidden as="legend">Delivery Address</VisuallyHidden>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <FormControl>
                                            <FormLabel htmlFor="delivery-address" fontSize="xs" color="gray.600">Delivery Address</FormLabel>
                                            <Input
                                                id="delivery-address"
                                                size="sm"
                                                borderRadius="md"
                                                placeholder="Enter delivery address"
                                                _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                                                aria-required="true"
                                                autoComplete="shipping street-address"
                                                value={deliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="delivery-city" fontSize="xs" color="gray.600">City</FormLabel>
                                            <Input
                                                id="delivery-city"
                                                size="sm"
                                                borderRadius="md"
                                                placeholder="Enter city"
                                                _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                                                aria-required="true"
                                                autoComplete="shipping address-level2"
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="delivery-postal" fontSize="xs" color="gray.600">Postal Code</FormLabel>
                                            <Input
                                                id="delivery-postal"
                                                size="sm"
                                                borderRadius="md"
                                                placeholder="Enter postal code"
                                                _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                                                aria-required="true"
                                                autoComplete="shipping postal-code"
                                                inputMode="numeric"
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="delivery-country" fontSize="xs" color="gray.600">Country</FormLabel>
                                            <Input
                                                id="delivery-country"
                                                size="sm"
                                                borderRadius="md"
                                                placeholder="Enter country"
                                                _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                                                aria-required="true"
                                                autoComplete="shipping country-name"
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
                            colorScheme="red"
                            size="lg"
                            px={12}
                            shadow="md"
                            _hover={{
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