import React from 'react';
import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { ChevronRight, Check } from 'lucide-react';
import { StepItemProps } from '../types/steps';

const StepItem = ({
    title,
    isFirst,
    isLocked,
    showChevron,
    isActive,
    onClick,
    isCompleted,
}: StepItemProps) => {
    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedTextColor = useColorModeValue("gray.600", "gray.400");
    const activeBgColor = useColorModeValue("gray.50", "gray.700");
    const checkBgColor = useColorModeValue("green.500", "green.400");
    const lockedColor = useColorModeValue("gray.300", "gray.600");

    const handleClick = () => {
        if (!isLocked && onClick) {
            onClick(!isActive);
        }
    };

    return (
        <Flex
            py={3}
            px={6}
            alignItems="center"
            justifyContent="space-between"
            borderTop={!isFirst ? "1px solid" : undefined}
            borderColor={borderColor}
            bg={isActive ? activeBgColor : bgColor}
            cursor={isLocked ? "not-allowed" : "pointer"}
            opacity={isLocked ? 0.5 : 1}
            onClick={handleClick}
            transition="all 0.2s ease"
            _hover={{
                bg: !isLocked ? activeBgColor : undefined,
            }}
        >
            <Flex gap={3} alignItems="center">
                {isCompleted ? (
                    <Flex
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg={checkBgColor}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Icon as={Check} color="white" boxSize="16px" />
                    </Flex>
                ) : null}
                <Text fontWeight="medium" fontSize="sm" color={isLocked ? lockedColor : textColor}>
                    {title}
                </Text>
            </Flex>
            {showChevron && (
                <Icon
                    as={ChevronRight}
                    boxSize="20px"
                    color={isLocked ? lockedColor : mutedTextColor}
                    transform={isActive ? "rotate(90deg)" : undefined}
                    transition="transform 0.2s ease"
                />
            )}
        </Flex>
    );
};

export default StepItem;