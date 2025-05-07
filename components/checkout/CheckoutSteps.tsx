import {
    Box,
    Circle,
    Flex,
    Text,
    useBreakpointValue,
    useColorModeValue,
    Icon,
} from "@chakra-ui/react";
import { FC } from "react";
import { Step } from "./CarType";
import { ChevronRight } from "lucide-react";

const steps: Step[] = [
    { id: 1, label: "Payment method", isActive: true },
    { id: 2, label: "Car condition check", isActive: false },
    { id: 3, label: "Delivery", isActive: false },
    { id: 4, label: "Payment", isActive: false },
];

const StepNumber: FC<{ number: number; isActive: boolean }> = ({
    number,
    isActive,
}) => {
    const activeBg = useColorModeValue("red.500", "red.400");
    const inactiveBg = useColorModeValue("gray.100", "gray.700");
    const activeColor = "white";
    const inactiveColor = useColorModeValue("gray.500", "gray.400");

    return (
        <Circle
            size="28px"
            bg={isActive ? activeBg : inactiveBg}
            color={isActive ? activeColor : inactiveColor}
            fontSize="sm"
            fontWeight="medium"
        >
            {number}
        </Circle>
    );
};

const StepLabel: FC<{ label: string; isActive: boolean; isMobile?: boolean }> = ({
    label,
    isActive,
    isMobile = false,
}) => {
    const activeColor = useColorModeValue("red.500", "red.400");
    const inactiveColor = useColorModeValue("gray.600", "gray.400");

    return (
        <Text
            fontSize={isMobile ? "xs" : "sm"}
            color={isActive ? activeColor : inactiveColor}
            fontWeight={isActive ? "medium" : "normal"}
            display={isMobile ? { base: "none", sm: "inline" } : "inline"}
            whiteSpace="nowrap"
        >
            {label}
        </Text>
    );
};

const ChevronSeparator: FC = () => {
    const chevronColor = useColorModeValue("gray.400", "gray.600");

    return (
        <Box w="5" h="5" color={chevronColor} display="flex" alignItems="center" justifyContent="center">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </Box>
    );
};

const LineSeparator: FC<{ isActive: boolean }> = ({ isActive }) => {
    const inactiveBg = useColorModeValue("gray.200", "gray.700");
    const activeBg = useColorModeValue("red.500", "red.400");

    return (
        <Box flex="1" h="2px" bg={inactiveBg} mx={2} overflow="hidden">
            <Box
                h="full"
                bg={isActive ? activeBg : inactiveBg}
                transition="all 0.3s ease"
                w={isActive ? "100%" : "0%"}
            />
        </Box>
    );
};

const CheckoutSteps: FC = () => {
    const desktopBg = useColorModeValue("white", "gray.800");
    const mobileBg = useColorModeValue("gray.50", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
        <Box w="full" bg={desktopBg} borderBottom="1px solid" borderColor={borderColor} mb={4}>
            {/* Desktop View */}
            <Box maxW="92%" mx="auto" py={4} display={{ base: 'none', lg: 'block' }}>
                <Flex align="center" justify="space-between">
                    {steps.map((step, index) => (
                        <Flex key={step.id} align="center">
                            <Flex align="center" gap={3}>
                                <StepNumber number={step.id} isActive={step.isActive} />
                                <StepLabel label={step.label} isActive={step.isActive} />
                            </Flex>
                            {index < steps.length - 1 && <ChevronSeparator />}
                        </Flex>
                    ))}
                </Flex>
            </Box>

            {/* Mobile View */}
            <Box w="full" bg={mobileBg} py={4} display={{ base: 'block', lg: 'none' }}>
                <Box maxW="92%" mx="auto">
                    <Flex align="center" justify="space-between" gap={2}>
                        {steps.map((step, index) => (
                            <Flex key={step.id} align="center" gap={5} justify='space-between'>
                                <Flex direction="column" align="center" gap={1} flexShrink={0}>
                                    <StepNumber number={step.id} isActive={step.isActive} />
                                    <StepLabel label={step.label} isActive={step.isActive} isMobile />
                                </Flex>
                                <Flex>
                                    {index < steps.length - 1 && (
                                        <Icon as={ChevronRight} boxSize={5} color={steps[index + 1].isActive ? "red.500" : "gray.400"} mx={1} />
                                    )}
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};

export default CheckoutSteps;
