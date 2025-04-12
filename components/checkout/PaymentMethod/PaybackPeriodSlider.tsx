import React from 'react';
import {
    Box,
    Flex,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb
} from '@chakra-ui/react';
import { PaybackPeriodSliderProps } from '../types/financing';

const PaybackPeriodSlider: React.FC<PaybackPeriodSliderProps> = ({
    paybackPeriod,
    onPeriodChange,
    selectedOption
}) => {
    // Define the periods based on the selected financing option
    const periods = selectedOption === 'low-installment'
        ? [24, 36, 48]
        : [12, 24, 36, 48, 60, 72, 84, 96];

    // Calculate the slider value as a percentage
    const minPeriod = periods[0];
    const maxPeriod = periods[periods.length - 1];
    const sliderValue = ((paybackPeriod - minPeriod) / (maxPeriod - minPeriod)) * 100;

    // Add direct click handler
    const handlePeriodClick = (period: number) => {
        onPeriodChange(period);
    };

    // Custom tick component
    const Tick: React.FC<{ value: number }> = ({ value }) => (
        <Flex
            direction="column"
            alignItems="center"
            cursor="pointer"
            onClick={() => handlePeriodClick(value)}
        >
            <Text fontSize="xs" mt={1} color="gray.500">{value}</Text>
        </Flex>
    );

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
            <Box position="relative" w="full" h="8px" mb={10}>
                <Slider
                    value={sliderValue}
                    onChange={(val: number) => {
                        // Convert percentage back to period value
                        const calculatedPeriod = Math.round(
                            minPeriod + (val / 100) * (maxPeriod - minPeriod)
                        );

                        // Find the closest valid period
                        let closestPeriod = periods[0];
                        let minDiff = Math.abs(calculatedPeriod - periods[0]);

                        for (let i = 1; i < periods.length; i++) {
                            const diff = Math.abs(calculatedPeriod - periods[i]);
                            if (diff < minDiff) {
                                minDiff = diff;
                                closestPeriod = periods[i];
                            }
                        }

                        onPeriodChange(closestPeriod);
                    }}
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
                    />
                </Slider>
                {/* Tick marks container */}
                <Flex
                    position="absolute"
                    w="full"
                    justify="space-between"
                    bottom="-32px"
                >
                    {periods.map(period => (
                        <Tick key={period} value={period} />
                    ))}
                </Flex>
            </Box>
        </Box>
    );
};

export default PaybackPeriodSlider;