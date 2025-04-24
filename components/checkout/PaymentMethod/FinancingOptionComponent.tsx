import React from 'react';
import { Box, Text, Badge, Flex, useColorModeValue } from '@chakra-ui/react';
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

    // Color mode values
    const selectedBg = useColorModeValue("red.500", "red.600");
    const selectedHoverBg = useColorModeValue("red.600", "red.500");
    const unselectedBg = useColorModeValue("gray.200", "gray.600");
    const unselectedHoverBg = useColorModeValue("gray.300", "gray.500");
    const selectedTextColor = "white";
    const unselectedTextColor = useColorModeValue("gray.400", "gray.300");

    const selectedDescriptionColor = useColorModeValue("gray.900", "white");
    const unselectedDescriptionColor = useColorModeValue("gray.400", "gray.400");

    const badgeBg = useColorModeValue("red.100", "red.800");
    const badgeColor = useColorModeValue("gray.800", "white");

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
                bg={isSelected ? selectedBg : unselectedBg}
                color={isSelected ? selectedTextColor : unselectedTextColor}
                _hover={{
                    bg: isSelected ? selectedHoverBg : unselectedHoverBg
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
                            bg={badgeBg}
                            color={badgeColor}
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
                color={isSelected ? selectedDescriptionColor : unselectedDescriptionColor}
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