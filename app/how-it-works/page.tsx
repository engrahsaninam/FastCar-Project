'use client'
import React from 'react';
import Layout from "@/components/layout/Layout"
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Flex,
    Button,
    Image,
    Grid,
    GridItem,
    Icon,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Link from 'next/link';

const steps = [
    {
        number: "01",
        title: "Choose a car",
        description: "We process over 7 million ads every day, but we recommend only 10% of them for purchase. With the remaining cars, something often \"doesn't fit\" us.",
        image: "/choose.jpg"
    },
    {
        number: "02",
        title: "We check up the car",
        description: "We do not own cars in our offer, so we must first thoroughly check them. We know specific models and motorizations perfectly and we know what to focus on for each of them.",
        image: "/check.jpg"
    },
    {
        number: "03",
        title: "Order and pay",
        description: "You can either pay for the car with your own money or use financing via Fast4Car. We have above-standard conditions agreed with many verified banks.",
        image: "/pay.jpg"
    },
    {
        number: "04",
        title: "We will provide a guarantee",
        description: "There's no risk to you when you buy a car on Fast4Car. We pride ourselves on transparency and the perfect condition of the cars.",
        image: "/4.jpg"
    },
    {
        number: "05",
        title: "We buy out the car",
        description: "We purchase the car and deregister it in its country of origin. Each country has its own regulations.",
        image: "/5.jpg"
    },
    {
        number: "06",
        title: "We deliver",
        description: "Whether we deliver the car directly to your doorstep or you pick it up at one of our pick-up points is entirely up to you.",
        image: "/order.jpg"
    }
];

const guarantees = [
    {
        icon: "/cashback.png",
        title: "Comprehensive Warranty",
        description: "Every vehicle comes with our premium warranty package covering major mechanical components for complete peace of mind."
    },
    {
        icon: "/payment-method.png",
        title: "Quality Verified",
        description: "Each car undergoes rigorous 150-point inspection by certified technicians to ensure top-tier quality and reliability."
    },
    {
        icon: "/guarantee.png",
        title: "Secure Transaction",
        description: "Your purchase is protected with our secure payment system and transparent documentation process."
    }
];

