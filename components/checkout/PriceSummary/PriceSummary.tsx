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
} from '@chakra-ui/react';
import { Info, ChevronDown, X } from 'lucide-react';

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

    return (
        <Box
            bg="white"
            borderRadius={isMobile ? "none" : "xl"}
            boxShadow={isMobile ? "none" : "xl"}
            p={7}
        >
            {/* Premium Header */}
            <Box
                bgGradient="linear(to-br, red.500, red.600, red.700)"
                borderRadius="xl"
                p={6}
                mb={7}
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
            <Box borderBottom="1px" borderColor="gray.100" pb={5} mb={5}>
                <Text fontSize="md" fontWeight="semibold" color="gray.900" mb={3}>
                    Mercedes-Benz A 200 d 110 kW
                </Text>
                <VStack spacing={2.5} align="stretch">
                    <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.600">Price incl. necessary import services</Text>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.900">CZK 634,490</Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.500">Price without VAT</Text>
                        <Text fontSize="sm" color="gray.500">CZK 447,915</Text>
                    </Flex>
                    <Flex align="center" gap={1.5} mt={2} bg="gray.50" rounded="lg" p={2.5}>
                        <Text fontSize="xs" color="gray.600">The price is recalculated from 25.65 €/CZK</Text>
                        <Icon as={Info} w={3.5} h={3.5} color="gray.400" />
                    </Flex>
                </VStack>
            </Box>

            {/* CarAudit */}
            <Box borderBottom="1px" borderColor="gray.100" pb={5} mb={5}>
                <Flex
                    justify="space-between"
                    align="center"
                    p={2.5}
                    rounded="lg"
                    _hover={{ bg: 'red.50', opacity: 0.4 }}
                    transition="all 0.3s"
                >
                    <Text fontSize="sm" fontWeight="medium" color="gray.800">CarAudit™</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">CZK 1,990</Text>
                </Flex>
            </Box>

            {/* Additional Services */}
            <Box mb={7}>
                <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb={4}
                >
                    Additional Services
                </Text>
                <VStack spacing={3} align="stretch">
                    {services.map((service, index) => (
                        <Flex
                            key={index}
                            justify="space-between"
                            align="center"
                            p={2.5}
                            _hover={{ bg: 'gray.50' }}
                            rounded="lg"
                            transition="all 0.3s"
                        >
                            <HStack spacing={2}>
                                <Text fontSize="sm" color="gray.700">{service.label}</Text>
                                {service.hasDropdown && (
                                    <Icon as={ChevronDown} w={4} h={4} color="gray.400" />
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
                                <Text fontSize="sm" fontWeight="medium" color="gray.900">
                                    {service.price}
                                </Text>
                            )}
                        </Flex>
                    ))}
                </VStack>
            </Box>

            {/* Optional Services */}
            <Box
                bgGradient="linear(to-br, gray.50, gray.100)"
                opacity={0.5}
                rounded="xl"
                p={4}
                mb={7}
            >
                <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb={1}
                >
                    Optional Services
                </Text>
                <Text fontSize="xs" color="gray.600">
                    Other recommended services can be selected in the car order
                </Text>
            </Box>

            {/* Total Price */}
            <Box borderTop="1px" borderColor="gray.100" pt={5} mb={7}>
                <Flex justify="space-between" align="center">
                    <Text fontSize="md" fontWeight="medium" color="gray.800">
                        Total price
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="red.600">
                        CZK 667,765
                    </Text>
                </Flex>
            </Box>

            {/* Financing Note */}
            <Box
                bgGradient="linear(to-br, red.50, red.50, transparent)"
                rounded="xl"
                p={5}
                border="1px"
                borderColor="red.100"
                opacity={0.5}
            >
                <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" color="gray.700">
                        You are financing car for example for
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color="red.600">
                        CZK 5,557/mo
                    </Text>
                </Flex>
                <Flex align="center" gap={1.5}>
                    <Text fontSize="xs" color="gray.600">
                        120%, 48 instalments
                    </Text>
                    <Icon as={Info} w={3.5} h={3.5} color="gray.400" />
                </Flex>
            </Box>
        </Box>
    );
};

const PriceSummary: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <>
            {/* Desktop Version */}
            <Box display={{ base: 'none', md: 'block' }} position="sticky" top={4}>
                <PriceSummaryContent />
            </Box>

            {/* Mobile Version */}
            <Box display={{ md: 'none' }}>
                {/* Floating Total Bar */}
                <Box
                    position="fixed"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="white"
                    borderTop="1px"
                    borderColor="gray.200"
                    p={4}
                    onClick={onOpen}
                >
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text fontSize="xs" color="gray.500">Total price</Text>
                            <Text fontSize="lg" fontWeight="bold">CZK 667,765</Text>
                        </Box>
                        <Button colorScheme="red" size="sm">
                            View Details
                        </Button>
                    </Flex>
                </Box>

                {/* Mobile Drawer */}
                <Drawer
                    isOpen={isOpen}
                    placement="bottom"
                    onClose={onClose}
                    size="full"
                >
                    <DrawerOverlay />
                    <DrawerContent borderTopRadius="xl">
                        <DrawerHeader borderBottomWidth="1px">
                            <Flex justify="space-between" align="center">
                                <Text fontSize="lg" fontWeight="semibold">Price Summary</Text>
                                <DrawerCloseButton position="static" />
                            </Flex>
                        </DrawerHeader>
                        <DrawerBody p={0}>
                            <PriceSummaryContent isMobile />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Box>
        </>
    );
};

export default PriceSummary; 