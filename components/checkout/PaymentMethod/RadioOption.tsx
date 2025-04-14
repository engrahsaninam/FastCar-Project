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
                borderColor="transparent"
                bg="#CBD5E0"
                flex="1"
                cursor="not-allowed"
            >
                <Flex
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    bg="white"
                    alignItems="center"
                    justifyContent="center"
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
                />
            </Box>
        );
    }

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
            borderColor={isSelected ? "red.500" : "gray.300"}
            bg="white"
            cursor={isDisabled ? "not-allowed" : "pointer"}
            flex="1"
            transition="all 0.2s"
            _hover={{
                borderColor: !isDisabled && "red.500"
            }}
            opacity={isDisabled ? 0.6 : 1}
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
                type="radio"
                name="payment-method"
                value={id}
                checked={isSelected}
                onChange={() => !isDisabled && onChange(id)}
                display="none"
                disabled={isDisabled}
            />
        </Box>
    );
};

export default RadioOption;
