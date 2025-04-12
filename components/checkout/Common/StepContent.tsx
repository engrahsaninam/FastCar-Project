import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepContentProps } from '../types/steps';

const MotionBox = motion(Box);

export const StepContent: React.FC<StepContentProps> = ({ children, isActive }) => (
    <AnimatePresence>
        {isActive && (
            <MotionBox
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                overflow="hidden"
            >
                {children}
            </MotionBox>
        )}
    </AnimatePresence>
);

export default StepContent;