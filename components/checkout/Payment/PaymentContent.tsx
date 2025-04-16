import React, { useState } from 'react';
import {
    Box,
    Text,
    VStack,
    Flex,
    Button,
    Input,
    FormControl,
    FormLabel,
    SimpleGrid,
    Image,
    Divider,
    HStack,
    IconButton,
    Collapse,
    VisuallyHidden,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

interface PaymentContentProps {
    onConfirm: () => void;
}

const PaymentContent: React.FC<PaymentContentProps> = ({ onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'manual'>('stripe');
    const [showStripeForm, setShowStripeForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'stripe' && !showStripeForm) {
            setShowStripeForm(true);
            return;
        }
        onConfirm();
    };

    const handleBackToPaymentMethods = () => {
        setShowStripeForm(false);
    };

    const PaymentOption = ({
        type,
        title,
        icon
    }: {
        type: 'stripe' | 'manual';
        title: string;
        icon: string;
    }) => (
        <Box
            as="label"
            htmlFor={`payment-${type}`}
            flex="1"
            borderWidth="1px"
            borderRadius="md"
            p={4}
            fontWeight="medium"
            cursor="pointer"
            transition="all 0.2s"
            onClick={() => setPaymentMethod(type)}
            borderColor={paymentMethod === type ? "red.500" : "gray.300"}
            bg={paymentMethod === type ? "#ffe5e5" : "white"}
            shadow="md"
            _hover={{
                borderColor: "red.500",
                bg: "#e6f7ff",
                shadow: "lg"
            }}
            _active={{
                shadow: "sm",
                transform: "scale(0.98)"
            }}
            role="radio"
            aria-checked={paymentMethod === type}
        >
            <input
                type="radio"
                id={`payment-${type}`}
                name="payment-method"
                value={type}
                checked={paymentMethod === type}
                onChange={() => setPaymentMethod(type)}
                style={{ position: 'absolute', opacity: 0 }}
                aria-label={title}
            />
            {icon} {title}
        </Box>
    );

    // Simulated Stripe payment form
    const StripePaymentForm = () => (
        <Box borderWidth="1px" borderRadius="xl" overflow="hidden">
            {/* Stripe-like header */}
            <Box bg="red.500" p={4}>
                <Flex justify="space-between" align="center">
                    <IconButton
                        aria-label="Go back to payment methods"
                        icon={<ChevronLeftIcon />}
                        size="sm"
                        variant="ghost"
                        color="white"
                        onClick={handleBackToPaymentMethods}
                    />
                    <Text color="white" fontWeight="bold">Secure Checkout</Text>
                    <Box w="24px" /> {/* Spacer for alignment */}
                </Flex>
            </Box>

            {/* Stripe form content */}
            <Box p={6} bg="white">
                <VStack spacing={6} align="stretch" as="fieldset">
                    <VisuallyHidden as="legend">Credit Card Payment Information</VisuallyHidden>

                    {/* Card information */}
                    <Box as="section" aria-labelledby="card-info-heading">
                        <FormLabel id="card-info-heading" fontSize="sm" fontWeight="medium" mb={2}>Card Information</FormLabel>
                        <FormControl mb={3}>
                            <FormLabel htmlFor="card-number" srOnly>Card Number</FormLabel>
                            <Input
                                id="card-number"
                                placeholder="1234 1234 1234 1234"
                                size="md"
                                bg="white"
                                borderColor="gray.300"
                                aria-required="true"
                                inputMode="numeric"
                                pattern="[0-9\s]{13,19}"
                                maxLength={19}
                                autoComplete="cc-number"
                            />
                        </FormControl>
                        <SimpleGrid columns={2} spacing={3}>
                            <FormControl>
                                <FormLabel htmlFor="card-expiry" srOnly>Expiration Date</FormLabel>
                                <Input
                                    id="card-expiry"
                                    placeholder="MM / YY"
                                    size="md"
                                    bg="white"
                                    borderColor="gray.300"
                                    aria-required="true"
                                    inputMode="numeric"
                                    pattern="[0-9]{2}\/[0-9]{2}"
                                    maxLength={5}
                                    autoComplete="cc-exp"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="card-cvc" srOnly>CVC Security Code</FormLabel>
                                <Input
                                    id="card-cvc"
                                    placeholder="CVC"
                                    size="md"
                                    bg="white"
                                    borderColor="gray.300"
                                    aria-required="true"
                                    inputMode="numeric"
                                    pattern="[0-9]{3,4}"
                                    maxLength={4}
                                    autoComplete="cc-csc"
                                />
                            </FormControl>
                        </SimpleGrid>
                    </Box>

                    {/* Billing information */}
                    {/* <Box as="section" aria-labelledby="billing-info-heading">
                        <FormLabel id="billing-info-heading" fontSize="sm" fontWeight="medium" mb={2}>Billing Information</FormLabel>
                        <FormControl mb={3}>
                            <FormLabel htmlFor="card-name" srOnly>Name on Card</FormLabel>
                            <Input
                                id="card-name"
                                placeholder="Name on card"
                                size="md"
                                bg="white"
                                borderColor="gray.300"
                                aria-required="true"
                                autoComplete="cc-name"
                            />
                        </FormControl>
                        <FormControl mb={3}>
                            <FormLabel htmlFor="billing-address" srOnly>Billing Address</FormLabel>
                            <Input
                                id="billing-address"
                                placeholder="Billing address"
                                size="md"
                                bg="white"
                                borderColor="gray.300"
                                aria-required="true"
                                autoComplete="street-address"
                            />
                        </FormControl>
                        <SimpleGrid columns={3} spacing={3}>
                            <FormControl>
                                <FormLabel htmlFor="billing-city" srOnly>City</FormLabel>
                                <Input
                                    id="billing-city"
                                    placeholder="City"
                                    size="md"
                                    bg="white"
                                    borderColor="gray.300"
                                    aria-required="true"
                                    autoComplete="address-level2"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="billing-postal" srOnly>Postal Code</FormLabel>
                                <Input
                                    id="billing-postal"
                                    placeholder="Postal code"
                                    size="md"
                                    bg="white"
                                    borderColor="gray.300"
                                    aria-required="true"
                                    autoComplete="postal-code"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="billing-country" srOnly>Country</FormLabel>
                                <Input
                                    id="billing-country"
                                    placeholder="Country"
                                    size="md"
                                    bg="white"
                                    borderColor="gray.300"
                                    aria-required="true"
                                    autoComplete="country-name"
                                />
                            </FormControl>
                        </SimpleGrid>
                    </Box> */}

                    {/* Pay button */}
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
                        aria-label="Complete payment"
                    >
                        Confirm Payment
                    </Button>

                    {/* Secure notice */}
                    <Flex align="center" justify="center" fontSize="xs" color="gray.500">
                        <Box as="span" mr={1} aria-hidden="true">🔒</Box>
                        <Text>Payments are secure and encrypted</Text>
                    </Flex>

                    {/* Payment methods */}
                    <HStack spacing={2} justify="center" aria-label="Accepted payment methods">
                        <Box as="span" opacity={0.7} aria-label="Visa">
                            <svg viewBox="0 0 32 21" width="32" height="21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect fill="#1A1F71" width="32" height="21" rx="3" />
                                <path fill="#FFFFFF" d="M2 9h5v3H2z" />
                                <path fill="#FFFFFF" d="M8 8h5v5H8z" />
                                <path fill="#FFFFFF" d="M14 7h5v7h-5z" />
                                <path fill="#FFFFFF" d="M20 9h5v3h-5z" />
                                <path fill="#FFFFFF" d="M26 7h4v7h-4z" />
                            </svg>
                        </Box>
                        <Box as="span" opacity={0.7} aria-label="Mastercard">
                            <svg viewBox="0 0 32 21" width="32" height="21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect fill="#FFB700" width="32" height="21" rx="3" />
                                <circle fill="#FFFFFF" cx="12" cy="10.5" r="4" />
                                <circle fill="#FFFFFF" cx="20" cy="10.5" r="4" />
                                <path fill="#FF5F00" d="M16 13c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                            </svg>
                        </Box>
                        <Box as="span" opacity={0.7} aria-label="American Express">
                            <svg viewBox="0 0 32 21" width="32" height="21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect fill="#007AFF" width="32" height="21" rx="3" />
                                <path fill="#FFFFFF" d="M16 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" />
                                <path fill="#007AFF" d="M16 13c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                            </svg>
                        </Box>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );

    return (
        <Box p={6} as="section" aria-labelledby="payment-section-title">
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    {!showStripeForm ? (
                        <>
                            {/* Description */}
                            <Text color="gray.700" fontSize="sm" id="payment-section-title">
                                Choose how you'd like to complete your purchase. Payments are secure and encrypted.
                            </Text>

                            {/* Payment Method Selection */}
                            <FormControl as="fieldset" role="radiogroup" aria-labelledby="payment-method-group">
                                <FormLabel as="legend" id="payment-method-group" srOnly>Payment Method</FormLabel>
                                <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                                    <PaymentOption
                                        type="stripe"
                                        title="Pay with Stripe (Recommended)"
                                        icon="💳"
                                    />
                                    <PaymentOption
                                        type="manual"
                                        title="Enter Card Details Manually"
                                        icon="✍️"
                                    />
                                </Flex>
                            </FormControl>

                            {/* Stripe Payment Option */}
                            {paymentMethod === 'stripe' && (
                                <Box p={4} borderWidth="1px" borderRadius="xl" bg="gray.50">
                                    <Text color="gray.700" mb={2}>
                                        You'll be redirected to Stripe's secure checkout to complete your payment.
                                    </Text>
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
                                        width="full"
                                        py={3}
                                        fontWeight="semibold"
                                        aria-label="Continue to Stripe payment"
                                    >
                                        Proceed with Stripe
                                    </Button>
                                </Box>
                            )}

                            {/* Manual Payment Option */}
                            {paymentMethod === 'manual' && (
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} as="fieldset">
                                    <VisuallyHidden as="legend">Payment Card Details</VisuallyHidden>
                                    <FormControl>
                                        <FormLabel htmlFor="manual-name" fontSize="xs" color="gray.600">Cardholder Name</FormLabel>
                                        <Input
                                            id="manual-name"
                                            placeholder="Enter cardholder name"
                                            size="md"
                                            aria-required="true"
                                            autoComplete="cc-name"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="manual-number" fontSize="xs" color="gray.600">Card Number</FormLabel>
                                        <Input
                                            id="manual-number"
                                            placeholder="Enter card number"
                                            size="md"
                                            aria-required="true"
                                            inputMode="numeric"
                                            pattern="[0-9\s]{13,19}"
                                            maxLength={19}
                                            autoComplete="cc-number"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="manual-expiry" fontSize="xs" color="gray.600">Expiration Date (MM/YY)</FormLabel>
                                        <Input
                                            id="manual-expiry"
                                            placeholder="MM/YY"
                                            size="md"
                                            aria-required="true"
                                            inputMode="numeric"
                                            pattern="[0-9]{2}\/[0-9]{2}"
                                            maxLength={5}
                                            autoComplete="cc-exp"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="manual-cvc" fontSize="xs" color="gray.600">CVC</FormLabel>
                                        <Input
                                            id="manual-cvc"
                                            placeholder="CVC"
                                            size="md"
                                            type="password"
                                            aria-required="true"
                                            inputMode="numeric"
                                            pattern="[0-9]{3,4}"
                                            maxLength={4}
                                            autoComplete="cc-csc"
                                        />
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        gridColumn={{ md: 'span 2' }}
                                        width="full"
                                        colorScheme="red"
                                        size="lg"
                                        px={12}
                                        shadow="md"
                                        py={3}
                                        fontWeight="semibold"
                                        _hover={{
                                            shadow: "lg",
                                            transform: "translateY(-1px)"
                                        }}
                                        _active={{
                                            shadow: "sm",
                                            transform: "translateY(1px)"
                                        }}
                                        aria-label="Complete manual payment"
                                        mt={4}
                                    >
                                        Confirm Payment
                                    </Button>
                                </SimpleGrid>
                            )}
                        </>
                    ) : (
                        <StripePaymentForm />
                    )}
                </VStack>
            </form>
        </Box>
    );
};

PaymentContent.displayName = 'PaymentContent';

export default PaymentContent; 