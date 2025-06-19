'use client'
import Layout from "@/components/layout/Layout"
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

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
        titleKey: "howItWorks.step1.title",
        descriptionKey: "howItWorks.step1.description",
        image: "/choose.jpg"
    },
    {
        number: "02",
        titleKey: "howItWorks.step2.title",
        descriptionKey: "howItWorks.step2.description",
        image: "/check.jpg"
    },
    {
        number: "03",
        titleKey: "howItWorks.step3.title",
        descriptionKey: "howItWorks.step3.description",
        image: "/pay.jpg"
    },
    {
        number: "04",
        titleKey: "howItWorks.step4.title",
        descriptionKey: "howItWorks.step4.description",
        image: "/4.jpg"
    },
    {
        number: "05",
        titleKey: "howItWorks.step5.title",
        descriptionKey: "howItWorks.step5.description",
        image: "/5.jpg"
    },
    {
        number: "06",
        titleKey: "howItWorks.step6.title",
        descriptionKey: "howItWorks.step6.description",
        image: "/order.jpg"
    }
];

const guarantees = [
    {
        icon: "/cashback.png",
        titleKey: "howItWorks.guarantee1.title",
        descriptionKey: "howItWorks.guarantee1.description"
    },
    {
        icon: "/payment-method.png",
        titleKey: "howItWorks.guarantee2.title",
        descriptionKey: "howItWorks.guarantee2.description"
    },
    {
        icon: "/guarantee.png",
        titleKey: "howItWorks.guarantee3.title",
        descriptionKey: "howItWorks.guarantee3.description"
    }
];

export default function HowItWorks() {
    const { t } = useTranslation();

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

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            setShowOverlay(true);
            video.currentTime = 0;
        };

        video.addEventListener("timeupdate", updateTime);
        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", updateTime);
            video.removeEventListener("loadedmetadata", updateDuration);
            video.removeEventListener("ended", handleEnded);
        };
    }, []);

    const handlePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
            setShowOverlay(false);
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
                                    fontWeight={900}
                                    lineHeight="1.2"
                                    fontFamily='satoshi'
                                    marginTop={['20px', '0px', '0px']}
                                >
                                    {t('howItWorks.hero.title')}
                                </Heading>
                                <Text
                                    fontSize={{ base: "lg", md: "xl" }}
                                    color={textColor}
                                    mb={8}
                                    p={6}
                                    lineHeight="1.6"
                                >
                                    {t('howItWorks.hero.description')}
                                </Text>
                                <Button
                                    leftIcon={<ChevronDownIcon />}
                                    colorScheme="red"
                                    size="lg"
                                    bg="#F56565"
                                    onClick={scrollToContent}
                                >
                                    {t('howItWorks.hero.cta')}
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
                                    bg="rgba(0, 0, 0, 0.2)"
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
                                        {t('howItWorks.video.playButton')}
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
                                    <Slider
                                        value={currentTime}
                                        min={0}
                                        max={duration > 0 ? duration : 1}
                                        step={0.1}
                                        onChange={handleSliderChange}
                                    >
                                        <SliderTrack>
                                            <SliderFilledTrack bg="red.500" />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
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
                                                alt={t(item.titleKey)}
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
                                                {t(item.titleKey)}
                                            </Heading>
                                            <Text
                                                color={subTextColor}
                                                fontSize="md"
                                                lineHeight="1.7"
                                            >
                                                {t(item.descriptionKey)}
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
                                                        alt={t(item.titleKey)}
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
                                                    {t(item.titleKey)}
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
                                                {t(item.descriptionKey)}
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
                                aria-label={t('howItWorks.navigation.previous')}
                                icon={<ChevronLeftIcon />}
                                position="absolute"
                                left={{ base: "2", md: "-4" }}
                                top="50%"
                                transform="translateY(-50%)"
                                zIndex={2}
                                onClick={prevStep}
                                bg={'red.500'}
                                _active={{ bg: 'red.500' }}
                                _hover={{ bg: 'red.500' }}
                                variant="solid"
                                borderRadius="full"
                                size={{ base: "sm", md: "md" }}
                                display="flex"
                            />
                            <IconButton
                                aria-label={t('howItWorks.navigation.next')}
                                icon={<ChevronRightIcon />}
                                position="absolute"
                                right={{ base: "2", md: "-4" }}
                                top="50%"
                                transform="translateY(-50%)"
                                zIndex={2}
                                onClick={nextStep}
                                // colorScheme="red"
                                bg={'red.500'}
                                variant="solid"
                                borderRadius="full"
                                _active={{ bg: 'red.500' }}
                                _hover={{ bg: 'red.500' }}
                                size={{ base: "sm", md: "md" }}
                                display="flex"
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
                                                    alt={t(step.titleKey)}
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
                                                    {t(step.titleKey)}
                                                </Heading>
                                                <Text
                                                    color={subTextColor}
                                                    fontSize="lg"
                                                    lineHeight="1.6"
                                                >
                                                    {t(step.descriptionKey)}
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
                            <Heading size="xl" color={textColor}>{t('howItWorks.cta.title')}</Heading>
                            <Text fontSize="lg" color={subTextColor}>
                                {t('howItWorks.cta.description')}
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
                                    {t('howItWorks.cta.button')}
                                </Button>
                            </Link>
                        </VStack>
                    </Container>
                </Box>
            </Box>
        </Layout>
    );
}
