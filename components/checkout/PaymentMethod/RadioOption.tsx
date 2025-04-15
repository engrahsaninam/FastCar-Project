import React from 'react';
import { Box, Text, Input, Flex } from '@chakra-ui/react';
import { RadioOptionProps } from '../types/forms';

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
                borderWidth="1px"
                borderColor="red"
                bg="#CBD5E0"
                flex="1"
                cursor="not-allowed"
                shadow="md"
                aria-disabled="true"
            >
                <Flex
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    bg="white"
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
            borderWidth="1px"
            borderColor={isSelected ? "red.500" : "gray.300"}
            bg={isSelected ? "#ffe5e5" : "white"}
            cursor={isDisabled ? "not-allowed" : "pointer"}
            flex="1"
            transition="all 0.2s"
            shadow="md"
            _hover={{
                borderColor: !isDisabled && "red.500",
                bg: !isDisabled && "#ffe5e5",
                shadow: !isDisabled && "lg"
            }}
            _active={{
                shadow: !isDisabled && "sm",
                bg: !isDisabled && "#ffe5e5"
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
                borderWidth="6px"
                borderColor={isSelected ? "red.500" : "gray.300"}
                bg={isSelected ? "red.500" : "white"}
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
                aria-hidden="true"
            >
                <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg="white"
                />
            </Flex>

            <Text fontSize="sm" color="#1A202C" fontWeight="medium">
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
                disabled={isDisabled}
                aria-label={label}
            />
        </Box>
    );
};

export default RadioOption;
