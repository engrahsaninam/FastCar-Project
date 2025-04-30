import React from 'react';
import { Box, Text, Flex, Input, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FinancingOption } from '../checkout/types/financing';

const MotionBox = motion(Box);

interface OptionFProps {
    option: FinancingOption;
    selectedOption: string;
    onSelect: (id: string) => void;
    onPriceChange: (price: number) => void;
    totalPrice: number;
}

const OptionF: React.FC<OptionFProps> = ({
    option,
    selectedOption,
    onSelect,
    onPriceChange,
    totalPrice
}) => {
    const isSelected = option.id === selectedOption;

    // Color mode values
    const selectedBg = useColorModeValue("red.500", "red.600");
    const unselectedBg = useColorModeValue("gray.200", "gray.600");
    const selectedTextColor = "white";
    const unselectedTextColor = useColorModeValue("gray.700", "gray.300");

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        onPriceChange(Number(value));
    };

    return (
        <Box w="100%">
            <Box
                w="100%"
                bg={isSelected ? selectedBg : unselectedBg}
                color={isSelected ? selectedTextColor : unselectedTextColor}
                borderRadius="lg"
                p={4}
            >
                <Flex align="center" justify="space-between" gap={4}>
                    <Text fontWeight="semibold" fontSize="md">
                        {option.title}
                    </Text>
                    <Flex align="center" gap={2}>
                        <Text fontSize="sm">€</Text>
                        <Input
                            value={totalPrice || ''}
                            onChange={handlePriceChange}
                            placeholder="Enter price"
                            size="sm"
                            width="120px"
                            textAlign="right"
                            variant="filled"
                            bg="white"
                            color="gray.800"
                            _hover={{ bg: "gray.50" }}
                            _focus={{ bg: "white" }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Flex>
                </Flex>
            </Box>
            <Box textAlign="center" mt={6} mb={4}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={1}>
                    {option.percentage}
                </Text>
                <Text fontSize="sm" color="gray.600">
                    {option.description}
                </Text>
            </Box>
        </Box>
    );
};

export default OptionF; 