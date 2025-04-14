import React from 'react';
import {
    Box,
    Text,
    Heading,
    Flex,
    Button,
    VStack,
    HStack,
    Container
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { AlertCircle } from 'lucide-react';

interface CarInspectionContentProps {
    isFinancingSelected?: boolean;
    isFinancingApproved?: boolean;
    onContinue?: () => void;
}

const CarInspectionContent: React.FC<CarInspectionContentProps> = ({
    isFinancingSelected = false,
    isFinancingApproved = false,
    onContinue = () => { }
}) => {
    // Data for inspection steps
    const steps = [
        {
            number: 1,
            title: "We get the car VIN from the dealer",
            description: "and we check the legal status in European countries to see whether the car has been stolen or crashed and we also check the mileage."
        },
        {
            number: 2,
            title: "We arrange a visit by a mechanic",
            description: "who checks the actual technical condition of the car."
        },
        {
            number: 3,
            title: "In the case of a tax-deductible car, we check,",
            description: "to see whether the car really is tax-deductible."
        },
        {
            number: 4,
            title: "You receive an inspection report",
            description: "including evaluation of the condition of the car. We assume a guarantee for this being the actual condition of the car and are liable to you for this if you subsequently decide to buy the car."
        }
    ];

    return (
        <Box>
            {/* Main content */}
            <Box>
                <Text mb={4}>
                    We want you to buy a car in the best possible condition and this is why we have to first of all
                    thoroughly inspect the chosen car. You receive a details inspection report on the technical condition
                    of the car, photo documentation and our recommendation.
                </Text>

                {/* What happens section */}
                <Box bg="gray.50" p={6} borderRadius="lg">
                    <Heading as="h3" size="md" mb={8} textAlign="center">
                        What happens after ordering the inspection
                    </Heading>

                    <Flex direction={{ base: "column", md: "row" }} mb={6}>
                        {/* Left side with numbered steps */}
                        <Box flex="1" pr={{ md: 6 }}>
                            <VStack spacing={6} align="stretch">
                                {steps.map((step) => (
                                    <HStack key={step.number} align="flex-start" spacing={4}>
                                        <Flex
                                            justifyContent="center"
                                            alignItems="center"
                                            minWidth="32px"
                                            height="32px"
                                            bg="red.100"
                                            color="red.600"
                                            fontSize="md"
                                            fontWeight="bold"
                                            borderRadius="full"
                                        >
                                            {step.number}
                                        </Flex>
                                        <Box>
                                            <Text fontWeight="bold">{step.title}</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                {step.description}
                                            </Text>
                                        </Box>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>

                        {/* Right side with pricing */}
                        <Box width={{ base: "100%", md: "300px" }} mt={{ base: 6, md: 0 }}>
                            <Box
                                bg="red.500"
                                color="white"
                                py={3}
                                textAlign="center"
                                borderTopRadius="md"
                                fontWeight="bold"
                            >
                                SALE PRICE
                            </Box>
                            <Box
                                border="1px"
                                borderColor="gray.200"
                                p={4}
                                pb={6}
                                textAlign="center"
                                borderTopWidth="0"
                                borderBottomRadius="md"
                                bg="white"
                            >
                                <Text fontSize="md" textDecoration="line-through" color="gray.500" mb={1}>€199</Text>
                                <Text fontSize="3xl" fontWeight="bold" color="gray.900" mb={5}>€119</Text>

                                <Box
                                    bg="green.50"
                                    py={3}
                                    px={4}
                                    borderRadius="md"
                                    display="flex"
                                    alignItems="flex-start"
                                    gap={3}
                                >
                                    <Box color="green.500" mt="1">
                                        <CheckIcon boxSize={4} />
                                    </Box>
                                    <Box textAlign="left">
                                        <Text fontWeight="medium" color="green.700">Money-back guarantee</Text>
                                        <Text fontSize="sm" color="gray.700">if the car fails the inspection.</Text>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Text below the price box */}
                            <Box fontSize="sm" color="gray.600" mt={6}>
                                <Text>
                                    We try to reserve each car with the dealer before the inspection. However, we cannot guarantee this
                                    reservation. It all depends on the specific dealer. If the car is sold in the meanwhile, we will
                                    provide you a full refund of the price of the inspection.
                                </Text>
                            </Box>
                        </Box>
                    </Flex>

                    {/* Only show financing notification if using financing */}
                    {isFinancingSelected && (
                        <Box
                            bg="red.50"
                            p={4}
                            borderRadius="md"
                            mt={6}
                        >
                            <Flex gap={3} align="flex-start">
                                <Box color="red.500" mt={1} flexShrink={0}>
                                    <AlertCircle size={20} />
                                </Box>
                                <Text color="red.800" fontWeight="medium">
                                    When buying with financing, it is necessary to wait for the pre-approval of the loan to order.
                                </Text>
                            </Flex>
                        </Box>
                    )}

                    {/* Continue button - always visible but disabled when financing is selected and not approved */}
                    <Box textAlign="center" mt={6}>
                        <Button
                            colorScheme="red"
                            size="lg"
                            px={10}
                            onClick={onContinue}
                            bg="red.500"
                            _hover={{ bg: "red.600" }}
                            color="white"
                            isDisabled={isFinancingSelected && !isFinancingApproved}
                        >
                            Continue
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CarInspectionContent; 