import React, { useState } from 'react';
import {
    Box,
    Text,
    VStack,
    Flex,
    Checkbox,
    Button,
    HStack,
    SimpleGrid,
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

    const ServiceOption = ({ service }: { service: ServiceOption }) => (
        <Box
            borderWidth="1px"
            borderRadius="xl"
            p={5}
            cursor="pointer"
            transition="all 0.2s"
            onClick={() => toggleService(service.key)}
            borderColor={selectedServices.includes(service.key) ? "red.500" : "gray.200"}
            bg={selectedServices.includes(service.key) ? "red.50" : "white"}
            _hover={{
                borderColor: "red.500",
                bg: "red.50"
            }}
        >
            <VStack align="stretch" spacing={3}>
                <Flex justify="space-between" align="center">
                    <HStack spacing={4}>
                        <Checkbox
                            isChecked={selectedServices.includes(service.key)}
                            onChange={() => toggleService(service.key)}
                            colorScheme="red"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Text fontSize="md" fontWeight="medium">
                            {service.label}
                        </Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                        {service.price}
                    </Text>
                </Flex>
                <Text fontSize="sm" color="gray.600" ml={8}>
                    {service.description}
                </Text>
            </VStack>
        </Box>
    );

    return (
        <Box p={6}>
            <VStack spacing={6} align="stretch">
                {/* Description */}
                <Text color="gray.700" fontSize="sm">
                    Enhance your purchase with optional add-ons. All services are designed to provide extra peace of mind and convenience.
                </Text>

                {/* Services Grid */}
                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
                    {services.map((service) => (
                        <ServiceOption key={service.key} service={service} />
                    ))}
                </SimpleGrid>

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

export default AdditionalServicesContent; 