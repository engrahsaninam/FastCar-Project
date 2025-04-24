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
    Badge,
    Collapse,
    List,
    ListItem,
    ListIcon,
    Divider,
    Icon,
    useColorModeValue
} from '@chakra-ui/react';
import { CheckCircle, Shield, Clock, DollarSign, Award, User, Car, Map } from 'lucide-react';

interface AdditionalServicesContentProps {
    onContinue: () => void;
}

interface ServiceOption {
    key: string;
    label: string;
    price: string;
    description: string;
    details?: {
        tagline: string;
        coverage: string[];
        benefits: string[];
        idealFor: string[];
        icon: React.ReactNode;
    };
}

const AdditionalServicesContent: React.FC<AdditionalServicesContentProps> = ({ onContinue }) => {
    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("#D3D3D3", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const headingColor = useColorModeValue("gray.800", "white");

    const buttonBgColor = useColorModeValue("red.500", "red.600");
    const buttonHoverBgColor = useColorModeValue("red.600", "red.500");

    const serviceBgSelected = useColorModeValue("red.500", "red.600");
    const serviceBgUnselected = useColorModeValue("white", "gray.800");
    const serviceBgHover = useColorModeValue("red.50", "gray.700");

    const detailCardBg = useColorModeValue("white", "gray.800");
    const detailBorderColor = useColorModeValue("#E53E3E", "#FC8181");
    const detailTextColor = useColorModeValue("gray.800", "gray.200");
    const detailLabelColor = useColorModeValue("red.500", "red.300");
    const detailItemColor = useColorModeValue("gray.700", "gray.300");

    const badgeBgSelected = useColorModeValue("white", "gray.700");
    const badgeBgUnselected = useColorModeValue("red.100", "red.900");
    const badgeColorSelected = useColorModeValue("red.500", "red.300");
    const badgeColorUnselected = useColorModeValue("gray.800", "gray.200");

    const iconColor = useColorModeValue("red.500", "red.300");
    const checkIconColor = useColorModeValue("green.500", "green.300");
    const dividerColor = useColorModeValue("gray.200", "gray.600");

    // Custom styles for consistent red borders with dark mode support
    const redBorderStyle = {
        border: `1px solid ${useColorModeValue('#E53E3E', '#FC8181')}`,
        boxShadow: useColorModeValue('0 0 0 3px rgba(229, 62, 62, 0.1)', '0 0 0 3px rgba(252, 129, 129, 0.2)')
    };

    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const services: ServiceOption[] = [
        {
            key: "mechanical",
            label: "Mechanical Insurance – 1 Year",
            price: "€850",
            description: "Covers engine, gearbox, and major mechanical failures for one full year.",
            details: {
                tagline: "Comprehensive protection for peace of mind.",
                coverage: [
                    "Engine and transmission (manual & automatic)",
                    "Gearbox and differential",
                    "Cooling system, fuel system, and turbocharger",
                    "Starter motor, alternator, and electrical systems",
                    "Clutch, brakes (excluding pads/discs), and steering system"
                ],
                benefits: [
                    "12 months of protection from major mechanical failures",
                    "No mileage restrictions",
                    "Nationwide repair network access",
                    "24/7 claims support and fast processing",
                    "Parts and labor included (up to policy limit)",
                    "Transferable policy in case of resale (adds resale value!)"
                ],
                idealFor: [
                    "Daily drivers",
                    "Long-distance commuters",
                    "Buyers of used cars seeking reliability"
                ],
                icon: <Icon as={Shield} size={24} color={iconColor} />
            }
        },
        {
            key: "cleaning",
            label: "Interior & Exterior Cleaning",
            price: "€150",
            description: "Professional deep cleaning of your vehicle before it's handed over to you.",
            details: {
                tagline: "Premium detailing by certified professionals for that brand-new feeling.",
                coverage: [
                    "Professional-grade exterior wash and ceramic wax protection",
                    "Deep interior vacuuming with hot water extraction",
                    "Premium leather conditioning and UV protection treatment",
                    "Interior sanitization and odor elimination (99.9% of germs)",
                    "Complete glass treatment with rain repellent",
                    "Wheel detailing with brake dust protection coating"
                ],
                benefits: [
                    "Extends the life of your vehicle's paint and interior surfaces",
                    "Creates a hygienic, allergen-free interior environment",
                    "Protects against UV damage, stains, and everyday wear",
                    "Improved visibility with streak-free glass treatment",
                    "Saves you time and effort – get a showroom-ready car",
                    "Makes maintenance easier with protective coatings"
                ],
                idealFor: [
                    "Health-conscious drivers and families with children",
                    "Professionals who want to maintain a pristine image",
                    "Anyone who values that 'new car' experience",
                    "Drivers sensitive to odors or allergens"
                ],
                icon: <Icon as={Car} size={24} color={iconColor} />
            }
        },
        {
            key: "priority",
            label: "Priority Delivery Service",
            price: "€250",
            description: "Get your car delivered within 5 working days. Ideal if you're in a hurry.",
            details: {
                tagline: "VIP expedited delivery when you need your vehicle now.",
                coverage: [
                    "Guaranteed fast-track delivery (within 5 business days)",
                    "Dedicated personal delivery coordinator",
                    "Front-of-line processing for all documentation",
                    "Accelerated pre-delivery inspection and preparation",
                    "Flexible delivery time slots including evenings and weekends",
                    "White-glove delivery service with comprehensive handover"
                ],
                benefits: [
                    "Skip the standard 2-3 week waiting period",
                    "Real-time tracking and status updates via SMS and email",
                    "Priority handling at every stage of the delivery process",
                    "Extended handover appointment with personalized vehicle tour",
                    "Special requests accommodation (specific delivery date/time)",
                    "Immediate resolution of any delivery concerns"
                ],
                idealFor: [
                    "Busy professionals with tight schedules",
                    "Customers replacing a vehicle that's no longer operational",
                    "Business owners requiring prompt transportation solutions",
                    "Special occasion timing (birthday, anniversary, vacation)",
                    "Anyone who values time as their most precious resource"
                ],
                icon: <Icon as={Clock} size={24} color={iconColor} />
            }
        }
    ];

    const ServiceOptionComponent = ({ service, isSelected, onToggle }: {
        service: ServiceOption;
        isSelected: boolean;
        onToggle: (key: string) => void;
    }) => {
        const radioBorderColor = useColorModeValue(
            isSelected ? "white" : "#E53E3E",
            isSelected ? "white" : "#FC8181"
        );

        const titleColor = useColorModeValue(
            isSelected ? "white" : "#1A202C",
            isSelected ? "white" : "gray.200"
        );

        const descriptionColor = useColorModeValue(
            isSelected ? "white" : "gray.600",
            isSelected ? "white" : "gray.400"
        );

        const cardBg = isSelected ? serviceBgSelected : serviceBgUnselected;
        const cardHoverBg = isSelected ? serviceBgSelected : serviceBgHover;

        return (
            <Box>
                <Box
                    as="label"
                    borderRadius="md"
                    p={5}
                    cursor="pointer"
                    transition="all 0.2s"
                    onClick={() => onToggle(service.key)}
                    bg={cardBg}
                    color={isSelected ? "white" : "inherit"}
                    shadow="md"
                    _hover={{
                        bg: cardHoverBg,
                        shadow: "lg"
                    }}
                    _active={{
                        transform: "scale(0.98)",
                        shadow: "sm"
                    }}
                    htmlFor={`service-${service.key}`}
                    role="checkbox"
                    aria-checked={isSelected}
                    style={redBorderStyle}
                    borderBottomRadius={isSelected && service.details ? 0 : "md"}
                    width={"100%"}
                >
                    <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="center">
                            <HStack spacing={4}>
                                <Flex
                                    w="20px"
                                    h="20px"
                                    borderRadius="full"
                                    borderWidth="2px"
                                    borderColor={radioBorderColor}
                                    bg={isSelected ? buttonBgColor : "transparent"}
                                    alignItems="center"
                                    justifyContent="center"
                                    transition="all 0.2s"
                                    aria-hidden="true"
                                >
                                    {isSelected && (
                                        <Box
                                            w="10px"
                                            h="10px"
                                            borderRadius="full"
                                            bg="white"
                                        />
                                    )}
                                </Flex>
                                <Text fontSize="sm" fontWeight="medium" color={titleColor}>
                                    {service.label}
                                </Text>
                            </HStack>
                            <Badge
                                px={2}
                                py={1}
                                fontSize="sm"
                                fontWeight="bold"
                                bg={isSelected ? badgeBgSelected : badgeBgUnselected}
                                color={isSelected ? badgeColorSelected : badgeColorUnselected}
                                borderRadius="md"
                            >
                                {service.price}
                            </Badge>
                        </Flex>
                        <Text fontSize="sm" color={descriptionColor} ml={8}>
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
                {service.details && (
                    <Collapse in={isSelected} animateOpacity>
                        <Box
                            p={5}
                            bg={detailCardBg}
                            borderWidth="1px"
                            borderTop="none"
                            borderColor={detailBorderColor}
                            borderBottomRadius="md"
                            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        >
                            <VStack align="start" spacing={4}>
                                <Flex align="center" width="100%">
                                    <Box mr={3}>
                                        {service.details.icon}
                                    </Box>
                                    <Text fontWeight="bold" fontSize="md" color={detailTextColor}>
                                        {service.details.tagline}
                                    </Text>
                                </Flex>

                                <Divider borderColor={dividerColor} />

                                <Box width="100%">
                                    <Text fontWeight="bold" fontSize="sm" color={detailLabelColor} mb={2}>
                                        ✅ Package Includes:
                                    </Text>
                                    <List spacing={2}>
                                        {service.details.coverage.map((item, index) => (
                                            <ListItem key={index} fontSize="sm" color={detailItemColor}>
                                                <ListIcon as={CheckCircle} color={checkIconColor} />
                                                {item}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>

                                <Box width="100%">
                                    <Text fontWeight="bold" fontSize="sm" color={detailLabelColor} mb={2}>
                                        🔒 Key Benefits:
                                    </Text>
                                    <List spacing={2}>
                                        {service.details.benefits.map((item, index) => (
                                            <ListItem key={index} fontSize="sm" color={detailItemColor}>
                                                <ListIcon as={CheckCircle} color={checkIconColor} />
                                                {item}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>

                                <Box width="100%">
                                    <Text fontWeight="bold" fontSize="sm" color={detailLabelColor} mb={2}>
                                        🧰 Perfect For:
                                    </Text>
                                    <List spacing={2}>
                                        {service.details.idealFor.map((item, index) => (
                                            <ListItem key={index} fontSize="sm" color={detailItemColor}>
                                                <ListIcon as={CheckCircle} color={checkIconColor} />
                                                {item}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </VStack>
                        </Box>
                    </Collapse>
                )}
            </Box>
        );
    };

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
        <Box
            p={6}
            as="section"
            aria-labelledby="additional-services-title"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
        >
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    {/* Description */}
                    <Text color={textColor} fontSize="sm" id="additional-services-title">
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
                            bg={buttonBgColor}
                            color="white"
                            size="lg"
                            px={12}
                            shadow="md"
                            _hover={{
                                bg: buttonHoverBgColor,
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