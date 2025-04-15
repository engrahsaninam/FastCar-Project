import React from 'react';
import { Box, Heading, Stack, FormControl, FormLabel } from '@chakra-ui/react';
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission is handled via the radio button onChange
    };

    return (
        <Box w="full" as="section" aria-labelledby="payment-method-heading">
            <Heading
                as="h3"
                fontSize="15px"
                fontWeight="semibold"
                color="gray.900"
                mb={4}
                id="payment-method-heading"
            >
                Are you interested in financing?
            </Heading>

            <form onSubmit={handleSubmit}>
                <FormControl as="fieldset" role="radiogroup" aria-labelledby="payment-method-heading">
                    <FormLabel as="legend" srOnly>Payment Method Options</FormLabel>
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
                </FormControl>
            </form>
        </Box>
    );
};

export default PaymentMethodStep;