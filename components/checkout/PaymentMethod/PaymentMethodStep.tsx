import React from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { PaymentMethodStepProps } from '../types/forms';
import RadioOption from './RadioOption';

export const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({
    selected,
    onSelect,
    applicationSent = false
}) => {
    const options = [
        {
            id: 'financing',
            label: "Yes, I'm interested"
        },
        {
            id: 'bank-transfer',
            label: "No, I want to pay by bank transfer"
        }
    ];

    return (
        <Box w="full">
            <Heading as="h3" fontSize="15px" fontWeight="semibold" color="gray.900" mb={4}>
                Are you interested in financing?
            </Heading>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                {options.map((option) => (
                    <RadioOption
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        isSelected={selected === option.id}
                        onChange={onSelect}
                        isDisabled={applicationSent && option.id === 'financing'}
                        applicationSent={applicationSent && option.id === 'financing'}
                    />
                ))}
            </Stack>
        </Box>
    );
};

export default PaymentMethodStep;