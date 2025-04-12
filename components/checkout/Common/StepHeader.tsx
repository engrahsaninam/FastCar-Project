import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { StepHeaderProps } from '../types/steps';

const MotionBox = motion(Box);

export const StepHeader: React.FC<StepHeaderProps> = ({ step, title, isLocked, isActive }) => (
    <MotionBox
        mb={6}
        initial={false}
        animate={{ opacity: isLocked ? 0.4 : 1 }}
    >
        <Text fontSize="xs" fontWeight="medium" mb={1} color="red.500">
            {step}
        </Text>
        <Heading as="h2" fontSize="xl" fontWeight="bold" color="gray.900">
            {title}
        </Heading>
    </MotionBox>
);

export default StepHeader;