import { Box, Flex, Text, VStack, HStack, Icon, useBreakpointValue, Button } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import Image from 'next/image';

export default function FinancingCard() {
    const isMobile = useBreakpointValue({ base: true, md: false });
    return (
        <Box w="full" maxW="900px" mx="auto" py={10}>
            {/* Heading and Description */}
            <Box mb={10} textAlign="center">
                <Text as="h2" fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="extrabold" color="#232F5B" mb={4}>
                    Car Loan Calculator
                </Text>
                <Text fontSize={{ base: 'md', md: 'lg' }} color="#232F5B" fontWeight="semibold">
                    Get a competitive loan offer. Apply with us today.<br />
                    Unlock the best rates and terms for your car loan with our easy application process.
                </Text>
            </Box>
            {/* Centered Regular Loan Button */}
            <Flex justify="center" mb={4} mt={2}>
                <Button
                    fontWeight="bold"
                    fontSize={{ base: 'md', md: 'lg' }}
                    colorScheme="red"
                    // borderRadius="20px"
                    px={10}
                    py={6}
                    boxShadow="lg"
                    minW="180px"
                >
                    Regular loan
                </Button>
            </Flex>
            {/* Financing Cards */}
            <Flex
                direction={isMobile ? 'column' : 'row'}
                align="stretch"
                justify="center"
                gap={8}
                w="full"
                mb={8}
            >
                {/* Left: Gradient Card */}
                <Box flexBasis={isMobile ? 'auto' : '340px'}>
                    <Box
                        bgGradient="linear(to-br, red.700, red.500, red.300)"
                        color="white"
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
                            Monthly instalment
                        </Text>
                        <Text fontSize="5xl" fontWeight="bold" mb={1}>
                            441 €
                        </Text>
                        <Text fontSize="md" opacity={0.85} mb={8}>
                            48 installments
                        </Text>
                        <Text fontSize="2xl" fontWeight="extrabold" mb={4}>
                            Regular loan
                        </Text>
                        <VStack align="start" spacing={3} mx="auto" maxW="fit-content">
                            <HStack spacing={3} align="flex-start">
                                <Icon as={CheckCircleIcon} color="green.300" boxSize={5} mt={1} />
                                <Text fontWeight="medium" textAlign="left">
                                    Even installments
                                </Text>
                            </HStack>
                            <HStack spacing={3} align="flex-start">
                                <Icon as={CheckCircleIcon} color="green.300" boxSize={5} mt={1} />
                                <Text fontWeight="medium" textAlign="left">
                                    Up to 96 months<br />loan duration
                                </Text>
                            </HStack>
                        </VStack>
                    </Box>
                </Box>

                {/* Right: Details Card */}
                <Box
                    flex={1}
                    bg="gray.50"
                    borderRadius="2xl"
                    boxShadow="md"
                    px={isMobile ? 4 : 10}
                    py={isMobile ? 6 : 10}
                    minW="320px"
                    maxW="520px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                >
                    <Text fontSize="lg" fontWeight="medium" mb={4} textAlign="center">
                        Sample calculation for{" "}
                        <Text as="span" fontWeight="bold" color="blue.700">
                            Audi A3 2023
                        </Text>
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
                    <VStack align="start" spacing={2} fontSize="md" color="gray.700">
                        <HStack w="full" justify="space-between">
                            <Text fontWeight="bold" color="gray.500">CAR PRICE</Text>
                            <Text fontWeight="bold">25 000 €</Text>
                        </HStack>
                        <HStack w="full" justify="space-between">
                            <Text fontWeight="bold" color="gray.500">DOWN PAYMENT</Text>
                            <Text fontWeight="bold">30% / 7 500 €</Text>
                        </HStack>
                        <HStack w="full" justify="space-between">
                            <Text fontWeight="bold" color="gray.500">PAYBACK PERIOD</Text>
                            <Text fontWeight="bold">48 months / 441 €</Text>
                        </HStack>
                        <HStack w="full" justify="space-between">
                            <Text fontWeight="bold" color="gray.500">NUMBER OF INSTALLMENTS</Text>
                            <Text fontWeight="bold">48</Text>
                        </HStack>
                        <HStack w="full" justify="space-between">
                            <Text fontWeight="bold" color="gray.500">INTEREST RATE/APR</Text>
                            <Text fontWeight="bold">8,45% / 10,137%</Text>
                        </HStack>
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
}