export default function HowItWorks() {
    const scrollToContent = () => {
        // Add smooth scroll functionality
        const content = document.getElementById('content');
        if (content) {
            content.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const cardBorder = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("gray.900", "gray.100");
    const subTextColor = useColorModeValue("gray.600", "gray.300");
    const hoverBgColor = useColorModeValue("gray.100", "gray.700");
    const hovertextColor = useColorModeValue("gray.900", "gray.100");
    const stepCardBg = useColorModeValue("white", "gray.800");
    const stepCardShadow = useColorModeValue("md", "dark-lg");
    const stepNumberColor = useColorModeValue("red.500", "red.300");
    return (
        <Layout >
            {/* Hero Section */}
            <Box position="relative" minH="100vh" bg={bgColor}>
                <Container maxW="container.xl" h="full">
                    <Grid
                        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                        gap={8}
                        minH="calc(100vh - 100px)"
                        alignItems="center"
                    >
                        {/* Left Content */}
                        <GridItem>
                            <Box maxW="600px">
                                <Heading
                                    as="h1"
                                    fontSize={{ base: "3xl", md: "5xl" }}
                                    color={textColor}
                                    fontWeight="bold"
                                    lineHeight="1.2"
                                >
                                    How does Fast4Car work?
                                </Heading>
                                <Text
                                    fontSize={{ base: "lg", md: "xl" }}
                                    color={textColor}
                                    mb={8}
                                    p={6}
                                    lineHeight="1.6"
                                >
                                    Simply. Choose a car. We will arrange a detailed inspection. Based on that you can decide whether you want the car. We then buy it, arrange an extended warranty, register it and deliver it to you.
                                </Text>
                                <Button
                                    leftIcon={<ChevronDownIcon />}
                                    colorScheme="red"
                                    size="lg"
                                    bg="#F56565"
                                    onClick={scrollToContent}
                                >
                                    I want to know more
                                </Button>
                            </Box>
                        </GridItem>
                        {/* Right Image */}
                        <GridItem display={{ base: 'none', lg: 'block' }}>
                            <Image
                                src="/car-ins.png"
                                alt="Car inspection"
                                objectFit="cover"
                                w="full"
                                h="full"
                                rounded="xl"
                            />
                        </GridItem>
                    </Grid>
                </Container>
                {/* Guarantee Cards */}
                <Box
                    mt={{ base: 8, md: -20 }}
                    zIndex="1"
                >
                    <Container maxW="container.xl">
                        <SimpleGrid
                            columns={{ base: 1, md: 3 }}
                            spacing={8}
                            bg={bgColor}
                            p={{ base: 4, md: 10 }}
                            rounded="3xl"
                            shadow="2xl"
                        >
                            {guarantees.map((item, index) => (
                                <Box
                                    key={index}
                                    position="relative"
                                    overflow="hidden"
                                    bg={cardBg}
                                    p={8}
                                    rounded="2xl"
                                    border="1px solid"
                                    borderColor={cardBorder}
                                    transition="all 0.4s ease"
                                    _hover={{
                                        transform: 'translateY(-8px)',
                                        shadow: '2xl',
                                        // borderColor: 'red.300',
                                        // bg: hoverBgColor,
                                        color: hovertextColor
                                    }}
                                >
                                    <Box
                                        position="absolute"
                                        top="0"
                                        right="0"
                                        w="100px"
                                        h="100px"
                                        bg="red.50"
                                        opacity="0.1"
                                        transform="rotate(45deg) translate(30%, -30%)"
                                        rounded="full"
                                    />
                                    <Flex
                                        direction="column"
                                        align="start"
                                        gap={6}
                                    >
                                        <Box
                                            bg="red.50"
                                            p={4}
                                            rounded="xl"
                                            transform="rotate(-5deg)"
                                        >
                                            <Image
                                                src={item.icon}
                                                alt={item.title}
                                                w="32px"
                                                h="32px"
                                                objectFit="contain"
                                            />
                                        </Box>
                                        <Box>
                                            <Heading
                                                size="md"
                                                color="red.500"
                                                fontWeight="bold"
                                                mb={3}
                                                fontSize="xl"
                                            >
                                                {item.title}
                                            </Heading>
                                            <Text
                                                color={subTextColor}
                                                fontSize="md"
                                                lineHeight="1.7"
                                            >
                                                {item.description}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Container>
                </Box>
            </Box>
            {/* Content sections will go here */}
            <Box id="content" pt={{ base:0, md: 0 }}>
                {/* Steps Section */}
                <Box py={20} bg={bgColor}>
                    <Container maxW="container.xl">
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                            {steps.map((step, index) => (
                                <Box
                                    key={index}
                                    bg={stepCardBg}
                                    p={0}
                                    borderRadius="xl"
                                    shadow={stepCardShadow}
                                    transition="all 0.3s"
                                    overflow="hidden"
                                    _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
                                >
                                    <Box position="relative" h="200px">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            objectFit="cover"
                                            w="100%"
                                            h="100%"
                                        />
                                        <Text
                                            position="absolute"
                                            top={4}
                                            left={4}
                                            color={stepNumberColor}
                                            fontSize="2xl"
                                            fontWeight="bold"
                                            textShadow="0 2px 4px rgba(0,0,0,0.3)"
                                        >
                                            {step.number}
                                        </Text>
                                    </Box>
                                    <Box p={6}>
                                        <Heading
                                            size="md"
                                            mb={4}
                                            color="red.500"
                                        >
                                            {step.title}
                                        </Heading>
                                        <Text
                                            color={subTextColor}
                                            fontSize="sm"
                                            lineHeight="1.6"
                                        >
                                            {step.description}
                                        </Text>
                                    </Box>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Container>
                </Box>
                {/* CTA Section */}
                <Box py={20} textAlign="center" bg={bgColor}>
                    <Container maxW="container.xl">
                        <VStack spacing={6}>
                            <Heading size="xl" color={textColor}>Try out how Fast4Car works.</Heading>
                            <Text fontSize="lg" color={subTextColor}>
                                Now all that's left is to choose your next car. We'll be delighted if it's from us.
                            </Text>
                            <Link href="/cars">
                                <Button
                                    size="lg"
                                    colorScheme="red"
                                    px={8}
                                    bg="#F56565"
                                    py={6}
                                    fontSize="lg"
                                >
                                    Show vehicles
                                </Button>
                            </Link>
                        </VStack>
                    </Container>
                </Box>
            </Box>
        </Layout>
    );
}
