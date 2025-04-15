import React, { useState } from 'react';
import {
    Box,
    Text,
    VStack,
    Flex,
    Button,
    HStack,
    SimpleGrid,
    FormControl,
    FormLabel,
    VisuallyHidden,
} from '@chakra-ui/react';

interface AdditionalServicesContentProps {
    onContinue: () => void;
}

interface ServiceOption {
    key: string;
    label: string;
    price: string;
    description: string;
}

const ServiceOptionComponent = ({ service, isSelected, onToggle }: {
    service: ServiceOption;
    isSelected: boolean;
    onToggle: (key: string) => void;
}) => (
    <Box
        as="label"
        borderWidth="1px"
        borderRadius="md"
        p={5}
        cursor="pointer"
        transition="all 0.2s"
        onClick={() => onToggle(service.key)}
        borderColor={isSelected ? "red.500" : "gray.300"}
        bg={isSelected ? "red.50" : "white"}
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
        htmlFor={`service-${service.key}`}
        role="checkbox"
        aria-checked={isSelected}
    >
        <VStack align="stretch" spacing={3}>
            <Flex justify="space-between" align="center">
                <HStack spacing={4}>
                    <Flex
                        w="20px"
                        h="20px"
                        borderRadius="full"
                        borderWidth="6px"
                        borderColor={isSelected ? "red.500" : "gray.300"}
                        bg={isSelected ? "red.500" : "white"}
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
                    <Text fontSize="sm" fontWeight="medium" color="#1A202C">
                        {service.label}
                    </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    {service.price}
                </Text>
            </Flex>
            <Text fontSize="sm" color="gray.600" ml={8}>
                {service.description}
            </Text>
        </VStack>
        <input
            type="checkbox"
            id={`service-${service.key}`}
            checked={isSelected}
            onChange={() => onToggle(service.key)}
            style={{ position: 'absolute', opacity: 0 }}
            aria-label={`Select ${service.label} for ${service.price}`}
        />
    </Box>
);

ServiceOptionComponent.displayName = 'ServiceOption';

const AdditionalServicesContent: React.FC<AdditionalServicesContentProps> = ({ onContinue }) => {
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const services: ServiceOption[] = [
        {
            key: "mechanical",
            label: "Mechanical Insurance – 1 Year",
            price: "€850",
            description: "Covers engine, gearbox, and major mechanical failures for one full year."
        },
        {
            key: "cleaning",
            label: "Interior & Exterior Cleaning",
            price: "€150",
            description: "Professional deep cleaning of your vehicle before it's handed over to you."
        },
        {
            key: "priority",
            label: "Priority Delivery Service",
            price: "€250",
            description: "Get your car delivered within 5 working days. Ideal if you're in a hurry."
        }
    ];

    const toggleService = (key: string) => {
        setSelectedServices(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue();
    };

    return (
        <Box p={6} as="section" aria-labelledby="additional-services-title">
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    {/* Description */}
                    <Text color="gray.700" fontSize="sm" id="additional-services-title">
                        Enhance your purchase with optional add-ons. All services are designed to provide extra peace of mind and convenience.
                    </Text>

                    {/* Services Grid */}
                    <FormControl as="fieldset">
                        <FormLabel as="legend" id="services-group" srOnly>Additional Services</FormLabel>
                        <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}
                            role="group"
                            aria-labelledby="services-group"
                        >
                            {services.map((service) => (
                                <ServiceOptionComponent
                                    key={service.key}
                                    service={service}
                                    isSelected={selectedServices.includes(service.key)}
                                    onToggle={toggleService}
                                />
                            ))}
                        </SimpleGrid>
                    </FormControl>

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

AdditionalServicesContent.displayName = 'AdditionalServicesContent';

export default AdditionalServicesContent; 