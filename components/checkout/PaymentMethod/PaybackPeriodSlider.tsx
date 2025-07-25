import React from 'react';
import {
    Box,
    Flex,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    useColorModeValue
} from '@chakra-ui/react';
import { PaybackPeriodSliderProps } from '../types/financing';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/app/i18/useLanguage';

const PaybackPeriodSlider: React.FC<PaybackPeriodSliderProps> = ({
    paybackPeriod,
    onPeriodChange,
    selectedOption
}) => {

    const { t } = useTranslation();

    // Define the periods based on the selected financing option (in months)
    const periods = selectedOption === 'low-installment'
        ? [12, 24, 36, 48, 60, 72, 84, 96, 108, 120]
        : [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];

    // Color mode values
    const textColor = useColorModeValue("gray.900", "white");
    const sliderTrackBg = useColorModeValue("gray.200", "gray.600");
    const sliderFilledTrackBg = useColorModeValue("red.500", "red.400");
    const thumbBorderColor = useColorModeValue("red.500", "red.400");
    const activeMarkColor = useColorModeValue("red.500", "red.300");
    const inactiveMarkColor = useColorModeValue("gray.500", "gray.400");

    // Find the index of the current period in the periods array
    const currentIndex = periods.indexOf(paybackPeriod);

    // Convert index to percentage for slider
    const sliderValue = currentIndex >= 0 ? (currentIndex / (periods.length - 1)) * 100 : 0;

    // Convert months to years with decimal
    const getYearsDisplay = (months: number) => {
        const years = months / 12;
        return t('calculator.years', { count: years });
    };

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
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color={textColor}>
                    {t('calculator.paybackPeriod')}
                </Text>
                <Text fontWeight="bold" color={textColor}>
                    {getYearsDisplay(paybackPeriod)}
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
                    <SliderTrack bg={sliderTrackBg} h="8px" borderRadius="full">
                        <SliderFilledTrack bg={sliderFilledTrackBg} />
                    </SliderTrack>
                    <SliderThumb
                        boxSize={5}
                        bg={useColorModeValue("white", "gray.800")}
                        borderWidth="2px"
                        borderColor={thumbBorderColor}
                        boxShadow="md"
                        _focus={{
                            boxShadow: "outline"
                        }}
                    />

                    {/* Marks for each period */}
                    {periods.map((period, index) => {
                        const percentage = (index / (periods.length - 1)) * 100;
                        const years = period / 12;
                        return (
                            <SliderMark
                                key={period}
                                value={percentage}
                                mt={8}
                                ml={-1.5}
                                fontSize="xs"
                                color={paybackPeriod === period ? activeMarkColor : inactiveMarkColor}
                                fontWeight={paybackPeriod === period ? "bold" : "normal"}
                                cursor="pointer"
                                onClick={() => handlePeriodClick(period)}
                                _hover={{
                                    color: activeMarkColor
                                }}
                            >
                                {years}
                            </SliderMark>
                        );
                    })}
                </Slider>
            </Box>
        </Box>
    );
};

export default PaybackPeriodSlider;