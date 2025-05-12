import React from 'react';
import {
    Box,
    Flex,
    Text,
    Grid,
    GridItem,
    Divider,
    useColorModeValue,
    useBreakpointValue,
} from '@chakra-ui/react';

interface FinancingParametersProps {
    downPayment: number;
    downPaymentAmount: number;
    installmentPeriod: number;
    interestRate: string;
    APR: string;
    monthlyPayment: number;
}

const FinancingParameters: React.FC<FinancingParametersProps> = ({
    downPayment,
    downPaymentAmount,
    installmentPeriod,
    interestRate,
    APR,
    monthlyPayment,
}) => {
    // Responsive values
    const isMobile = useBreakpointValue({ base: true, sm: false });
    const fontSize = useBreakpointValue({ base: "xs", sm: "sm" });
    const titleSize = useBreakpointValue({ base: "sm", sm: "md" });
    const amountSize = useBreakpointValue({ base: "md", sm: "lg" });
    const gridTemplateColumns = useBreakpointValue({
        base: "repeat(2, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)"
    });
    const padding = useBreakpointValue({ base: 3, sm: 4 });
    const spacing = useBreakpointValue({ base: 2, sm: 3 });

    // Color values
    const bgColor = useColorModeValue("gray.50", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.600", "gray.400");
    const amountColor = useColorModeValue("red.500", "red.300");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    return (
        <Box
            bg={bgColor}
            p={padding}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
        >
            <Grid
                templateColumns={gridTemplateColumns}
                gap={spacing}
            >
                <GridItem>
                    <ParameterItem
                        title="Down payment"
                        value={`${downPayment}% (€${downPaymentAmount.toLocaleString()})`}
                        fontSize={fontSize}
                        titleSize={titleSize}
                        textColor={textColor}
                        mutedColor={mutedColor}
                    />
                </GridItem>

                <GridItem>
                    <ParameterItem
                        title="Installment period"
                        value={`${installmentPeriod} months`}
                        fontSize={fontSize}
                        titleSize={titleSize}
                        textColor={textColor}
                        mutedColor={mutedColor}
                    />
                </GridItem>

                <GridItem>
                    <ParameterItem
                        title="Interest rate"
                        value={`${interestRate}%`}
                        fontSize={fontSize}
                        titleSize={titleSize}
                        textColor={textColor}
                        mutedColor={mutedColor}
                    />
                </GridItem>

                <GridItem>
                    <ParameterItem
                        title="APR"
                        value={`${APR}%`}
                        fontSize={fontSize}
                        titleSize={titleSize}
                        textColor={textColor}
                        mutedColor={mutedColor}
                    />
                </GridItem>
            </Grid>

            <Divider my={spacing} borderColor={borderColor} />

            <Flex direction="column" align="flex-end">
                <Text fontSize={fontSize} color={mutedColor}>
                    Monthly payment
                </Text>
                <Text
                    fontSize={amountSize}
                    fontWeight="bold"
                    color={amountColor}
                >
                    €{monthlyPayment.toLocaleString()}
                </Text>
            </Flex>
        </Box>
    );
};

interface ParameterItemProps {
    title: string;
    value: string;
    fontSize: string | object | undefined;
    titleSize: string | object | undefined;
    textColor: string;
    mutedColor: string;
}

const ParameterItem: React.FC<ParameterItemProps> = ({
    title,
    value,
    fontSize,
    titleSize,
    textColor,
    mutedColor,
}) => {
    return (
        <Box>
            <Text fontSize={fontSize} color={mutedColor}>
                {title}
            </Text>
            <Text fontSize={titleSize} fontWeight="medium" color={textColor}>
                {value}
            </Text>
        </Box>
    );
};

export default FinancingParameters;