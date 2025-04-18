import React from 'react';
import { Box, Text, Input, Flex } from '@chakra-ui/react';
import { RadioOptionProps } from '../types/forms';

// Create a custom style to be applied directly in JSX
const redBorderStyle = {
    border: '1px solid #E53E3E',
    boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)'
};
const redRadio = {
    border: '1px solid #E53E3E',
};

export const RadioOption: React.FC<RadioOptionProps> = ({
    id,
    label,
    isSelected,
    onChange,
    isDisabled = false,
    applicationSent = false
}) => {
    if (id === 'financing' && applicationSent) {
        return (
            <Box
                as="label"
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="md"
                bg="#CBD5E0"
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
                    bg="white"
                    border="2px solid #E53E3E"
                    alignItems="center"
                    justifyContent="center"
                    aria-hidden="true"
                />
                <Text fontSize="sm" color="white" fontWeight="medium">
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
                    borderColor='red.500'
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
            py={3}
            borderRadius="md"
            bg={isSelected ? "red.500" : "white"}
            cursor={isDisabled ? "not-allowed" : "pointer"}
            flex="1"
            transition="all 0.2s"
            shadow="md"
            style={redBorderStyle}
            sx={{
                'border': '0.5px solid #E53E3E !important',
                '&:hover': {
                    border: '0.5px solid #E53E3E !important'
                },
                '&:active': {
                    border: '0.5px solid #E53E3E !important'
                }
            }}
            _hover={{
                bg: !isDisabled && (isSelected ? "red.600" : "red.50"),
                shadow: !isDisabled && "lg"
            }}
            _active={{
                shadow: !isDisabled && "sm",
                bg: !isDisabled && (isSelected ? "red.700" : "red.100")
            }}
            opacity={isDisabled ? 0.6 : 1}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}

        >
            <Flex
                w="20px"
                h="20px"
                borderRadius="full"
                borderWidth="2px"
                borderColor="#E53E3E"
                bg={isSelected ? "#E53E3E" : "white"}
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
                aria-hidden="true"
                style={{ borderColor: "#E53E3E" }}
            >
                {isSelected && (
                    <Box
                        w="10px"
                        h="10px"
                        borderRadius="full"
                        bg="white"
                    />
                )}
            </Flex>

            <Text
                fontSize="sm"
                color={isSelected ? "white" : "gray.800"}
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
