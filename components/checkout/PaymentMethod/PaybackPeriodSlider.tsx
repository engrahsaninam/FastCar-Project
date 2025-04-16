import React from 'react';
import {
    Box,
    Flex,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark
} from '@chakra-ui/react';
import { PaybackPeriodSliderProps } from '../types/financing';

const PaybackPeriodSlider: React.FC<PaybackPeriodSliderProps> = ({
    paybackPeriod,
    onPeriodChange,
    selectedOption
}) => {
    // Define the periods based on the selected financing option
    const periods = selectedOption === 'low-installment'
        ? [12, 24, 36, 48, 60, 72, 84, 96, 108, 120]
        : [12, 24, 36, 48, 60, 72, 84, 96, 108, 120]

    // Find the index of the current period in the periods array
    const currentIndex = periods.indexOf(paybackPeriod);

    // Convert index to percentage for slider
    const sliderValue = currentIndex >= 0 ? (currentIndex / (periods.length - 1)) * 100 : 0;

    // Handle slider change
    const handleSliderChange = (value: number) => {
        // Convert percentage to index
        const index = Math.round((value / 100) * (periods.length - 1));
        // Get the corresponding period
        const newPeriod = periods[index];
        onPeriodChange(newPeriod);
    };

    // Handle direct period selection
    const handlePeriodClick = (period: number) => {
        onPeriodChange(period);
    };

    return (
        <Box mt={8} px="20px">
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color="gray.900">
                    Payback period
                </Text>
                <Text fontWeight="bold" color="gray.900">
                    {paybackPeriod} months
                </Text>
            </Flex>
            <Box position="relative" pt={4} pb={8}>
                <Slider
                    value={sliderValue}
                    onChange={handleSliderChange}
                    min={0}
                    max={100}
                    step={100 / (periods.length - 1)}
                    aria-label="payback-period-slider"
                >
                    <SliderTrack bg="gray.200" h="8px" borderRadius="full">
                        <SliderFilledTrack bg="red.500" />
                    </SliderTrack>
                    <SliderThumb
                        boxSize={5}
                        bg="white"
                        borderWidth="2px"
                        borderColor="red.500"
                        boxShadow="md"
                        _focus={{
                            boxShadow: "outline"
                        }}
                    />

                    {/* Marks for each period */}
                    {periods.map((period, index) => {
                        const percentage = (index / (periods.length - 1)) * 100;
                        return (
                            <SliderMark
                                key={period}
                                value={percentage}
                                mt={8}
                                ml={-2.5}
                                fontSize="xs"
                                color={paybackPeriod === period ? "red.500" : "gray.500"}
                                fontWeight={paybackPeriod === period ? "bold" : "normal"}
                                cursor="pointer"
                                onClick={() => handlePeriodClick(period)}
                                _hover={{
                                    color: "red.500"
                                }}
                            >
                                {period}
                            </SliderMark>
                        );
                    })}
                </Slider>
            </Box>
        </Box>
    );
};

export default PaybackPeriodSlider;