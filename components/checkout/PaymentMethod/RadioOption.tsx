import React from 'react';
import { Box, Text, Input, Flex, useColorModeValue } from '@chakra-ui/react';
import { RadioOptionProps } from '../types/forms';

export const RadioOption: React.FC<RadioOptionProps> = ({
    id,
    label,
    isSelected,
    onChange,
    isDisabled = false,
    applicationSent = false,
    isMobile = false
}) => {
    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const selectedBgColor = useColorModeValue("red.500", "red.600");
    const selectedHoverBgColor = useColorModeValue("red.600", "red.500");
    const selectedActiveBgColor = useColorModeValue("red.700", "red.400");

    const hoverBgColor = useColorModeValue("red.50", "red.900");
    const activeBgColor = useColorModeValue("red.100", "red.800");

    const textColor = useColorModeValue("gray.800", "gray.200");
    const selectedTextColor = "white";

    const disabledBgColor = useColorModeValue("#CBD5E0", "gray.600");
    const disabledTextColor = useColorModeValue("white", "gray.400");

    const borderColor = useColorModeValue("#E53E3E", "#FC8181");

    // Create a custom style to be applied directly in JSX with dark mode support
    const redBorderStyle = {
        border: `1px solid ${useColorModeValue('#E53E3E', '#FC8181')}`,
        boxShadow: useColorModeValue('0 0 0 3px rgba(229, 62, 62, 0.1)', '0 0 0 3px rgba(252, 129, 129, 0.2)')
    };

    const redRadio = {
        border: `1px solid ${useColorModeValue('#E53E3E', '#FC8181')}`,
    };

    if (id === 'financing' && applicationSent) {
        return (
            <Box
                as="label"
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={isMobile ? 4 : 3}
                borderRadius="md"
                bg={disabledBgColor}
                flex="1"
                cursor="not-allowed"
                shadow="md"
                aria-disabled="true"
                style={redBorderStyle}
            >
                <Flex
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    bg={bgColor}
                    border={`2px solid ${borderColor}`}
                    alignItems="center"
                    justifyContent="center"
                    aria-hidden="true"
                />
                <Text fontSize={isMobile ? "md" : "sm"} color={disabledTextColor} fontWeight="medium">
                    Application sent
                </Text>
                <Input
                    type="radio"
                    name="payment-method"
                    value={id}
                    checked={true}
                    onChange={() => { }}
                    display="none"
                    disabled={true}
                    border='2px'
                    style={redRadio}
                    borderColor={borderColor}
                    aria-label={`Financing application sent`}
                />
            </Box>
        );
    }

    return (
        <Box
            as="label"
            htmlFor={`payment-method-${id}`}
            display="flex"
            alignItems="center"
            gap={3}
            px={4}
            py={isMobile ? 4 : 3}
            borderRadius="md"
            bg={isSelected ? selectedBgColor : bgColor}
            cursor={isDisabled ? "not-allowed" : "pointer"}
            flex="1"
            transition="all 0.2s"
            shadow="md"
            style={redBorderStyle}
            sx={{
                'border': `0.5px solid ${borderColor} !important`,
                '&:hover': {
                    border: `0.5px solid ${borderColor} !important`
                },
                '&:active': {
                    border: `0.5px solid ${borderColor} !important`
                }
            }}
            _hover={{
                bg: !isDisabled && (isSelected ? selectedHoverBgColor : hoverBgColor),
                shadow: !isDisabled && "lg"
            }}
            _active={{
                shadow: !isDisabled && "sm",
                bg: !isDisabled && (isSelected ? selectedActiveBgColor : activeBgColor)
            }}
            opacity={isDisabled ? 0.6 : 1}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
        >
            <Flex
                w={isMobile ? "24px" : "20px"}
                h={isMobile ? "24px" : "20px"}
                borderRadius="full"
                borderWidth="2px"
                borderColor={borderColor}
                bg={isSelected ? selectedBgColor : bgColor}
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
                aria-hidden="true"
            >
                {isSelected && (
                    <Box
                        w={isMobile ? "12px" : "10px"}
                        h={isMobile ? "12px" : "10px"}
                        borderRadius="full"
                        bg="white"
                    />
                )}
            </Flex>

            <Text
                fontSize={isMobile ? "md" : "sm"}
                color={isSelected ? selectedTextColor : textColor}
                fontWeight="medium"
            >
                {label}
            </Text>

            <Input
                id={`payment-method-${id}`}
                type="radio"
                name="payment-method"
                value={id}
                checked={isSelected}
                onChange={() => !isDisabled && onChange(id)}
                display="none"
                style={redRadio}
                disabled={isDisabled}
                aria-label={label}
            />
        </Box>
    );
};

export default RadioOption;
