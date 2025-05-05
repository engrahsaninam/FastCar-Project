import React from 'react';
import { Box, Text, Container, Heading, SimpleGrid, Image, Flex, useColorModeValue } from '@chakra-ui/react';

const FinancingWorkflow = () => {
    const textColor = useColorModeValue("gray.900", "gray.100");
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const steps = [
        {
            number: "01.",
            title: "Select your car",
            description:
                "Browse our extensive selection of over 1,000,000 verified vehicles across Europe, then click the “Buy” button to get started.",
            image: "/f-w-1.jpg",
        },
        {
            number: "02.",
            title: "Complete the online form",
            description:
                "Click the “I'm interested in financing” option and fill out the short application. We'll handle the rest from there.",
            image: "/f-w-2.jpg",
        },
        {
            number: "03.",
            title: "Receive your financing quote",
            description:
                "We’ll forward your application to our lending partners and get back to you with personalized financing options.",
            image: "/f-w-3.jpg",
        },
    ];


    return (
        <Box py={24} bg={bgColor}>
            <Container maxW="container.xl">
                <Box mb={10} textAlign="center">
                    <Heading
                        as="h2"
                        fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                        fontWeight="extrabold"
                        color={textColor}
                        mb={4}
                    >
                        How does Fast4Car financing work?
                    </Heading>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} padding={10}>
                    {steps.map((step, index) => (
                        <Box key={index} position="relative">
                            <Flex
                                direction="column"
                                align="center"
                                position="relative"
                            >
                                <Box
                                    position="relative"
                                    mb={6}
                                    w="full"
                                    h="200px"
                                    borderRadius="xl"
                                    overflow="hidden"
                                >
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        w="full"
                                        h="full"
                                        objectFit="cover"
                                    />
                                </Box>

                                <Text
                                    color="red.500"
                                    fontSize="lg"
                                    fontWeight="bold"
                                    mb={2}
                                >
                                    {step.number}
                                </Text>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={textColor}
                                    mb={3}
                                    textAlign="center"
                                >
                                    {step.title}
                                </Text>
                                <Text
                                    color={textColor}
                                    textAlign="center"
                                    fontSize="md"
                                >
                                    {step.description}
                                </Text>
                            </Flex>

                            {index < 2 && (
                                <Box
                                    position="absolute"
                                    top="25%"
                                    right="-10%"
                                    transform="translateY(-50%)"
                                    display={{ base: 'none', md: 'block' }}
                                >
                                    <svg
                                        width="40"
                                        height="24"
                                        viewBox="0 0 40 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.39339C28.9289 0.807609 27.9792 0.807609 27.3934 1.39339C26.8076 1.97917 26.8076 2.92892 27.3934 3.51471L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z"
                                            fill="#E53E3E"
                                        />
                                    </svg>
                                </Box>
                            )}
                        </Box>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default FinancingWorkflow; 