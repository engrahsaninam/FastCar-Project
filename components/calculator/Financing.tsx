import { Box, Flex, Text, VStack, HStack, Icon, useBreakpointValue, Button, useColorModeValue, Container, Heading } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function FinancingCard() {
    const router = useRouter()
    const { t } = useTranslation();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const textColor = useColorModeValue("gray.900", "gray.100");
    const bgColor = useColorModeValue("gray.50", "gray.900");
    return (
        <Box bg={bgColor}>
            <Container maxW="container.xl" pb={5}>
                {/* Heading and Description */}
                <Box mb={10} textAlign="center" >
                    <Heading
                        as="h1"
                        fontSize={{ base: "3xl", md: "5xl" }}
                        color={textColor}
                        fontWeight={900}
                        lineHeight="1.2"
                        fontFamily='satoshi'
                        marginTop={['20px', '0px', '0px']}
                    >
                        {t('calculator.checkOneOfOurCars')}
                    </Heading>
                    <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        color={textColor}
                        mb={8}
                        p={6}
                        lineHeight="1.6"
                    >
                        {t('calculator.competitiveLoanOffer')}
                    </Text>
                </Box>
                {/* Centered Regular Loan Button */}
                <Flex justify="center" mb={4} mt={2}>
                    <Button
                        fontWeight="bold"
                        fontSize={{ base: 'md', md: 'lg' }}
                        colorScheme="red"
                        // borderRadius="20px"
                        px={{ base: 0, md: 10 }}
                        py={{ base: 0, md: 6 }}
                        boxShadow="lg"
                        minW="180px"
                        bg="#F56565"
                    >
                        {t('calculator.regularLoan')}
                    </Button>
                </Flex>
                {/* Financing Cards */}
                <Flex
                    direction={isMobile ? 'column' : 'row'}
                    align="stretch"
                    justify="center"
                    gap={8}
                    w="full"
                    p={{ base: 4, md: 0 }}
                // mb={8}
                >
                    {/* Left: Gradient Card */}
                    <Box flexBasis={isMobile ? 'auto' : '340px'}>
                        <Box
                            bgGradient="linear(to-br, red.700, red.500, red.300)"
                            color={textColor}
                            borderRadius="2xl"
                            boxShadow="lg"
                            px={8}
                            py={10}
                            position="relative"
                            minW="280px"
                            maxW="360px"
                            textAlign="center"
                            mt={{ base: 0, md: 0 }}
                            _before={{
                                content: '""',
                                position: 'absolute',
                                right: '-16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '32px',
                                height: '48px',
                                bg: 'white',
                                borderRadius: 'full',
                                zIndex: 1,
                                display: isMobile ? 'none' : 'block',
                            }}
                            _after={{
                                content: '""',
                                position: 'absolute',
                                left: '-16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '32px',
                                height: '48px',
                                bg: 'white',
                                borderRadius: 'full',
                                zIndex: 1,
                                display: isMobile ? 'none' : 'block',
                            }}
                        >
                            <Text fontSize="lg" fontWeight="medium" opacity={0.85} mb={2}>
                                {t('calculator.monthlyInstalment')}
                            </Text>
                            <Text fontSize="5xl" fontWeight="bold" mb={1}>
                                441 €
                            </Text>
                            <Text fontSize="md" opacity={0.85} mb={8}>
                                {t('calculator.installments', { count: 48 })}
                            </Text>
                            <Text fontSize="2xl" fontWeight="extrabold" mb={4}>
                                {t('calculator.regularLoan')}
                            </Text>
                            <VStack align="start" spacing={3} mx="auto" maxW="fit-content">
                                <HStack spacing={3} align="flex-start">
                                    <Icon as={CheckCircleIcon} color="green.300" boxSize={5} mt={1} />
                                    <Text fontWeight="medium" textAlign="left">
                                        {t('calculator.evenInstallments')}
                                    </Text>
                                </HStack>
                                <HStack spacing={3} align="flex-start">
                                    <Icon as={CheckCircleIcon} color="green.300" boxSize={5} mt={1} />
                                    <Text fontWeight="medium" textAlign="left">
                                        {t('calculator.upToLoanDuration', { months: 96 })}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>
                    <Link href='/car'>
                        {/* Right: Details Card */}
                        <Box
                            flex={1}
                            bg={bgColor}
                            borderRadius="2xl"
                            boxShadow="md"
                            border="1px solid"
                            borderColor={["gray.200", "gray.700"]}
                            px={isMobile ? 4 : 10}
                            py={isMobile ? 6 : 10}
                            minW="320px"
                            maxW="520px"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            _hover={{
                                cursor: 'pointer',
                                transform: 'scale(1.02)',
                                transition: 'transform 0.3s ease-in-out',
                            }}
                        >
                            <Text fontSize="lg" fontWeight="medium" mb={4} textAlign="center">
                                {t('calculator.sampleCalculationFor', { car: 'Audi A3 2023' })}
                            </Text>

                            <Flex align="center" justify="center" direction="column" gap={4} mb={6}>
                                <Box minW="120px" maxW="160px" textAlign="center">
                                    <Image
                                        src="/audi-a3.webp"
                                        alt="Audi A3"
                                        width={160}
                                        height={90}
                                        style={{ width: "100%", height: "auto" }}
                                    />
                                </Box>
                            </Flex>
                            <VStack align="start" spacing={2} fontSize="md" color={textColor}>
                                <HStack w="full" justify="space-between">
                                    <Text fontWeight="bold" color={textColor}>{t('calculator.carPrice')}</Text>
                                    <Text fontWeight="bold">25 000 €</Text>
                                </HStack>
                                <HStack w="full" justify="space-between">
                                    <Text fontWeight="bold" color={textColor}>{t('calculator.downPayment')}</Text>
                                    <Text fontWeight="bold">30% / 7 500 €</Text>
                                </HStack>
                                <HStack w="full" justify="space-between">
                                    <Text fontWeight="bold" color={textColor}>{t('calculator.paybackPeriod')}</Text>
                                    <Text fontWeight="bold">48 months / 441 €</Text>
                                </HStack>
                                <HStack w="full" justify="space-between">
                                    <Text fontWeight="bold" color={textColor}>{t('calculator.numberOfInstallments')}</Text>
                                    <Text fontWeight="bold">48</Text>
                                </HStack>
                                <HStack w="full" justify="space-between">
                                    <Text fontWeight="bold" color={textColor}>{t('calculator.interestRateAPR')}</Text>
                                    <Text fontWeight="bold">8,45% / 10,137%</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </Link>
                </Flex>
            </Container>
        </Box>
    );
}
