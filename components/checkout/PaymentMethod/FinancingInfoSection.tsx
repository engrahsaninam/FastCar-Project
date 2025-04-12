import React from 'react';
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const FinancingInfoSection: React.FC = () => {
    return (
        <Box
            bg="red.50"
            borderRadius="md"
            p={4}
            mt={8}
            width="100%"
        >
            <Flex alignItems="flex-start" gap={3}>
                <Icon as={InfoIcon} color="red.500" boxSize={5} mt={0.5} />
                <Box>
                    <Text fontWeight="medium" color="red.900" mb={1}>
                        The installment already includes the selected transport and other additional services.
                    </Text>
                    <Text fontSize="sm" color="black.600">
                        When selecting other additional services, the advance payment and the installment are automatically recalculated.
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default FinancingInfoSection;