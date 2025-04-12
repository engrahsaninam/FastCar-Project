import React from 'react';
import {
    Box,
    Flex,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { DownPaymentSliderProps } from '../types/financing';

const DownPaymentSlider: React.FC<DownPaymentSliderProps> = ({
    downPayment,
    onDownPaymentChange,
    totalPrice = 27440,
    lastPaymentPercentage = 49,
    selectedOption
}) => {
    // Define percentage range and steps based on selected option
    const minPercentage = selectedOption === 'low-installment' ? 10 : 20;
    const maxPercentage = 90;

    // Generate steps based on selectedOption
    const percentageSteps = selectedOption === 'low-installment'
        ? [10, 20, 30, 40, 50, 60, 70, 80, 90]
        : [20, 30, 40, 50, 60, 70, 80, 90];

    // Calculate the formatted amount
    const formattedAmount = `€${Math.round(totalPrice * downPayment / 100).toLocaleString('de-DE')}`;
    const lastPaymentAmount = `€${Math.round(totalPrice * lastPaymentPercentage / 100).toLocaleString('de-DE')}`;

    // Find which segment is active based on current value
    const getActiveSegment = (value: number): number => {
        if (selectedOption === 'low-installment') {
            if (value < 15) return 10;
        }

        if (value < 25) return 20;
        if (value < 35) return 30;
        if (value < 45) return 40;
        if (value < 55) return 50;
        if (value < 65) return 60;
        if (value < 75) return 70;
        if (value < 85) return 80;
        return 90;
    };

    const activeSegment = getActiveSegment(downPayment);

    return (
        <Box width="100%" px="20px" py="20px">
            {/* Header with title and value */}
            <Flex justify="space-between" align="center" mb={3}>
                <Flex align="center">
                    <Text fontWeight="medium" fontSize="sm" color="red.900">Down payment (%)</Text>
                    <Box ml={1} cursor="help">
                        <InfoIcon boxSize="14px" color="red.200" />
                    </Box>
                </Flex>
                <Text fontWeight="bold" fontSize="sm">
                    {downPayment}% = {formattedAmount}
                </Text>
            </Flex>

            {/* Background segments */}
            <Box position="relative" mb={6}>
                <Flex width="100%" height="24px" mb="16px">
                    {percentageSteps.map((step, i) => {
                        // Default background is very light gray
                        let bgColor = "gray.100";

                        // If this is the selected segment, make it darker green
                        if (step === activeSegment) {
                            bgColor = "green.200";
                        } else {
                            // All other segments are light green
                            bgColor = "green.50";
                        }

                        return (
                            <Box
                                key={step}
                                flex={1}
                                bg={bgColor}
                                borderLeftWidth={i === 0 ? 0 : "1px"}
                                borderColor="white"
                            />
                        );
                    })}
                </Flex>

                {/* The slider itself positioned on top of segments */}
                <Box
                    position="absolute"
                    top="10px"
                    left="0"
                    width="100%"
                    zIndex="2"
                >
                    <Slider
                        min={minPercentage}
                        max={maxPercentage}
                        step={5}
                        value={downPayment}
                        onChange={(val: number) => onDownPaymentChange(val)}
                    >
                        <SliderTrack bg="red.500" height="2px">
                            <SliderFilledTrack bg="red.500" />
                        </SliderTrack>
                        <SliderThumb
                            boxSize="24px"
                            bg="red.500"
                            borderWidth="3px"
                            borderColor="white"
                            boxShadow="0 1px 2px rgba(0,0,0,0.1)"
                            _focus={{
                                boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.2)"
                            }}
                        />
                    </Slider>
                </Box>

                {/* Percentage labels */}
                <Flex
                    width="100%"
                    justify="space-between"
                    mt="8px"
                >
                    {percentageSteps.map(step => (
                        <Text
                            key={step}
                            fontSize="sm"
                            fontWeight={activeSegment === step ? "medium" : "normal"}
                            color={activeSegment === step ? "red.500" : "gray.500"}
                            cursor="pointer"
                            onClick={() => onDownPaymentChange(step)}
                            textAlign="center"
                            width="40px"
                            ml={step === minPercentage ? "-15px" : 0}
                            mr={step === maxPercentage ? "-15px" : 0}
                        >
                            {step}%
                        </Text>
                    ))}
                </Flex>
            </Box>

            {/* Last payment section */}
            <Flex justify="space-between" align="center" mt={2}>
                <Text fontWeight="medium" fontSize="sm" color="red.600">
                    Last payment
                </Text>
                <Text fontWeight="bold" fontSize="sm">
                    {lastPaymentPercentage}% = {lastPaymentAmount}
                </Text>
            </Flex>
        </Box>
    );
};

export default DownPaymentSlider;