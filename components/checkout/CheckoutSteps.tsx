import {
    Box,
    Circle,
    Flex,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { FC } from "react";
import { Step } from "./CarType";

const steps: Step[] = [
    { id: 1, label: "Payment method", isActive: true },
    { id: 2, label: "Car condition check", isActive: false },
    { id: 3, label: "Delivery", isActive: false },
    { id: 4, label: "Payment", isActive: false },
];

const StepNumber: FC<{ number: number; isActive: boolean }> = ({
    number,
    isActive,
}) => (
    <Circle
        size="28px"
        bg={isActive ? "red.500" : "gray.100"}
        color={isActive ? "white" : "gray.500"}
        fontSize="sm"
        fontWeight="medium"
    >
        {number}
    </Circle>
);

const StepLabel: FC<{ label: string; isActive: boolean; isMobile?: boolean }> = ({
    label,
    isActive,
    isMobile = false,
}) => (
    <Text
        fontSize={isMobile ? "xs" : "sm"}
        color={isActive ? "red.500" : "gray.600"}
        fontWeight={isActive ? "medium" : "normal"}
        display={isMobile ? { base: "none", sm: "inline" } : "inline"}
        whiteSpace="nowrap"
    >
        {label}
    </Text>
);

const ChevronSeparator: FC = () => (
    <Box w="5" h="5" color="gray.400" display="flex" alignItems="center" justifyContent="center">
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

const LineSeparator: FC<{ isActive: boolean }> = ({ isActive }) => (
    <Box flex="1" h="2px" bg="gray.200" mx={2} overflow="hidden">
        <Box
            h="full"
            bg={isActive ? "red.500" : "gray.200"}
            transition="all 0.3s ease"
            w={isActive ? "100%" : "0%"}
        />
    </Box>
);

const CheckoutSteps: FC = () => {
    // const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box w="full" bg="white" borderBottom="1px solid" borderColor="gray.200" mb={4}>
            {/* Desktop View */}
            {/* {!isMobile && ( */}
                <Box maxW="92%" mx="auto" py={4}  display={{ base: 'none', lg: 'block' }}>
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
            {/* {isMobile && ( */}
                <Box w="full" bg="gray.50" py={4} display={{ base: 'block', lg: 'none' }}>
                    <Box maxW="92%" mx="auto">
                        <Flex align="center" justify="space-between">
                            {steps.map((step, index) => (
                                <Flex key={step.id} direction="column" align="center" gap={1} flexShrink={0}>
                                    <StepNumber number={step.id} isActive={step.isActive} />
                                    <StepLabel label={step.label} isActive={step.isActive} isMobile />
                                    {index < steps.length - 1 && (
                                        <LineSeparator isActive={step.isActive} />
                                    )}
                                </Flex>
                            ))}
                        </Flex>
                    </Box>
                </Box>
            {/* )} */}
        </Box>
    );
};

export default CheckoutSteps;
