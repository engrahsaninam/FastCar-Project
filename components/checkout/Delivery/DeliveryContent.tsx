import React, { useState } from 'react';
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
    Radio,
    HStack,
    SimpleGrid,
} from '@chakra-ui/react';
import { Package, Info } from 'lucide-react';

interface DeliveryContentProps {
    onContinue: () => void;
}

const DeliveryContent: React.FC<DeliveryContentProps> = ({ onContinue }) => {
    const [selected, setSelected] = useState<'home' | 'pickup'>('home');
    const [sameAddress, setSameAddress] = useState(true);

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
            borderWidth="1px"
            borderRadius="xl"
            p={5}
            cursor="pointer"
            transition="all 0.2s"
            onClick={() => setSelected(type)}
            borderColor={selected === type ? "red.500" : "gray.200"}
            bg={selected === type ? "red.50" : "white"}
            _hover={{
                borderColor: "red.500",
                bg: "red.50"
            }}
        >
            <Flex justify="space-between" align="center">
                <HStack spacing={4}>
                    <Radio
                        colorScheme="red"
                        isChecked={selected === type}
                        onChange={() => setSelected(type)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <Box>
                        <Text fontSize="lg" fontWeight="medium">{title}</Text>
                        <Text color="gray.700" mt={2}>
                            {description}
                        </Text>
                        <Flex align="center" gap={2} mt={3}>
                            <Icon as={Package} w={4} h={4} color="gray.500" />
                            <Text fontSize="sm" color="gray.600">
                                {deliveryDate}
                            </Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                            {note}
                        </Text>
                    </Box>
                </HStack>
                <Text fontSize="lg" fontWeight="semibold">{price}</Text>
            </Flex>
        </Box>
    );

    return (
        <Box p={6}>
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

                {/* Address Confirmation */}
                <Box pt={4} borderTop="1px" borderColor="gray.100">
                    <Checkbox
                        isChecked={sameAddress}
                        onChange={(e) => setSameAddress(e.target.checked)}
                        colorScheme="red"
                        size="md"
                    >
                        <Text fontSize="sm" color="gray.700" ml={2}>
                            My billing and delivery address are the same
                        </Text>
                    </Checkbox>

                    {!sameAddress && (
                        <Box mt={4} ml={8}>
                            <SimpleGrid columns={2} spacing={4}>
                                <FormControl>
                                    <FormLabel fontSize="xs" color="gray.600">Delivery Address</FormLabel>
                                    <Input
                                        size="sm"
                                        borderRadius="md"
                                        placeholder="Enter delivery address"
                                        _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="xs" color="gray.600">City</FormLabel>
                                    <Input
                                        size="sm"
                                        borderRadius="md"
                                        placeholder="Enter city"
                                        _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="xs" color="gray.600">Postal Code</FormLabel>
                                    <Input
                                        size="sm"
                                        borderRadius="md"
                                        placeholder="Enter postal code"
                                        _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="xs" color="gray.600">Country</FormLabel>
                                    <Input
                                        size="sm"
                                        borderRadius="md"
                                        placeholder="Enter country"
                                        _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                                    />
                                </FormControl>
                            </SimpleGrid>
                        </Box>
                    )}
                </Box>

                {/* Continue Button */}
                <Flex justify="center" mt={6}>
                    <Button
                        colorScheme="red"
                        size="lg"
                        px={12}
                        onClick={onContinue}
                    >
                        Continue
                    </Button>
                </Flex>
            </VStack>
        </Box>
    );
};

export default DeliveryContent; 