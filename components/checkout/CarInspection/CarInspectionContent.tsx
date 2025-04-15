import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Flex,
    Button,
    Icon,
    Heading,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

interface CarInspectionContentProps {
    isFinancingSelected: boolean;
    isFinancingApproved: boolean;
    onContinue: () => void;
}

const CarInspectionContent: React.FC<CarInspectionContentProps> = ({
    isFinancingSelected,
    isFinancingApproved,
    onContinue
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue();
    };

    return (
        <Box as="section" aria-labelledby="car-inspection-title">
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    <Text fontSize="md" color="gray.700" id="car-inspection-title">
                        Before we deliver your car, we conduct a thorough inspection to ensure everything is in perfect condition.
                        Our proprietary CarAudit™ process consists of the following steps:
                    </Text>

                    {/* Inspection Steps */}
                    <VStack spacing={5} align="stretch" as="section" aria-labelledby="inspection-steps-heading">
                        <Heading as="h3" fontSize="md" fontWeight="semibold" id="inspection-steps-heading" srOnly>
                            Inspection Steps
                        </Heading>

                        <Box borderWidth="1px" borderColor="gray.200" p={4} borderRadius="md" as="article">
                            <HStack align="flex-start" spacing={4}>
                                <Flex
                                    w="30px"
                                    h="30px"
                                    bg="red.500"
                                    color="white"
                                    borderRadius="full"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontWeight="bold"
                                    mt={1}
                                    aria-hidden="true"
                                >
                                    1
                                </Flex>
                                <Box>
                                    <Text fontWeight="semibold" color="gray.800">Technical Inspection</Text>
                                    <Text color="gray.600" mt={1}>
                                        Our certified technicians examine all mechanical components, electrical systems, and fluid levels to ensure optimal performance.
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>

                        <Box borderWidth="1px" borderColor="gray.200" p={4} borderRadius="md" as="article">
                            <HStack align="flex-start" spacing={4}>
                                <Flex
                                    w="30px"
                                    h="30px"
                                    bg="red.500"
                                    color="white"
                                    borderRadius="full"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontWeight="bold"
                                    mt={1}
                                    aria-hidden="true"
                                >
                                    2
                                </Flex>
                                <Box>
                                    <Text fontWeight="semibold" color="gray.800">Exterior & Interior Check</Text>
                                    <Text color="gray.600" mt={1}>
                                        We meticulously inspect the body, paint, upholstery, and interior features for any cosmetic issues or wear.
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>

                        <Box borderWidth="1px" borderColor="gray.200" p={4} borderRadius="md" as="article">
                            <HStack align="flex-start" spacing={4}>
                                <Flex
                                    w="30px"
                                    h="30px"
                                    bg="red.500"
                                    color="white"
                                    borderRadius="full"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontWeight="bold"
                                    mt={1}
                                    aria-hidden="true"
                                >
                                    3
                                </Flex>
                                <Box>
                                    <Text fontWeight="semibold" color="gray.800">Road Test & Final Quality Control</Text>
                                    <Text color="gray.600" mt={1}>
                                        Every vehicle undergoes a comprehensive road test to evaluate driving dynamics, braking, and overall performance.
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>
                    </VStack>

                    {/* Pricing Information */}
                    <Box
                        bg="gray.50"
                        p={5}
                        borderRadius="md"
                        as="section"
                        aria-labelledby="pricing-section-heading"
                    >
                        <Heading as="h3" fontSize="md" fontWeight="semibold" mb={3} id="pricing-section-heading">
                            Car Price & Guarantee
                        </Heading>
                        <HStack mb={3}>
                            <Text fontWeight="semibold" color="gray.700">Sale Price:</Text>
                            <Text fontWeight="bold" color="red.500">€28,990</Text>
                        </HStack>
                        <Box mt={4} borderWidth="1px" borderColor="gray.200" p={3} borderRadius="md" bg="white">
                            <HStack>
                                <Icon as={CheckIcon} color="green.500" />
                                <Text color="gray.700" fontSize="sm">
                                    14-day money-back guarantee if you're not completely satisfied with your purchase.
                                </Text>
                            </HStack>
                        </Box>
                    </Box>

                    {/* Financing Notice */}
                    {isFinancingSelected && (
                        <Box
                            borderWidth="1px"
                            borderColor="red.100"
                            bg="red.50"
                            p={4}
                            borderRadius="md"
                            role="alert"
                            aria-live="polite"
                        >
                            <HStack>
                                <Icon as={CheckIcon} color="red.500" />
                                <Text fontWeight="medium" color="gray.700">
                                    {isFinancingApproved
                                        ? "Your financing has been approved! You can proceed to the next step."
                                        : "Your financing application is currently being processed. You'll be notified once approved."}
                                </Text>
                            </HStack>
                        </Box>
                    )}

                    {/* Continue Button */}
                    <Flex justify="center" mt={2}>
                        <Button
                            type="submit"
                            colorScheme="red"
                            size="lg"
                            px={12}
                            isDisabled={isFinancingSelected && !isFinancingApproved}
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

export default CarInspectionContent; 