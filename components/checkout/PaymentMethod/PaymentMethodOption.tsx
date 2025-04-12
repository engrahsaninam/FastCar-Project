import React from 'react';
import {
    Box,
    Text,
    useRadio,
    UseRadioProps,
    HStack,
} from '@chakra-ui/react';

interface PaymentMethodOptionProps extends UseRadioProps {
    title: string;
    description: string;
    icon: string;
}

const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = (props) => {
    const { title, description, icon, ...radioProps } = props;
    const { getInputProps, getRadioProps, state } = useRadio(radioProps);

    return (
        <Box as="label" cursor={props.isDisabled ? 'not-allowed' : 'pointer'}>
            <input {...getInputProps()} />
            <Box
                {...getRadioProps()}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg={state.isChecked ? 'blue.50' : 'white'}
                borderColor={state.isChecked ? 'blue.500' : 'gray.200'}
                _hover={{
                    borderColor: state.isChecked ? 'blue.500' : 'gray.300',
                }}
                opacity={props.isDisabled ? 0.6 : 1}
            >
                <HStack spacing={3}>
                    <Text fontSize="xl">{icon}</Text>
                    <Box>
                        <Text fontWeight="medium">{title}</Text>
                        <Text fontSize="sm" color="gray.600">
                            {description}
                        </Text>
                    </Box>
                </HStack>
            </Box>
        </Box>
    );
};
export default PaymentMethodOption

