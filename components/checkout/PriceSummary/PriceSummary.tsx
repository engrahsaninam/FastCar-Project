import React, { useState } from 'react';
import {
    Box,
    Text,
    Flex,
    Button,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    DrawerOverlay,
    DrawerCloseButton,
    Icon,
    Badge,
    VStack,
    HStack,
    useBreakpointValue,
    Slide,
    useColorModeValue,
} from '@chakra-ui/react';
import { Info, ChevronDown, X, ChevronUp } from 'lucide-react';

interface PriceSummaryContentProps {
    isMobile?: boolean;
}

interface ServiceItem {
    label: string;
    price: string;
    hasDropdown?: boolean;
    isFree?: boolean;
}

const PriceSummaryContent: React.FC<PriceSummaryContentProps> = ({ isMobile = false }) => {
    const services: ServiceItem[] = [
        { label: 'Home delivery', price: 'CZK 15,005', hasDropdown: true },
        { label: '12 liters of fuel', price: 'FREE', isFree: true },
        { label: 'Import MOT', price: 'CZK 4,490' },
        { label: 'Administration Fee', price: 'CZK 800' },
        { label: 'Car registration', price: 'CZK 1,990' },
        { label: 'Extended warranty', price: 'FREE', isFree: true }
    ];

    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedTextColor = useColorModeValue("gray.600", "gray.400");
    const lightMutedTextColor = useColorModeValue("gray.500", "gray.500");
    const redTextColor = useColorModeValue("red.600", "red.300");
    const redBgLight = useColorModeValue("red.50", "red.900");
    const redBorderLight = useColorModeValue("red.100", "red.800");
    const greenBgLight = useColorModeValue("green.50", "green.900");
    const greenTextColor = useColorModeValue("green.600", "green.300");
    const greenBorderLight = useColorModeValue("green.100", "green.800");
    const hoverBgColor = useColorModeValue("gray.50", "gray.700");

    // Additional color values
    const premiumHeaderBgGradient = useColorModeValue(
        "linear(to-br, red.500, red.600, red.700)",
        "linear(to-br, red.700, red.600, red.500)"
    );
    const gray50BgColor = useColorModeValue("gray.50", "gray.700");
    const grayTextColor = useColorModeValue("gray.700", "gray.300");
    const darkGrayTextColor = useColorModeValue("gray.800", "gray.200");

    return (
        <Box
            bg={bgColor}
            borderRadius={isMobile ? "none" : "xl"}
            boxShadow={isMobile ? "none" : "xl"}
            p={7}
            mt={10}
        >
            {/* Premium Header */}
            <Box
                bgGradient={premiumHeaderBgGradient}
                borderRadius="xl"
                p={6}
                mb={3}
                position="relative"
                overflow="hidden"
            >
                {/* Decorative elements */}
                <Box
                    position="absolute"
                    top={0}
                    right={0}
                    w="32"
                    h="32"
                    bg="whiteAlpha.100"
                    borderRadius="full"
                    transform="translate(4rem, -4rem)"
                />
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    w="24"
                    h="24"
                    bg="blackAlpha.100"
                    borderRadius="full"
                    transform="translate(-3rem, 3rem)"
                />

                <Box position="relative">
                    <Text fontSize="sm" fontWeight="medium" color="red.100" opacity={0.9}>
                        TOTAL PRICE INCL. SERVICES
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" mt={2} color="white" letterSpacing="tight">
                        CZK 647,765
                    </Text>
                    <Text fontSize="xs" color="red.100" opacity={0.8} mt={1.5}>
                        CZK 542,965 without VAT
                    </Text>
                </Box>
            </Box>

            {/* Car details */}
            <Box borderBottom="1px" borderColor={borderColor} mb={1}>
                <Text fontSize="md" fontWeight="semibold" color={textColor} mb={3}>
                    Mercedes-Benz A 200 d 110 kW
                </Text>
                <VStack spacing={1} align="stretch">
                    <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color={mutedTextColor}>Price incl. necessary import services</Text>
                        <Text fontSize="sm" fontWeight="semibold" color={textColor}>CZK 634,490</Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color={lightMutedTextColor}>Price without VAT</Text>
                        <Text fontSize="sm" color={lightMutedTextColor}>CZK 447,915</Text>
                    </Flex>
                    <Flex align="center" gap={1} mt={2} bg={gray50BgColor} rounded="lg">
                        <Text fontSize="xs" color={mutedTextColor}>The price is recalculated from 25.65 €/CZK</Text>
                        <Icon as={Info} w={3.5} h={3.5} color={lightMutedTextColor} aria-label="info-Icon" />
                    </Flex>
                </VStack>
            </Box>

            {/* CarAudit */}
            <Box borderBottom="1px" borderColor={borderColor} >
                <Flex
                    justify="space-between"
                    align="center"
                    p={1}
                    rounded="lg"
                    _hover={{ bg: hoverBgColor, opacity: 0.4 }}
                    transition="all 0.3s"
                >
                    <Text fontSize="sm" fontWeight="medium" color={darkGrayTextColor}>CarAudit™</Text>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>CZK 1,990</Text>
                </Flex>
            </Box>

            {/* Additional Services */}
            <Box mb={2}>
                <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color={lightMutedTextColor}
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb={1}
                >
                    Additional Services
                </Text>
                <VStack spacing={1} align="stretch">
                    {services.map((service, index) => (
                        <Flex
                            key={index}
                            justify="space-between"
                            align="center"
                            p={1}
                            _hover={{ bg: hoverBgColor }}
                            rounded="lg"
                            transition="all 0.3s"
                        >
                            <HStack spacing={2}>
                                <Text fontSize="sm" color={grayTextColor}>{service.label}</Text>
                                {service.hasDropdown && (
                                    <Icon as={ChevronDown} w={4} h={4} color={lightMutedTextColor} />
                                )}
                            </HStack>
                            {service.isFree ? (
                                <Badge
                                    px={2.5}
                                    py={1}
                                    colorScheme="green"
                                    variant="solid"
                                    fontSize="xs"
                                    fontWeight="medium"
                                >
                                    {service.price}
                                </Badge>
                            ) : (
                                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                    {service.price}
                                </Text>
                            )}
                        </Flex>
                    ))}
                </VStack>
            </Box>

            {/* Optional Services */}
            <Box
                bg={gray50BgColor}
                opacity={0.5}
                rounded="xl"
                p={4}
            >
                <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color={lightMutedTextColor}
                    textTransform="uppercase"
                    letterSpacing="wider"
                >
                    Optional Services
                </Text>
                <Text fontSize="xs" color={mutedTextColor}>
                    Other recommended services can be selected in the car order
                </Text>
            </Box>

            {/* Total Price */}
            <Box borderTop="1px" borderColor={borderColor} >
                <Flex justify="space-between" align="center">
                    <Text fontSize="md" fontWeight="medium" color={darkGrayTextColor}>
                        Total price
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={redTextColor}>
                        CZK 667,765
                    </Text>
                </Flex>
            </Box>

            {/* Financing Note */}
            <Box
                bg={redBgLight}
                rounded="xl"
                p={5}
                border="1px"
                borderColor={redBorderLight}
                opacity={0.5}
            >
                <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" color={grayTextColor}>
                        You are financing car for example for
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color={redTextColor}>
                        CZK 5,557/mo
                    </Text>
                </Flex>
                <Flex align="center" gap={0.5}>
                    <Text fontSize="xs" color={mutedTextColor}>
                        120%, 48 instalments
                    </Text>
                    <Icon as={Info} w={3.5} h={3.5} color={lightMutedTextColor} aria-label="info-Icon" />
                </Flex>
            </Box>
        </Box>
    );
};

