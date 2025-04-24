import React from 'react';
import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const FinancingInfoSection: React.FC = () => {
    // Color mode values
    const bgColor = useColorModeValue("red.50", "red.900");
    const iconColor = useColorModeValue("red.500", "red.300");
    const titleColor = useColorModeValue("red.900", "red.100");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const borderColor = useColorModeValue("red.100", "red.800");

    return (
        <Box
            bg={bgColor}
            borderRadius="md"
            p={4}
            mt={8}
            width="100%"
            borderWidth="1px"
            borderColor={borderColor}
        >
            <Flex alignItems="flex-start" gap={3}>
                <Icon as={InfoIcon} color={iconColor} boxSize={5} mt={0.5} aria-label="info-Icon" />
                <Box>
                    <Text fontWeight="medium" color={titleColor} mb={1}>
                        The installment already includes the selected transport and other additional services.
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                        When selecting other additional services, the advance payment and the installment are automatically recalculated.
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default FinancingInfoSection;