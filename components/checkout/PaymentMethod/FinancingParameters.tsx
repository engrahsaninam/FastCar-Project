import React from 'react';
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Link,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { FinancingParametersProps } from '../types/financing';

const FinancingParameters: React.FC<FinancingParametersProps> = ({
    downPayment,
    downPaymentAmount,
    installmentPeriod,
    interestRate,
    // APR,
    monthlyPayment
}) => {
    // Use responsive layout based on screen size
    const layout = useBreakpointValue({
        base: "mobile", // Android/mobile style (stacked)
        md: "desktop"   // Desktop style (horizontal)
    });

    // Mobile/Android layout (stacked two-column grid)
    if (layout === "mobile") {
        return (
            <Box mt={8} width="100%">
                <Heading
                    as="h3"
                    fontSize={{ base: "18px", sm: "20px" }}
                    fontWeight="bold"
                    color="#0E2160"
                    mb={4}
                >
                    Parameters of your financing option.
                </Heading>

                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    overflow="hidden"
                    bg="white"
                    p={4}
                    width="100%"
                >
                    <Grid
                        templateColumns="1fr 1fr"
                        templateRows="repeat(4, auto)"
                        gap={3}
                        width="100%"
                    >
                        {/* Left column - labels */}
                        <GridItem>
                            <Text fontSize="xs" fontWeight="medium" color="#4B4B4BFF" mb={3}>
                                DOWNPAYMENT ({downPayment} %)
                            </Text>
                        </GridItem>

                        {/* Right column - values */}
                        <GridItem textAlign="right">
                            <Text fontSize="md" fontWeight="semibold" color="#1F2937" mb={3}>
                                €{downPaymentAmount?.toLocaleString()}
                            </Text>
                        </GridItem>

                        <GridItem>
                            <Text fontSize="xs" fontWeight="medium" color="#4B4B4BFF" mb={3}>
                                INSTALLMENT
                            </Text>
                        </GridItem>

                        <GridItem textAlign="right">
                            <Text fontSize="md" fontWeight="semibold" color="#1F2937" mb={3}>
                                {installmentPeriod}
                            </Text>
                        </GridItem>

                        <GridItem>
                            <Text fontSize="xs" fontWeight="medium" color="#4B4B4BFF" mb={3}>
                                INTEREST RATE / APR
                            </Text>
                        </GridItem>

                        <GridItem textAlign="right">
                            <Text fontSize="md" fontWeight="semibold" color="#1F2937" mb={3}>
                                {interestRate} %
                                {/* / {APR} % */}
                            </Text>
                        </GridItem>

                        <GridItem>
                            <Text fontSize="xs" fontWeight="medium" color="#E53E3E" mb={3}>
                                MONTHLY
                            </Text>
                        </GridItem>

                        <GridItem textAlign="right">
                            <Text fontSize="md" fontWeight="semibold" color="#E53E3E" mb={3}>
                                €{monthlyPayment}
                            </Text>
                        </GridItem>
                    </Grid>
                </Box>

                <Box textAlign="center" mt={4}>
                    <Link
                        href="#"
                        color="#E53E3E"
                        fontWeight="medium"
                        fontSize="14px"
                        textDecoration="underline"
                    >
                        How does the Low Instalment Financing work?
                    </Link>
                </Box>
            </Box>
        );
    }

    // Desktop layout (horizontal flex)
    return (
        <Box mt={8} px="15px">
            <Heading
                as="h3"
                fontSize={{ base: "20px", lg: "24px" }}
                fontWeight="bold"
                color="#0E2160"
                mb={4}
            >
                Parameters of your financing option.
            </Heading>

            <Box
                borderWidth="1px"
                borderRadius="lg"
                borderColor="gray.200"
                overflow="hidden"
                bg="white"
            >
                <Flex
                    justify="space-between"
                    alignItems="center"
                    py={5}
                    px={6}
                    flexWrap={{ base: "wrap", lg: "nowrap" }}
                    gap={{ base: 4, lg: 2 }}
                >
                    <Box flex="1" minW={{ base: "45%", lg: "auto" }}>
                        <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color="#4B4B4BFF"
                            textTransform="uppercase"
                            mb={2}
                        >
                            DOWNPAYMENT ({downPayment} %)
                        </Text>
                        <Text
                            fontSize={{ base: "md", lg: "lg" }}
                            fontWeight="medium"
                            color="#1F2937"
                        >
                            €{downPaymentAmount?.toLocaleString()}
                        </Text>
                    </Box>

                    <Box flex="1" minW={{ base: "45%", lg: "auto" }}>
                        <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color="#4B4B4BFF"
                            textTransform="uppercase"
                            mb={2}
                        >
                            INSTALLMENT 
                        </Text>
                        <Text
                            fontSize={{ base: "md", lg: "lg" }}
                            fontWeight="medium"
                            color="#1F2937"
                        >
                            {installmentPeriod} months
                        </Text>
                    </Box>

                    <Box flex="1" minW={{ base: "45%", lg: "auto" }}>
                        <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color="#4B4B4BFF"
                            textTransform="uppercase"
                            mb={2}
                        >
                            INTEREST RATE 
                            {/* / APR */}
                        </Text>
                        <Text
                            fontSize={{ base: "md", lg: "lg" }}
                            fontWeight="medium"
                            color="#1F2937"
                        >
                            {interestRate} %
                            {/* % / {APR} % */}
                        </Text>
                    </Box>

                    <Box flex="1" minW={{ base: "45%", lg: "auto" }}>
                        <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color="#E53E3E"
                            textTransform="uppercase"
                            mb={2}
                        >
                            MONTHLY
                        </Text>
                        <Text
                            fontSize={{ base: "md", lg: "lg" }}
                            fontWeight="medium"
                            color="#E53E3E"
                        >
                            €{monthlyPayment}
                        </Text>
                    </Box>
                </Flex>
            </Box>

            <Flex justify="center" mt={4}>
                <Link
                    href="#"
                    color="#E53E3E"
                    fontWeight="medium"
                    fontSize="14px"
                    textDecoration="underline"
                >
                    How does the Low Instalment Financing work?
                </Link>
            </Flex>
        </Box>
    );
};

export default FinancingParameters;