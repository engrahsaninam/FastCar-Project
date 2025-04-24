import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepContentProps } from '../types/steps';

const MotionBox = motion(Box);

export const StepContent: React.FC<StepContentProps> = ({ children, isActive }) => {
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const bgColor = useColorModeValue("white", "gray.800");

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <MotionBox
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                    borderTop="1px solid"
                    borderColor={borderColor}
                    bg={bgColor}
                >
                    {children}
                </MotionBox>
            )}
        </AnimatePresence>
    );
};

export default StepContent;