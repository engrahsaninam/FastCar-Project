import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon, TimeIcon } from '@chakra-ui/icons';
import { FinancingSpecsProps, FinancingOption } from '../types/financing';
import FinancingOptionComponent from './FinancingOptionComponent';
import PaybackPeriodSlider from './PaybackPeriodSlider';
import DownPaymentSlider from './DownPaymentSlider';
import FinancingParameters from './FinancingParameters';
import FinancingInfoSection from './FinancingInfoSection';
import FinancingCTASection from './FinancingCTASection';

const MotionBox = motion(Box);

const FinancingSpecs: React.FC<FinancingSpecsProps> = ({
    onFinancingRequest,
    onFullPayment,
    onToggleSpecs
}) => {
    const [isFinancingSpecsExpanded, setIsFinancingSpecsExpanded] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string>('low-installment');
    const [paybackPeriod, setPaybackPeriod] = useState<number>(36);
    const [downPayment, setDownPayment] = useState<number>(40);

    const totalPrice = 27440;

    const options: FinancingOption[] = [
        {
            id: 'low-installment',
            title: 'Low Instalment',
            isNew: true,
            percentage: '91.4 %',
            description: 'choose low payments'
        },
        {
            id: 'regular-loan',
            title: 'Regular loan',
            percentage: '8.6 %',
            description: 'choose to avoid an increased final payment'
        }
    ];

    useEffect(() => {
        if (selectedOption === 'low-installment') {
            if (![24, 36, 48].includes(paybackPeriod)) {
                setPaybackPeriod(36);
            }
            if (downPayment < 10) {
                setDownPayment(10);
            }
        } else {
            if (paybackPeriod < 12) {
                setPaybackPeriod(12);
            } else if (paybackPeriod > 96) {
                setPaybackPeriod(96);
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

    const handlePeriodChange = (period: number) => {
        setPaybackPeriod(period);
    };

    const handleDownPaymentChange = (percentage: number) => {
        setDownPayment(percentage);
    };

    const downPaymentAmount = (downPayment / 100) * totalPrice;

    const calculateMonthlyPayment = () => {
        const loanAmount = totalPrice - downPaymentAmount;
        const interestRate = selectedOption === 'low-installment' ? 9.5 : 8.5;
        const monthlyRate = interestRate / 100 / 12;

        if (selectedOption === 'low-installment') {
            const balloonAmount = loanAmount * 0.28;
            const amountToFinance = loanAmount - balloonAmount;
            const payment = (amountToFinance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -paybackPeriod));
            return Math.round(payment);
        } else {
            const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -paybackPeriod));
            return Math.round(payment);
        }
    };

    const monthlyPayment = calculateMonthlyPayment();

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            p={5}
            bg="white"
            mt={6}
            borderWidth="1px"
            borderRadius="lg"
        >
            <Flex
                align="center"
                justify="space-between"
                borderBottomWidth={isFinancingSpecsExpanded ? "1px" : "0"}
                pb={isFinancingSpecsExpanded ? 5 : 0}
                mb={isFinancingSpecsExpanded ? 6 : 0}
            >
                <Flex align="center" gap={2}>
                    <TimeIcon w="20px" h="20px" color="red.500" aria-label="time-Icon" />
                    <Heading as="h4" fontSize="15px" fontWeight="semibold" color="gray.900">
                        Financing specifications
                    </Heading>
                </Flex>
                <Button
                    onClick={handleFinancingSpecsToggle}
                    p={1}
                    _hover={{ bg: 'gray.100' }}
                    borderRadius="full"
                    variant="ghost"
                >
                    {isFinancingSpecsExpanded ? (
                        <ChevronUpIcon w="20px" h="20px" color="gray.500" aria-label="chevron-up-Icon" />
                    ) : (
                        <ChevronDownIcon w="20px" h="20px" color="gray.500" aria-label="chevron-down-Icon" />
                    )}
                </Button>
            </Flex>

            {isFinancingSpecsExpanded && (
                <VStack spacing={6} align="stretch">
                    <Flex w="full" gap={{ base: 1, sm: 4 }}>
                        {options.map((option) => (
                            <FinancingOptionComponent
                                key={option.id}
                                option={option}
                                selectedOption={selectedOption}
                                onSelect={handleOptionSelect}
                            />
                        ))}
                    </Flex>

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
                        interestRate={selectedOption === 'low-installment' ? '9.50' : '8.50'}
                        APR={selectedOption === 'low-installment' ? '11.55' : '10.25'}
                        monthlyPayment={monthlyPayment}
                    />

                    <FinancingInfoSection />
{/* 
                    <FinancingCTASection
                        onPrimaryClick={onFinancingRequest}
                        onSecondaryClick={onFullPayment}
                    /> */}
                </VStack>
            )}
        </MotionBox>
    );
};

export default FinancingSpecs;