// Custom mobile drawer component similar to the Tailwind version
interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, children }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const overlayBg = useColorModeValue("blackAlpha.600", "blackAlpha.800");
    const textColor = useColorModeValue("gray.900", "white");
    const handleBgColor = useColorModeValue("gray.300", "gray.600");
    const boxShadowColor = useColorModeValue("0 -4px 6px -1px rgba(0, 0, 0, 0.05)", "0 -4px 6px -1px rgba(0, 0, 0, 0.3)");

    return (
        <>
            <Box
                position="fixed"
                inset="0"
                bg={overlayBg}
                zIndex={50}
                transition="all 0.3s"
                opacity={isOpen ? 1 : 0}
                pointerEvents={isOpen ? "auto" : "none"}
                onClick={onClose}
                display={{ md: "none" }}
            />
            <Box
                position="fixed"
                bottom="0"
                left="0"
                right="0"
                bg={bgColor}
                borderTopRadius="2xl"
                transition="transform 0.3s"
                transform={isOpen ? "translateY(0)" : "translateY(100%)"}
                zIndex={51}
                display={{ md: "none" }}
                maxHeight="90vh"
                overflow="hidden"
            >
                {/* Handle at the top for swipe gesture */}
                <Box
                    width="36px"
                    height="4px"
                    bg={handleBgColor}
                    borderRadius="full"
                    mx="auto"
                    mt={2}
                    mb={2}
                />

                <Flex justify="space-between" align="center" p={4} borderBottom="1px" borderColor={borderColor}>
                    <Text fontSize="lg" fontWeight="semibold" color={textColor}>Price Summary</Text>
                    <Button variant="ghost" p={1} onClick={onClose} aria-label="Close drawer">
                        <Icon as={X} w={5} h={5} />
                    </Button>
                </Flex>
                <Box p={0} overflowY="auto" maxHeight="calc(90vh - 160px)">
                    {children}
                </Box>

                {/* Bottom close button for easier mobile access */}
                <Box
                    py={2}
                    px={4}
                    pb={3}
                    borderTop="1px"
                    borderColor={borderColor}
                    bg={bgColor}
                    position="sticky"
                    bottom="0"
                    width="100%"
                    textAlign="center"
                    boxShadow={boxShadowColor}
                >
                    <Button
                        onClick={onClose}
                        colorScheme="red"
                        size="xs"
                        width="auto"
                        minW="80px"
                        height="20px"
                        fontSize="xs"
                        borderRadius="full"
                        boxShadow="sm"
                        _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                        _active={{ transform: "translateY(1px)" }}
                        aria-label="Close summary"
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </>
    );
};

const PriceSummary: React.FC = () => {
    return (
        <>
            {/* Desktop Version */}
            <Box display={{ base: 'none', md: 'block' }} position="sticky" top={4}>
                <PriceSummaryContent />
            </Box>

            {/* Mobile Version - Inline above footer */}
            <Box display={{ base: 'block', md: 'none' }}>
                <PriceSummaryContent isMobile />
            </Box>
        </>
    );
};

export default PriceSummary; 