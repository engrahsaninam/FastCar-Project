import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Flex,
    Button,
    useColorModeValue,
    Divider,
    List,
    ListItem,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

interface PaymentContentProps {
    onConfirm: () => void;
    carPrice: number;
    deliveryPrice: number;
    additionalServices: Array<{
        title: string;
        price: number;
    }>;
    isFinancing: boolean;
    financingDetails?: {
        monthlyPayment: number;
        term: number;
        apr: number;
    };
}

const PaymentContent: React.FC<PaymentContentProps> = ({
    onConfirm,
    carPrice,
    deliveryPrice,
    additionalServices,
    isFinancing,
    financingDetails,
}) => {
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const bgColor = useColorModeValue('white', 'gray.800');

    const totalAdditionalServices = additionalServices.reduce((sum, service) => sum + service.price, 0);
    const totalPrice = carPrice + deliveryPrice + totalAdditionalServices;

    return (
        <Box p={6}>
            {/* Payment Summary */}
            <Box mb={8}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>Payment Summary</Text>
                <Box
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={6}
                    bg={bgColor}
                >
                    {/* Car Price */}
                    <Flex justify="space-between" mb={4}>
                        <Text>Car Price</Text>
                        <Text fontWeight="bold">€{carPrice.toLocaleString()}</Text>
                    </Flex>

                    {/* Delivery */}
                    <Flex justify="space-between" mb={4}>
                        <Text>Delivery</Text>
                        <Text fontWeight="bold">€{deliveryPrice.toLocaleString()}</Text>
                    </Flex>

                    {/* Additional Services */}
                    {additionalServices.map((service, index) => (
                        <Flex key={index} justify="space-between" mb={4}>
                            <Text>{service.title}</Text>
                            <Text fontWeight="bold">€{service.price.toLocaleString()}</Text>
                        </Flex>
                    ))}

                    <Divider my={4} />

                    {/* Total */}
                    <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                        <Text>Total</Text>
                        <Text>€{totalPrice.toLocaleString()}</Text>
                    </Flex>
                </Box>
            </Box>

            {/* Financing Details */}
            {isFinancing && financingDetails && (
                <Box mb={8}>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>Financing Details</Text>
                    <Box
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        p={6}
                        bg={bgColor}
                    >
                        <VStack spacing={4} align="stretch">
                            <Flex justify="space-between">
                                <Text>Monthly Payment</Text>
                                <Text fontWeight="bold">€{financingDetails.monthlyPayment.toLocaleString()}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text>Term</Text>
                                <Text fontWeight="bold">{financingDetails.term} months</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text>APR</Text>
                                <Text fontWeight="bold">{financingDetails.apr}%</Text>
                            </Flex>
                        </VStack>
                    </Box>
                </Box>
            )}

            {/* What's Next */}
            <Box mb={8}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>What's Next</Text>
                <List spacing={3}>
                    <ListItem>
                        <HStack>
                            <CheckIcon color="green.500" />
                            <Text>We'll send you a confirmation email with all the details</Text>
                        </HStack>
                    </ListItem>
                    <ListItem>
                        <HStack>
                            <CheckIcon color="green.500" />
                            <Text>Our team will contact you within 24 hours to arrange delivery</Text>
                        </HStack>
                    </ListItem>
                    <ListItem>
                        <HStack>
                            <CheckIcon color="green.500" />
                            <Text>You'll receive updates about your car's journey to you</Text>
                        </HStack>
                    </ListItem>
                </List>
            </Box>

            {/* Confirm Button */}
            <Flex justify="center">
                <Button
                    colorScheme="red"
                    size="lg"
                    onClick={onConfirm}
                    px={12}
                >
                    Confirm Purchase
                </Button>
            </Flex>
        </Box>
    );
};

export default PaymentContent; 