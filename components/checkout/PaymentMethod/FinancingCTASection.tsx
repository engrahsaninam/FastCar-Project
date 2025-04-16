import React from 'react';
import { Box, Button, Center, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons';
import { FinancingCTAProps } from '../types/financing';

const FinancingCTASection: React.FC<FinancingCTAProps> = ({
    heading = " Need more details about our financing offer?",
    subText = "You can verify financing options without obligation. You will receive the results within 240 minutes.",
    primaryButtonText = "Know More & Fill Details",
    // secondaryButtonText = "I will pay in full",
    helpText = "Need some advice?",
    phoneHours = "Mo-Su 8 am-8 pm",
    phoneNumber = "+39 02 8736 1995",
    onPrimaryClick,
    // onSecondaryClick
}) => {
    return (
        <Box mt={10}>
            {/* Heading and description */}
            <Text
                fontSize="20px"
                fontWeight="bold"
                color="#0E2160"
                mb="8px"
                lineHeight="1.2"
            >
                {heading}
            </Text>
            <Text
                fontSize="16px"
                color="#4A5568"
                mb="24px"
                lineHeight="1.5"
            >
                {subText}
            </Text>

            {/* CTA Buttons */}
            <Flex
                direction={{ base: "column", sm: "row" }}
                gap="16px"
                width="100%"
                justifyContent="center"
                mb="32px"
            >
                <Button
                    bg="#E53E3E"
                    color="white"
                    height="48px"
                    fontSize="16px"
                    fontWeight="semibold"
                    borderRadius="4px"
                    width={{ base: "100%", sm: "50%" }}
                    _hover={{ bg: "#C53030" }}
                    onClick={onPrimaryClick}
                >
                    {primaryButtonText}
                </Button>
                {/* <Button
                    variant="outline"
                    borderColor="#E53E3E"
                    color="#1A202C"
                    height="48px"
                    fontSize="16px"
                    fontWeight="semibold"
                    borderRadius="4px"
                    width={{ base: "100%", sm: "50%" }}
                    _hover={{ bg: "gray.50" }}
                    onClick={onSecondaryClick}
                >
                    {secondaryButtonText}
                </Button> */}
            </Flex>

            {/* Gray Background Advice Section */}
            <Box
                bg="#F7FAFC"
                border="#E53E3E"
                py={4}
                mx={-5}
                mt={8}
                position="relative"
                left={0}
                right={0}
                width="calc(100% + 40px)"
                borderBottomLeftRadius="lg"
                borderBottomRightRadius="lg"
                marginBottom={-5}
            >
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection={{ base: "column", sm: "row" }}
                    gap={{ base: "16px", sm: 0 }}
                    px={5}
                >
                    <Text
                        color="#4A5568"
                        fontWeight="medium"
                        fontSize="16px"
                    >
                        {helpText}
                    </Text>
                    <HStack
                        spacing="12px"
                        bg="white"
                        py="8px"
                        px="16px"
                        borderRadius="full"
                    >
                        <Icon as={PhoneIcon} color="#E53E3E" boxSize="18px" />
                        <Box>
                            <Text fontSize="12px" color="#718096" lineHeight="1.2">
                                {phoneHours}
                            </Text>
                            <Text fontWeight="bold" color="#1A202C" fontSize="16px">
                                {phoneNumber}
                            </Text>
                        </Box>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    );
};

export default FinancingCTASection;