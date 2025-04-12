import React, { useState } from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, TimeIcon, CheckIcon } from '@chakra-ui/icons';
import { StepItemProps } from '../types/steps';

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

export const StepItem: React.FC<StepItemProps> = ({
    title,
    badge,
    isLocked,
    isFirst,
    showChevron,
    isActive,
    onClick,
    isCompleted
}) => {
    const [isExpanded, setIsExpanded] = useState(isActive);

    const handleClick = () => {
        if (!isLocked && showChevron) {
            setIsExpanded(!isExpanded);
            onClick?.(!isExpanded);
        }
    };

    const bgColor = useColorModeValue('white', 'gray.800');
    const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
    const textColor = isLocked ? 'gray.400' : 'gray.800';

    return (
        <MotionFlex
            onClick={handleClick}
            align="center"
            justify="space-between"
            p={4}
            cursor={isLocked ? 'not-allowed' : 'pointer'}
            bg={bgColor}
            shadow={isFirst ? 'sm' : 'none'}
            borderBottomWidth={isFirst ? '1px' : '0'}
            pb={isFirst ? 5 : 4}
            opacity={isLocked ? 0.7 : 1}
            _hover={{
                bg: isLocked ? bgColor : hoverBgColor,
            }}
        >
            <Flex align="center" gap={3}>
                {isCompleted ? (
                    <Flex
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg="green.500"
                        align="center"
                        justify="center"
                    >
                        <CheckIcon w="16px" h="16px" color="white" />
                    </Flex>
                ) : (
                    <TimeIcon w="20px" h="20px" color={isLocked ? 'gray.400' : 'red.500'} />
                )}
                <Text fontSize="15px" fontWeight="semibold" color={textColor}>
                    {title}
                </Text>
            </Flex>

            <Flex align="center" gap={2}>
                {badge && (
                    <MotionBox
                        px={2}
                        py={0.5}
                        fontSize="11px"
                        fontWeight="medium"
                        bg="#ffeef6"
                        color="#f88181"
                        borderRadius="md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {badge}
                    </MotionBox>
                )}
                {showChevron && (
                    <MotionBox
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDownIcon w="20px" h="20px" color="gray.400" />
                    </MotionBox>
                )}
            </Flex>
        </MotionFlex>
    );
};

export default StepItem;