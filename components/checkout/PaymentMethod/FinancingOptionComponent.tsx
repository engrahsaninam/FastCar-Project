import React from 'react';
import { Box, Text, Badge, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FinancingOption } from '../types/financing';

const MotionBox = motion(Box);

interface FinancingOptionComponentProps {
    option: FinancingOption;
    selectedOption: string;
    onSelect: (id: string) => void;
}

const FinancingOptionComponent: React.FC<FinancingOptionComponentProps> = ({
    option,
    selectedOption,
    onSelect
}) => {
    const isSelected = option.id === selectedOption;

    return (
        <Box flex="1" display="flex" flexDirection="column" alignItems="center">
            <MotionBox
                whileHover={{ scale: isSelected ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => onSelect(option.id)}
                borderRadius="lg"
                py={{ base: 2, md: 4 }}
                px={{ base: 3, md: 6 }}
                mb={{ base: 2, md: 4 }}
                cursor="pointer"
                bg={isSelected ? 'red.500' : 'gray.200'}
                color={isSelected ? 'white' : 'gray.400'}
                _hover={{
                    bg: isSelected ? 'red.500' : 'gray.300'
                }}
                width="auto"
                minWidth="150px"
                textAlign="center"
            >
                <Flex align="center" justify="center" gap={2}>
                    <Text fontWeight="medium" fontSize={{ base: 'xs', md: 'md' }}>
                        {option.title}
                    </Text>
                    {option.isNew && (
                        <Badge
                            px={{ base: 1, md: 1.5 }}
                            py={0.5}
                            fontSize={{ base: '9px', md: '11px' }}
                            fontWeight="medium"
                            bg="red.100"
                            color="gray.800"
                            borderRadius="md"
                        >
                            NEW
                        </Badge>
                    )}
                </Flex>
            </MotionBox>
            <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                textAlign="center"
                mt={4}
                color={isSelected ? 'gray.900' : 'gray.400'}
            >
                <Text
                    fontSize={{ base: 'md', md: '2xl' }}
                    fontWeight="bold"
                    mb={{ base: 0.5, md: 1 }}
                >
                    {option.percentage}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }}>
                    {option.description}
                </Text>
            </MotionBox>
        </Box>
    );
};

export default FinancingOptionComponent; 