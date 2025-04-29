import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Stack,
    Text,
    VStack,
    useColorModeValue,
    useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon, TimeIcon } from '@chakra-ui/icons';
import { FinancingSpecsProps, FinancingOption } from '../checkout/types/financing';
import FinancingOptionComponent from '../checkout/PaymentMethod/FinancingOptionComponent';
import PaybackPeriodSlider from '../checkout/PaymentMethod/PaybackPeriodSlider';
import DownPaymentSlider from '../checkout/PaymentMethod/DownPaymentSlider';
import FinancingParameters from '../checkout/PaymentMethod/FinancingParameters';
import FinancingInfoSection from '../checkout/PaymentMethod/FinancingInfoSection';
import FinancingCTASection from '../checkout/PaymentMethod/FinancingCTASection';
import OptionF from './OptionF';
const MotionBox = motion(Box);

const Specs: React.FC<FinancingSpecsProps> = ({
    onFinancingRequest,
    onFullPayment,
    onToggleSpecs
}) => {
    // Responsive values
    const containerPadding = useBreakpointValue({ base: 2, sm: 3, md: 5 });
    const containerMarginTop = useBreakpointValue({ base: 2, sm: 4, md: 6 });

    const sectionSpacing = useBreakpointValue({ base: 4, sm: 5, md: 6 });
    const headingSize = useBreakpointValue({ base: "sm", sm: "md", md: "15px" });
    const iconSize = useBreakpointValue({ base: "16px", sm: "18px", md: "20px" });
    const gapSize = useBreakpointValue({ base: 1, sm: 2, md: 2 });
    const borderRadius = useBreakpointValue({ base: "md", md: "lg" });
    const flexDirection = useBreakpointValue({ base: "column", md: "row" }) as "column" | "row";

    const [isFinancingSpecsExpanded, setIsFinancingSpecsExpanded] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string>('regular-loan');
    const [paybackPeriod, setPaybackPeriod] = useState<number>(48);
    const [downPayment, setDownPayment] = useState<number>(30);
    const [totalPrice, setTotalPrice] = useState<number>(25000);

    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const iconColor = useColorModeValue("red.500", "red.300");
    const mutedIconColor = useColorModeValue("gray.500", "gray.400");
    const hoverBgColor = useColorModeValue("gray.100", "gray.700");

    const grayborderstyle = {
        border: `1px solid`,
        borderColor: useColorModeValue("#D3D3D3", "#4A5568"),
        borderRadius: borderRadius,
        shadow: 'md'
    }
    const options: FinancingOption[] = [
        {
            id: 'regular-loan',
            title: 'Regular loan',
            percentage: '8.45 %',
            description: 'choose to avoid an increased final payment'
        }
    ];

    useEffect(() => {
        if (selectedOption === 'low-installment') {
            if (![12, 24, 36, 48, 60, 72, 84, 96, 108, 120].includes(paybackPeriod)) {
                setPaybackPeriod(48);
            }
            if (downPayment < 10) {
                setDownPayment(10);
            }
        } else {
            if (paybackPeriod < 12) {
                setPaybackPeriod(12);
            } else if (paybackPeriod > 240) {
                setPaybackPeriod(240);
            }
            const remainder = paybackPeriod % 12;
            if (remainder !== 0) {
                setPaybackPeriod(paybackPeriod - remainder + (remainder > 6 ? 12 : 0));
            }
            if (downPayment < 20) {
                setDownPayment(20);
            }
        }
    }, [selectedOption, paybackPeriod, downPayment]);

    const handleFinancingSpecsToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpandedState = !isFinancingSpecsExpanded;
        setIsFinancingSpecsExpanded(newExpandedState);
        onToggleSpecs(newExpandedState);
    };

    const handleOptionSelect = (optionId: string) => {
        setSelectedOption(optionId);
    };

    const handlePriceChange = (price: number) => {
        setTotalPrice(price);
    };

    const handlePeriodChange = (period: number) => {
        setPaybackPeriod(period);
    };

    const handleDownPaymentChange = (percentage: number) => {
        setDownPayment(percentage);
    };

    const downPaymentAmount = (downPayment / 100) * totalPrice;

    const calculateMonthlyPayment = () => {
        const loanAmount = totalPrice - downPaymentAmount;
        const interestRate = 8.45; // Fixed for regular loan
        const monthlyRate = interestRate / 100 / 12;

        const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -paybackPeriod));
        return Math.round(payment);
    };

    const monthlyPayment = calculateMonthlyPayment();

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            p={containerPadding}
            bg={bgColor}
            mt={containerMarginTop}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius={borderRadius}
            style={grayborderstyle}
            width="100%"
            maxW="100%"
            overflow="hidden"
        >
            <Flex
                align="center"
                justify="space-between"
                borderBottomWidth={isFinancingSpecsExpanded ? "1px" : "0"}
                borderBottomColor={borderColor}
                pb={isFinancingSpecsExpanded ? containerPadding : 0}
                mb={isFinancingSpecsExpanded ? sectionSpacing : 0}
                width="100%"
                flexWrap="wrap"
                gap={2}
            >
                <Flex
                    align="center"
                    gap={gapSize}
                    flex="1 1 200px"
                    minW="0"
                    flexDirection={{ base: "column", md: "row" }}
                >
                    <TimeIcon w={iconSize} h={iconSize} color={iconColor} aria-label="time-icon" />
                    <Heading as="h4" fontSize={headingSize} fontWeight="semibold" color={textColor} noOfLines={1}>
                        Financing specifications
                    </Heading>
                </Flex>

                <Button
                    onClick={handleFinancingSpecsToggle}
                    p={1}
                    _hover={{ bg: hoverBgColor }}
                    borderRadius="full"
                    variant="ghost"
                    minW="auto"
                >
                    {isFinancingSpecsExpanded ? (
                        <ChevronUpIcon w={iconSize} h={iconSize} color={mutedIconColor} aria-label="chevron-up-icon" />
                    ) : (
                        <ChevronDownIcon w={iconSize} h={iconSize} color={mutedIconColor} aria-label="chevron-down-icon" />
                    )}
                </Button>
            </Flex>

            {isFinancingSpecsExpanded && (
                <VStack spacing={sectionSpacing} align="stretch" w="100%">
                    <Box w="100%">
                        <Flex
                            w="100%"
                            gap={4}
                            direction="column"
                        >
                            {options.map((option) => (
                                <Box
                                    key={option.id}
                                    w="100%"
                                >
                                    <OptionF
                                        option={option}
                                        selectedOption={selectedOption}
                                        onSelect={handleOptionSelect}
                                        onPriceChange={handlePriceChange}
                                        totalPrice={totalPrice}
                                    />
                                </Box>
                            ))}
                        </Flex>
                    </Box>

                    <PaybackPeriodSlider
                        paybackPeriod={paybackPeriod}
                        onPeriodChange={handlePeriodChange}
                        selectedOption={selectedOption}
                    />

                    <DownPaymentSlider
                        downPayment={downPayment}
                        onDownPaymentChange={handleDownPaymentChange}
                        totalPrice={totalPrice}
                        selectedOption={selectedOption}
                    />

                    <FinancingParameters
                        downPayment={downPayment}
                        downPaymentAmount={downPaymentAmount}
                        installmentPeriod={paybackPeriod}
                        interestRate="8.45"
                        APR="10.137"
                        monthlyPayment={monthlyPayment}
                    />
                </VStack>
            )}
        </MotionBox>
    );
};

export default Specs;