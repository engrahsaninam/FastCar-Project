import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { Package, Info, MapPin } from 'lucide-react';
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

const DeliveryContent: React.FC<DeliveryContentProps> = ({ onContinue }) => {
    const [selected, setSelected] = useState<'home' | 'pickup'>('home');
    const [sameAddress, setSameAddress] = useState(true);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate if a store is selected for pickup option
        if (selected === 'pickup' && selectedStore === null) {
            alert('Please select a pickup location');
            return;
        }
        onContinue();
    };

    const handleStoreSelect = (storeId: number) => {
        setSelectedStore(storeId);
    };

    const DeliveryOption = ({
        type,
        title,
        price,
        description,
        deliveryDate,
        note
    }: {
        type: 'home' | 'pickup';
        title: string;
        price: string;
        description: string;
        deliveryDate: string;
        note: string;
    }) => (
        <Box
            as="label"
            borderWidth="1px"
            borderRadius="md"
            p={5}
            cursor="pointer"
            transition="all 0.2s"
            onClick={() => setSelected(type)}
            borderColor={selected === type ? "red.500" : "gray.300"}
            bg={selected === type ? "red.50" : "white"}
            shadow="md"
            _hover={{
                borderColor: "red.500",
                bg: "red.50",
                shadow: "lg"
            }}
            _active={{
                transform: "scale(0.98)",
                shadow: "sm"
            }}
            htmlFor={`delivery-${type}`}
            role="radio"
            aria-checked={selected === type}
        >
            <Flex justify="space-between" align="center">
                <HStack spacing={4}>
                    <Flex
                        w="20px"
                        h="20px"
                        borderRadius="full"
                        borderWidth="6px"
                        borderColor={selected === type ? "red.500" : "gray.300"}
                        bg={selected === type ? "red.500" : "white"}
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.2s"
                        aria-hidden="true"
                    >
                        <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg="white"
                        />
                    </Flex>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" color="#1A202C">{title}</Text>
                        <Text color="gray.700" mt={2}>
                            {description}
                        </Text>
                        <Flex align="center" gap={2} mt={3}>
                            <Icon as={Package} w={4} h={4} color="gray.500" aria-hidden="true" />
                            <Text fontSize="sm" color="gray.600">
                                {deliveryDate}
                            </Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                            {note}
                        </Text>
                    </Box>
                </HStack>
                <Text fontSize="sm" fontWeight="semibold">{price}</Text>
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

    // Render the map component
    const renderMap = () => {
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
                    borderColor={selectedStore === store.id ? "red.500" : "gray.200"}
                    bg={selectedStore === store.id ? "red.50" : "white"}
                    onClick={() => handleStoreSelect(store.id)}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ borderColor: "red.300", bg: "red.50" }}
                    role="button"
                    aria-pressed={selectedStore === store.id}
                    aria-label={`Select ${store.name} as pickup location`}
                >
                    <Flex align="center">
                        <Icon as={MapPin} color="red.500" mr={3} />
                        <Box>
                            <Text fontWeight="medium">{store.name}</Text>
                            <Text fontSize="sm" color="gray.600">{store.address}</Text>
                            <Text fontSize="xs" color="gray.500" mt={1}>{store.hours}</Text>
                        </Box>
                    </Flex>
                </Box>
            ))}
        </VStack>
    );

    return (
        <Box p={6} as="section" aria-labelledby="delivery-content-title">
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    {/* Header (if needed) */}
                    <VisuallyHidden id="delivery-content-title">Delivery Options</VisuallyHidden>

                    {/* Delivery Options as RadioGroup */}
                    <FormControl as="fieldset" role="radiogroup" aria-labelledby="delivery-options-group">
                        <FormLabel as="legend" id="delivery-options-group" srOnly>Delivery Options</FormLabel>
                        <VStack spacing={6} align="stretch">
                            {/* Home Delivery */}
                            <DeliveryOption
                                type="home"
                                title="Home Delivery"
                                price="€1,400"
                                description="We'll deliver your vehicle directly to your home address. Perfect for a hands-off experience — we handle the logistics."
                                deliveryDate="Estimated Delivery: Monday, April 29 – Monday, May 13"
                                note="No appointment needed. If your order includes extra services, delivery may align with the latest completion."
                            />

                            {/* Pick-Up Option */}
                            <DeliveryOption
                                type="pickup"
                                title="Pick-Up at Our Location"
                                price="€990"
                                description="Pick up your vehicle from one of our authorized locations. Great if you'd like to inspect it before driving home."
                                deliveryDate="Ready for Pick-Up: Wednesday, May 1 – Wednesday, May 15"
                                note="You'll receive a notification once ready. Schedule your pick-up within 5 business days."
                            />
                        </VStack>
                    </FormControl>

                    {/* Map and Store Locations (Conditionally rendered) */}
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
                                    {renderMap()}
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

                    {/* Address Confirmation */}
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
                            isDisabled={selected === 'pickup' && selectedStore === null}
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