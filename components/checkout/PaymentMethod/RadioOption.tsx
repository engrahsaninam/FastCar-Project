import React from 'react';
import { Box, Text, Input, Flex } from '@chakra-ui/react';
import { Circle } from 'lucide-react';
import { RadioOptionProps } from '../types/forms';

export const RadioOption: React.FC<RadioOptionProps> = ({
    id,
    label,
    isSelected,
    onChange,
    isDisabled = false,
    applicationSent = false
}) => {
    // Special case for application sent
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
                bg="gray.300"
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
                >
                    <Circle size={12} />
                </Flex>
                <Text
                    fontSize="sm"
                    color="white"
                    fontWeight="medium"
                >
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

    // Standard radio button styling
    const isActive = isSelected && !isDisabled;

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
            cursor={isDisabled ? "not-allowed" : "pointer"}
            flex="1"
            transition="all 0.2s ease-in-out"
            bg={isActive ? "white" : "gray.50"}
            borderColor={isActive ? "red.500" : "gray.200"}
            opacity={isDisabled ? 0.8 : 1}
            _hover={{
                borderColor: !isDisabled && (isActive ? "red.500" : "gray.300"),
                bg: !isDisabled && (isActive ? "white" : "gray.100")
            }}
        >
            <Flex
                w="20px"
                h="20px"
                borderRadius="full"
                borderWidth={isActive ? "6px" : "1px"}
                borderColor={isActive ? "red.500" : "gray.300"}
                bg="white"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
            />
            <Text
                fontSize="sm"
                color="gray.700"
                fontWeight="medium"
            >
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