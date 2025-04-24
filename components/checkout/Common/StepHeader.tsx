import React from 'react';
import { Box, Text, Heading, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { StepHeaderProps } from '../types/steps';

const MotionBox = motion(Box);

export const StepHeader: React.FC<StepHeaderProps> = ({ step, title, isLocked, isActive }) => {
    const stepColor = useColorModeValue("red.500", "red.300");
    const titleColor = useColorModeValue("black", "white");

    return (
        <MotionBox
            mb={6}
            initial={false}
            animate={{ opacity: isLocked ? 0.4 : 1 }}
        >
            <Text fontSize="xs" fontWeight="medium" mb={1} color={stepColor}>
                {step}
            </Text>
            <Heading as="h2" fontSize="xl" fontWeight="bold" color={titleColor}>
                {title}
            </Heading>
        </MotionBox>
    );
};

export default StepHeader;