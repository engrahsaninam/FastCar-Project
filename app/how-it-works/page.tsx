'use client'
import Layout from "@/components/layout/Layout"
import {  Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";

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
    useColorModeValue,
    IconButton,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    HStack,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { FaPlay, FaPause, FaBackward, FaForward } from "react-icons/fa";

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
   
    const [isHovered, setIsHovered] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
 

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    const nextStep = () => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
    };
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showOverlay, setShowOverlay] = useState(true);
    // Format time like mm:ss
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);

        video.addEventListener("timeupdate", updateTime);
        video.addEventListener("loadedmetadata", updateDuration);

        return () => {
            video.removeEventListener("timeupdate", updateTime);
            video.removeEventListener("loadedmetadata", updateDuration);
        };
    }, []);

    const handlePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
            setShowOverlay(false); // Hide overlay on play
        }

        setIsPlaying(!isPlaying);
    };

    const handleSliderChange = (value: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = value;
            setCurrentTime(value);
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
    };

    return (
        <Layout >
            {/* Hero Section */}
            <Box position="relative" minH="100vh" bg={bgColor}>
                <Container maxW="container.xl" h="full">
                    <Grid
                        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                        gap={8}
                        minH="fit-content"
                        alignItems="center"
                    >
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
                <div className='mb-60 '>
                    <Box bg={bgColor} padding={10} position={'relative'} display={'flex'} mt={10} justifyContent={'center'} alignItems={'center'} borderRadius="2xl" overflow="hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <Box w={{ base: "100%", md: "50%" }} position="relative">
                            {/* Video */}
                            <video
                                ref={videoRef}
                                src="/no_music.mp4"
                                poster="/thumbnail.png"
                                playsInline
                                loop
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                }}
                            />

                            {/* Overlay Play Button */}
                            {showOverlay && (
                                <Flex
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    right="0"
                                    bottom="0"
                                    align="center"
                                    justify="center"
                                    bg="rgba(0, 0, 0, 0.5)"
                                    zIndex="1"
                                    direction="column"
                                    onClick={handlePlayPause}
                                    cursor="pointer"
                                >
                                    <Box
                                        bg="orange.400"
                                        borderRadius="full"
                                        w="70px"
                                        h="70px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        boxShadow="lg"
                                    >
                                        <FaPlay color="white" size="24px" />
                                    </Box>
                                    <Text color="white" fontWeight="bold" mt={2}>
                                        Play video
                                    </Text>
                                </Flex>
                            )}

                            {/* Controls */}
                            <Flex align="center" mt={2} gap={3}>
                                <IconButton
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                                    onClick={handlePlayPause}
                                    size="sm"
                                />
                                <Text fontSize="sm" minW="40px">
                                    {formatTime(currentTime)}
                                </Text>
                                <Box flex="1" mx={2}>
                                    <input
                                        type="range"
                                        value={currentTime}
                                        min={0}
                                        max={duration || 1}
                                        step={0.1}
                                        onChange={(e) => handleSliderChange(Number(e.target.value))}
                                        style={{ width: "100%" }}
                                    />
                                </Box>
                                <Text fontSize="sm" minW="40px">
                                    {formatTime(duration)}
                                </Text>
                            </Flex>
                        </Box>
                        
                    </Box>
                </div>
                {/* Guarantee Cards */}
                <Box
                    mt={{ base: 8, md: -20 }}
                    zIndex="1"
                >
                    <Container maxW="container.xl">
                        {/* Desktop View */}
                        <SimpleGrid
                            columns={{ base: 1, md: 3 }}
                            spacing={8}
                            bg={bgColor}
                            p={{ base: 4, md: 10 }}
                            rounded="3xl"
                            shadow="2xl"
                            display={{ base: "none", md: "grid" }}
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

                        {/* Mobile View - Accordion */}
                        <Box
                            display={{ base: "block", md: "none" }}
                            bg={bgColor}
                            p={4}
                            rounded="3xl"
                            shadow="2xl"
                        >
                            <Accordion allowMultiple>
                                {guarantees.map((item, index) => (
                                    <AccordionItem
                                        key={index}
                                        border="none"
                                        mb={4}
                                        bg={cardBg}
                                        rounded="xl"
                                        overflow="hidden"
                                    >
                                        <AccordionButton
                                            py={4}
                                            px={6}
                                            _hover={{ bg: "transparent" }}
                                        >
                                            <Flex align="center" flex="1">
                                                <Box
                                                    bg="red.50"
                                                    p={2}
                                                    rounded="lg"
                                                    mr={4}
                                                >
                                                    <Image
                                                        src={item.icon}
                                                        alt={item.title}
                                                        w="24px"
                                                        h="24px"
                                                        objectFit="contain"
                                                    />
                                                </Box>
                                                <Heading
                                                    size="sm"
                                                    color="red.500"
                                                    fontWeight="bold"
                                                    flex="1"
                                                    textAlign="left"
                                                >
                                                    {item.title}
                                                </Heading>
                                                <AccordionIcon color="red.500" />
                                            </Flex>
                                        </AccordionButton>
                                        <AccordionPanel pb={4} px={6}>
                                            <Text
                                                color={subTextColor}
                                                fontSize="sm"
                                                lineHeight="1.6"
                                            >
                                                {item.description}
                                            </Text>
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Box>
                    </Container>
                </Box>
            </Box>

            {/* Content sections will go here */}
            <Box id="content" pt={{ base: 0, md: 0 }}>
                {/* Steps Section */}
                <Box py={20} bg={bgColor}>
                    <Container maxW="container.xl">
                        <Box position="relative">
                            {/* Navigation Arrows */}
                            <IconButton
                                aria-label="Previous step"
                                icon={<ChevronLeftIcon />}
                                position="absolute"
                                left="-4"
                                top="50%"
                                transform="translateY(-50%)"
                                zIndex={2}
                                onClick={prevStep}
                                colorScheme="red"
                                variant="solid"
                                borderRadius="full"
                                display={{ base: "none", md: "flex" }}
                            />
                            <IconButton
                                aria-label="Next step"
                                icon={<ChevronRightIcon />}
                                position="absolute"
                                right="-4"
                                top="50%"
                                transform="translateY(-50%)"
                                zIndex={2}
                                onClick={nextStep}
                                colorScheme="red"
                                variant="solid"
                                borderRadius="full"
                                display={{ base: "none", md: "flex" }}
                            />

                            {/* Steps Carousel */}
                            <Box
                                position="relative"
                                overflow="hidden"
                                borderRadius="xl"
                                bg={stepCardBg}
                                shadow={stepCardShadow}
                            >
                                <Box
                                    display="flex"
                                    transition="transform 0.3s ease"
                                    transform={`translateX(-${currentStep * 100}%)`}
                                >
                                    {steps.map((step, index) => (
                                        <Box
                                            key={index}
                                            minW="100%"
                                            p={6}
                                            display="flex"
                                            flexDirection={{ base: "column", md: "row" }}
                                            gap={8}
                                        >
                                            <Box
                                                position="relative"
                                                flex="1"
                                                h={{ base: "200px", md: "400px" }}
                                                borderRadius="xl"
                                                overflow="hidden"
                                            >
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
                                            <Box flex="1" display="flex" flexDirection="column" justifyContent="center">
                                                <Heading
                                                    size="lg"
                                                    mb={4}
                                                    color="red.500"
                                                >
                                                    {step.title}
                                                </Heading>
                                                <Text
                                                    color={subTextColor}
                                                    fontSize="lg"
                                                    lineHeight="1.6"
                                                >
                                                    {step.description}
                                                </Text>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            {/* Step Indicators */}
                            <Flex justify="center" mt={6} gap={2}>
                                {steps.map((_, index) => (
                                    <Box
                                        key={index}
                                        w="3"
                                        h="3"
                                        borderRadius="full"
                                        bg={currentStep === index ? "red.500" : "gray.300"}
                                        cursor="pointer"
                                        onClick={() => setCurrentStep(index)}
                                        transition="all 0.3s"
                                        _hover={{ bg: "red.400" }}
                                    />
                                ))}
                            </Flex>
                        </Box>
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
