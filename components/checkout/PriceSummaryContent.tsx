// File: components/PriceSummary/PriceSummaryContent.tsx
import {
    Box,
    Flex,
    Heading,
    Text,
    Badge,
    Stack,
    Divider,
    Icon,
    VStack,
} from '@chakra-ui/react';
import { Info, ChevronDown } from 'lucide-react';

const PriceSummaryContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const containerStyles = isMobile ? { bg: 'white' } : { bg: 'white', rounded: '2xl', boxShadow: 'xl' };

    const additionalServices = [
        { label: 'Home delivery', price: 'CZK 15,005', hasDropdown: true },
        { label: '12 liters of fuel', price: 'FREE', isFree: true },
        { label: 'Import MOT', price: 'CZK 4,490' },
        { label: 'Administration Fee', price: 'CZK 800' },
        { label: 'Car registration', price: 'CZK 1,990' },
        { label: 'Extended warranty', price: 'FREE', isFree: true },
    ];

    return (
        <Box p={7} {...containerStyles}>
            {/* Total Price Section */}
            <Box
                bgGradient="linear(to-br, red.500, red.600, red.700)"
                borderRadius="xl"
                p={6}
                mb={7}
                position="relative"
                overflow="hidden"
            >
                <Box position="absolute" top={0} right={0} w={32} h={32} bg="whiteAlpha.200" borderRadius="full" transform="translate(4rem, -4rem)" />
                <Box position="absolute" bottom={0} left={0} w={24} h={24} bg="blackAlpha.200" borderRadius="full" transform="translate(-3rem, 3rem)" />

                <Box position="relative">
                    <Text fontSize="sm" color="red.100" fontWeight="medium">
                        TOTAL PRICE INCL. SERVICES
                    </Text>
                    <Heading mt={2} size="xl" color="white">
                        CZK 647,765
                    </Heading>
                    <Text mt={1.5} fontSize="xs" color="red.100">
                        CZK 542,965 without VAT
                    </Text>
                </Box>
            </Box>

            {/* Car Info */}
            <Box borderBottom="1px" borderColor="gray.100" pb={5} mb={5}>
                <Text fontSize="md" fontWeight="semibold" mb={3}>
                    Mercedes-Benz A 200 d 110 kW
                </Text>
                <VStack spacing={2.5} align="stretch">
                    <Flex justify="space-between">
                        <Text fontSize="sm" color="gray.600">Price incl. necessary import services</Text>
                        <Text fontSize="sm" fontWeight="semibold">CZK 634,490</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text fontSize="sm" color="gray.500">Price without VAT</Text>
                        <Text fontSize="sm" color="gray.500">CZK 447,915</Text>
                    </Flex>
                    <Flex align="center" gap={1.5} p={2.5} bg="gray.50" borderRadius="lg">
                        <Text fontSize="xs" color="gray.600">The price is recalculated from 25.65 €/CZK</Text>
                        <Icon as={Info} w={3.5} h={3.5} color="gray.400" aria-label="Icon" />
                    </Flex>
                </VStack>
            </Box>

            {/* CarAudit */}
            <Box borderBottom="1px" borderColor="gray.100" pb={5} mb={5}>
                <Flex justify="space-between" p={2.5} borderRadius="lg" _hover={{ bg: 'red.50' }}>
                    <Text fontSize="sm" fontWeight="medium">CarAudit™</Text>
                    <Text fontSize="sm" fontWeight="semibold">CZK 1,990</Text>
                </Flex>
            </Box>

            {/* Additional Services */}
            <Box mb={7}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={4}>
                    Additional Services
                </Text>
                <Stack spacing={3}>
                    {additionalServices.map((service, i) => (
                        <Flex
                            key={i}
                            justify="space-between"
                            align="center"
                            p={2.5}
                            borderRadius="lg"
                            _hover={{ bg: '#e6f7ff' }}
                        >
                            <Flex align="center" gap={2}>
                                <Text fontSize="sm" color="gray.700">{service.label}</Text>
                                {service.hasDropdown && <Icon as={ChevronDown} w={4} h={4} color="gray.400" aria-label="Icon" />}
                            </Flex>
                            {service.isFree ? (
                                <Badge
                                    px={2.5}
                                    py={1}
                                    colorScheme="green"
                                    fontSize="xs"
                                    borderRadius="full"
                                    boxShadow="sm"
                                >
                                    {service.price}
                                </Badge>
                            ) : (
                                <Text fontSize="sm" fontWeight="medium">{service.price}</Text>
                            )}
                        </Flex>
                    ))}
                </Stack>
            </Box>

            {/* Optional Services */}
            <Box bgGradient="linear(to-br, gray.50, gray.100)" borderRadius="xl" p={4} mb={7}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={1}>
                    Optional Services
                </Text>
                <Text fontSize="xs" color="gray.600">
                    Other recommended services can be selected in the car order
                </Text>
            </Box>

            {/* Total */}
            <Box borderTop="1px" borderColor="gray.100" pt={5} mb={7}>
                <Flex justify="space-between" align="center">
                    <Text fontSize="md" fontWeight="medium">Total price</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="red.600">CZK 667,765</Text>
                </Flex>
            </Box>

            {/* Financing Note */}
            <Box bgGradient="linear(to-br, red.50, red.50, transparent)" borderRadius="xl" p={5} border="1px" borderColor="red.100">
                <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm">You are financing car for example for</Text>
                    <Text fontSize="base" fontWeight="bold" color="red.600">CZK 5,557/mo</Text>
                </Flex>
                <Flex align="center" gap={1.5} fontSize="xs" color="gray.600">
                    <Text>120%, 48 instalments</Text>
                    <Icon as={Info} w={3.5} h={3.5} color="gray.400" />
                </Flex>
            </Box>
        </Box>
    );
};

export default PriceSummaryContent;
