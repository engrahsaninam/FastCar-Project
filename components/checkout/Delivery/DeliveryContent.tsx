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
    HStack,
    SimpleGrid,
    VisuallyHidden,
} from '@chakra-ui/react';
import { Package, Info } from 'lucide-react';

interface DeliveryContentProps {
    onContinue: () => void;
}

const DeliveryContent: React.FC<DeliveryContentProps> = ({ onContinue }) => {
    const [selected, setSelected] = useState<'home' | 'pickup'>('home');
    const [sameAddress, setSameAddress] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue();
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

                    {/* Address Confirmation */}
                    <Box pt={4} borderTop="1px" borderColor="gray.100" as="section" aria-labelledby="address-section">
                        <FormControl>
                            <FormLabel htmlFor="same-address" id="address-section" fontSize="sm" fontWeight="medium" color="gray.700">
                                <Checkbox
                                    id="same-address"
                                    isChecked={sameAddress}
                                    onChange={(e) => setSameAddress(e.target.checked)}
                                    colorScheme="red"
                                    size="md"
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