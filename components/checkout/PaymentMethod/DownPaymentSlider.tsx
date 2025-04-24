import React from 'react';
import {
    Box,
    Flex,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    useColorModeValue
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

    // Color mode values
    const textColor = useColorModeValue("gray.900", "white");
    const mutedTextColor = useColorModeValue("gray.600", "gray.400");
    const infoIconColor = useColorModeValue("gray.300", "gray.500");
    const sliderTrackBg = useColorModeValue("gray.200", "gray.600");
    const sliderFilledTrackBg = useColorModeValue("red.500", "red.400");
    const thumbBg = useColorModeValue("red.500", "red.400");
    const thumbBorderColor = useColorModeValue("white", "gray.800");

    const activeLabelColor = useColorModeValue("red.500", "red.300");
    const activeLabelHoverColor = useColorModeValue("red.600", "red.200");
    const inactiveLabelColor = useColorModeValue("gray.500", "gray.400");
    const inactiveLabelHoverColor = useColorModeValue("gray.700", "gray.300");

    const activeSegmentBg = useColorModeValue("transparent", "transparent");
    const inactiveSegmentBg = useColorModeValue("transparent", "transparent");
    const hoverSegmentBg = useColorModeValue("gray.200", "gray.500");
    const segmentBorderColor = useColorModeValue("white", "gray.800");

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
                    <Text fontWeight="medium" fontSize="sm" color={textColor}>Down payment (%)</Text>
                    <Box ml={1} cursor="help">
                        <InfoIcon boxSize="14px" color={infoIconColor} aria-label="info-Icon" />
                    </Box>
                </Flex>
                <Text fontWeight="bold" fontSize="sm" color={textColor}>
                    {downPayment}% = {formattedAmount}
                </Text>
            </Flex>

            {/* Background segments */}
            <Box position="relative" mb={6}>
                <Flex width="100%" height="24px" mb="16px">
                    {percentageSteps.map((step, i) => {
                        // Set background colors for segments
                        const bgColor = step === activeSegment ? activeSegmentBg : inactiveSegmentBg;
                        const hoverBg = step === activeSegment ? activeSegmentBg : hoverSegmentBg;

                        return (
                            <Box
                                key={step}
                                flex={1}
                                bg={bgColor}
                                borderLeftWidth={i === 0 ? 0 : "0px"}
                                borderColor={segmentBorderColor}
                                cursor="pointer"
                                transition="background-color 0.2s"
                                _hover={{ bg: hoverBg }}
                                onClick={() => onDownPaymentChange(step)}
                                borderRadius={
                                    i === 0
                                        ? "4px 0 0 4px"
                                        : i === percentageSteps.length - 1
                                            ? "0 4px 4px 0"
                                            : "0"
                                }
                                boxShadow={step === activeSegment ? "sm" : "none"}
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
                        ml={-2}
                        value={downPayment}
                        onChange={(val: number) => onDownPaymentChange(val)}
                    >
                        <SliderTrack bg={sliderTrackBg} height="4px" borderRadius="2px">
                            <SliderFilledTrack bg={sliderFilledTrackBg} />
                        </SliderTrack>
                        <SliderThumb
                            boxSize="24px"
                            bg={thumbBg}
                            borderWidth="3px"
                            borderColor={thumbBorderColor}
                            boxShadow="0 1px 3px rgba(0,0,0,0.2)"
                            _focus={{
                                boxShadow: `0 0 0 3px ${useColorModeValue("rgba(229, 62, 62, 0.2)", "rgba(229, 62, 62, 0.3)")}`
                            }}
                            _hover={{
                                boxShadow: "0 1px 5px rgba(0,0,0,0.3)"
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
                            color={activeSegment === step ? activeLabelColor : inactiveLabelColor}
                            cursor="pointer"
                            onClick={() => onDownPaymentChange(step)}
                            textAlign="center"
                            width="40px"
                            ml={step === minPercentage ? "-15px" : 0}
                            mr={step === maxPercentage ? "-15px" : 0}
                            _hover={{
                                color: activeSegment === step ? activeLabelHoverColor : inactiveLabelHoverColor
                            }}
                        >
                            {step}%
                        </Text>
                    ))}
                </Flex>
            </Box>

            {/* Last payment section */}
            <Flex justify="space-between" align="center" mt={2}>
                <Text fontWeight="medium" fontSize="sm" color={mutedTextColor}>
                    Last payment
                </Text>
                <Text fontWeight="bold" fontSize="sm" color={textColor}>
                    {lastPaymentPercentage}% = {lastPaymentAmount}
                </Text>
            </Flex>
        </Box>
    );
};

export default DownPaymentSlider;