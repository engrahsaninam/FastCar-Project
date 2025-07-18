'use client';

import React, { useState, memo, useMemo, useCallback } from 'react';
import {
    Box, Button, Flex, Text, Image, Icon, VStack, HStack, useBreakpointValue, useColorModeValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Car, ArrowRight } from 'lucide-react';
import { slides } from './slides';
import { animations } from './animations';
import type { ControlsProps, MobileViewProps, DesktopViewProps, Slide } from './CarType';

// Motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Controls = memo(({ current, total, onPrev, onNext, onDotClick }: ControlsProps) => {
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const activeDotBg = useColorModeValue("red.500", "red.400");
    const completedDotBg = useColorModeValue("green.500", "green.400");
    const inactiveDotBg = useColorModeValue("gray.200", "gray.600");
    const activeDotShadow = useColorModeValue("0 0 0 2px var(--chakra-colors-red-200)", "0 0 0 2px var(--chakra-colors-red-700)");
    const tooltipBg = useColorModeValue("gray.900", "gray.800");
    const hoverBgColor = useColorModeValue("gray.100", "gray.700");

    return (
        <Flex
            alignItems="center"
            justifyContent="space-between"
            mt={4}
            pt={4}
            px={4}
            borderTopWidth="0.54rem"
            borderColor={borderColor}
        >
            <HStack spacing={2}>
                {Array.from({ length: total }, (_, i) => (
                    <MotionButton
                        key={i}
                        variant="unstyled"
                        onClick={() => onDotClick(i + 1)}
                        {...animations.scale}
                        position="relative"
                        role="group"
                        minW="auto"
                        height="auto"
                        padding={0}
                        aria-label={`Go to ${slides[i].tag}`}
                    >
                        <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            transition="colors 0.2s"
                            bg={current === i + 1 ? activeDotBg : current > i + 1 ? completedDotBg : inactiveDotBg}
                            {...(current === i + 1 && { boxShadow: activeDotShadow })}
                        />
                        <Text
                            position="absolute"
                            top="-8"
                            left="50%"
                            transform="translateX(-50%)"
                            px={2}
                            py={1}
                            bg={tooltipBg}
                            color="white"
                            fontSize="xs"
                            borderRadius="md"
                            opacity={0}
                            _groupHover={{ opacity: 1 }}
                            transition="opacity 0.2s"
                            pointerEvents="none"
                        >
                            {slides[i].tag}
                        </Text>
                    </MotionButton>
                ))}
            </HStack>

            <HStack spacing={1}>
                <MotionButton
                    onClick={onPrev}
                    isDisabled={current === 1}
                    {...animations.scale}
                    variant="ghost"
                    p={1.5}
                    borderRadius="lg"
                    _hover={{ bg: hoverBgColor }}
                    _disabled={{ opacity: 0.4 }}
                    aria-label="Previous slide"
                >
                    <Icon as={ChevronLeft} boxSize={4} aria-hidden="true" />
                </MotionButton>
                <MotionButton
                    onClick={onNext}
                    isDisabled={current === total}
                    {...animations.scale}
                    variant="ghost"
                    p={1.5}
                    borderRadius="lg"
                    _hover={{ bg: hoverBgColor }}
                    _disabled={{ opacity: 0.4 }}
                    aria-label="Next slide"
                >
                    <Icon as={ChevronRight} boxSize={4} aria-hidden="true" />
                </MotionButton>
            </HStack>
        </Flex>
    );
});

Controls.displayName = 'Controls';

interface SlideContentProps {
    slide: Slide;
    direction: number;
}

const SlideContent = memo(({ slide, direction }: SlideContentProps) => {
    const IconComponent = slide.icon;
    const boxBg = useColorModeValue("red.50", "red.900");
    const iconBg = useColorModeValue("red.50", "red.900");
    const iconColor = useColorModeValue("gray.700", "gray.100");
    const tagColor = useColorModeValue("gray.500", "gray.400");
    const titleColor = useColorModeValue("gray.900", "white");
    const subTitleColor = useColorModeValue("gray.600", "gray.400");
    const contentColor = useColorModeValue("gray.600", "gray.300");
    const cardBg = useColorModeValue("white", "gray.800");
    const priceLabelColor = useColorModeValue("gray.500", "gray.400");
    const priceColor = useColorModeValue("red.500", "red.300");

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 40 : -40,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (dir: number) => ({
            x: dir < 0 ? 40 : -40,
            opacity: 0
        })
    };

    return (
        <MotionBox
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
            as={VStack}
            spacing={{ base: 3, md: 4 }}
        >
            <Box bg={boxBg} p={{ base: 4, md: 6 }} borderRadius="xl" width="full">
                <Flex alignItems="flex-start" gap={3} mb={{ base: 4, md: 6 }}>
                    <MotionBox
                        {...animations.scale}
                        p={{ base: 1.5, md: 2 }}
                        bg={iconBg}
                        borderRadius="lg"
                        flexShrink={0}
                    >
                        <Icon as={IconComponent} boxSize={{ base: 4, md: 5 }} color={iconColor} />
                    </MotionBox>
                    <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} color={tagColor}>{slide.tag}</Text>
                        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={titleColor}>{slide.title}</Text>
                        {slide.subTitle && (
                            <Text fontSize={{ base: "xs", md: "sm" }} color={subTitleColor} mt={1}>{slide.subTitle}</Text>
                        )}
                    </Box>
                </Flex>

                <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 4, md: 6 }}
                >
                    <Box
                        width={{ base: "full", md: "240px" }}
                        height={{ base: "180px", md: "auto" }}
                        flexShrink={0}
                    >
                        <MotionBox
                            position="relative"
                            overflow="hidden"
                            borderRadius="lg"
                            height="100%"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "tween", duration: 0.2 }}
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                objectFit="cover"
                                width="100%"
                                height="100%"
                                loading="lazy"
                            />
                        </MotionBox>
                    </Box>

                    <Box flex="1">
                        {slide.price ? (
                            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                                <Text fontSize={{ base: "sm", md: "md" }} color={contentColor}>{slide.content}</Text>
                                <Box bg={cardBg} p={{ base: 3, md: 4 }} borderRadius="lg">
                                    <Text fontSize={{ base: "xs", md: "sm" }} color={priceLabelColor} textTransform="uppercase">{slide.priceLabel}</Text>
                                    <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={priceColor} mt={1}>{slide.price}</Text>
                                </Box>
                            </VStack>
                        ) : (
                            <Box bg={cardBg} p={{ base: 3, md: 4 }} borderRadius="lg">
                                <Text fontSize={{ base: "sm", md: "md" }} color={contentColor}>{slide.content}</Text>
                            </Box>
                        )}
                    </Box>
                </Flex>
            </Box>
        </MotionBox>
    );
});

SlideContent.displayName = 'SlideContent';

const MobileView = memo(({ isMobileOpen, setIsMobileOpen, currentSlide, slides, nextSlide, prevSlide, setCurrentSlide, direction }: MobileViewProps) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const buttonBg = useColorModeValue("white", "gray.800");
    const buttonShadow = useColorModeValue("md", "dark-lg");
    const iconBg = useColorModeValue("red.50", "red.900");
    const iconColor = useColorModeValue("red.500", "red.300");
    const textColor = useColorModeValue("gray.900", "white");
    const arrowColor = useColorModeValue("gray.400", "gray.500");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const closeButtonActiveBg = useColorModeValue("gray.100", "gray.700");

    return (
        <>
            <MotionButton
                onClick={() => setIsMobileOpen(true)}
                {...animations.scale}
                w="full"
                bg={buttonBg}
                borderRadius="lg"
                p={3}
                boxShadow={buttonShadow}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                variant="unstyled"
                height="auto"
            >
                <Flex alignItems="center" gap={2}>
                    <Box p={1.5} bg={iconBg} borderRadius="md">
                        <Icon as={Car} boxSize={4} color={iconColor} />
                    </Box>
                    <Text fontWeight="medium" color={textColor}>Purchase Guide</Text>
                </Flex>
                <Icon as={ArrowRight} boxSize={4} color={arrowColor} />
            </MotionButton>

            <AnimatePresence initial={false}>
                {isMobileOpen && (
                    <MotionBox
                        {...animations.fade}
                        position="fixed"
                        inset={0}
                        bg={bgColor}
                        zIndex={50}
                        display="flex"
                        flexDirection="column"
                    >
                        <Box
                            position="sticky"
                            top={0}
                            bg={bgColor}
                            zIndex={1}
                            borderBottomWidth="1px"
                            borderColor={borderColor}
                        >
                            <Flex
                                alignItems="center"
                                marginTop='60px'
                                justifyContent="space-between"
                                p={3}
                            >
                                <Flex alignItems="center" gap={2}>
                                    <Icon as={Car} boxSize={4} color={textColor} />
                                    <Text fontWeight="medium" color={textColor}>Purchase Guide</Text>
                                </Flex>
                                <MotionButton
                                    onClick={() => setIsMobileOpen(false)}
                                    {...animations.scale}
                                    variant="unstyled"
                                    display="flex"
                                    p={2}
                                    minW="auto"
                                    height="auto"
                                    borderRadius="full"
                                    _active={{ bg: closeButtonActiveBg }}
                                    aria-label="Close"
                                >
                                    <Icon as={X} boxSize={4} color={textColor} />
                                </MotionButton>
                            </Flex>
                        </Box>

                        <Box
                            flex="1"
                            overflowY="auto"
                            px={3}
                            py={4}
                            pb={20}
                        >
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <SlideContent
                                    key={currentSlide}
                                    slide={slides[currentSlide - 1]}
                                    direction={direction}
                                />
                            </AnimatePresence>
                        </Box>

                        <Box
                            position="sticky"
                            bottom={0}
                            bg={bgColor}
                            borderTopWidth="1px"
                            borderColor={borderColor}
                            px={3}
                            py={2}
                        >
                            <Controls
                                current={currentSlide}
                                total={slides.length}
                                onNext={nextSlide}
                                onPrev={prevSlide}
                                onDotClick={setCurrentSlide}
                            />
                        </Box>
                    </MotionBox>
                )}
            </AnimatePresence>
        </>
    );
});

MobileView.displayName = 'MobileView';

const DesktopView = memo(({ isExpanded, setIsExpanded, currentSlide, slides, nextSlide, prevSlide, setCurrentSlide, direction }: DesktopViewProps) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const iconBg = useColorModeValue("red.50", "red.900");
    const iconColor = useColorModeValue("red.500", "red.300");
    const textColor = useColorModeValue("gray.900", "white");
    const buttonColor = useColorModeValue("red.500", "red.300");
    const buttonHoverBg = useColorModeValue("red.50", "red.900");
    const boxShadow = useColorModeValue("sm", "dark-lg");

    return (
        <MotionBox
            {...animations.fade}
            bg={bgColor}
            borderRadius="xl"
            boxShadow={boxShadow}
        >
            <Flex p={4} alignItems="center" justifyContent="space-between" borderBottomWidth="1px" borderColor={borderColor}>
                <Flex alignItems="center" gap={2}>
                    <MotionBox
                        {...animations.scale}
                        p={1.5}
                        bg={iconBg}
                        borderRadius="md"
                    >
                        <Icon as={Car} boxSize={4} color={iconColor} aria-hidden="true" />
                    </MotionBox>
                    <Text fontWeight="medium" color={textColor}>Purchase Guide</Text>
                </Flex>
                <MotionButton
                    onClick={() => setIsExpanded(!isExpanded)}
                    {...animations.scale}
                    color={buttonColor}
                    fontSize="sm"
                    _hover={{ bg: buttonHoverBg }}
                    px={3}
                    py={1.5}
                    borderRadius="lg"
                    variant="ghost"
                    size="sm"
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? 'View Less' : 'View Steps'}
                </MotionButton>
            </Flex>

            <AnimatePresence mode="wait">
                {isExpanded && (
                    <MotionBox
                        {...animations.fade}
                        p={4}
                    >
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <SlideContent
                                key={currentSlide}
                                slide={slides[currentSlide - 1]}
                                direction={direction}
                            />
                        </AnimatePresence>
                        <Controls
                            current={currentSlide}
                            total={slides.length}
                            onNext={nextSlide}
                            onPrev={prevSlide}
                            onDotClick={setCurrentSlide}
                        />
                    </MotionBox>
                )}
            </AnimatePresence>
        </MotionBox>
    );
});

DesktopView.displayName = 'DesktopView';

const CheckoutPurchaseGuide: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [direction, setDirection] = useState(0);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const nextSlide = React.useCallback(() => {
        if (currentSlide < slides.length) {
            setDirection(1);
            setCurrentSlide(prev => prev + 1);
        }
    }, [currentSlide]);

    const prevSlide = React.useCallback(() => {
        if (currentSlide > 1) {
            setDirection(-1);
            setCurrentSlide(prev => prev - 1);
        }
    }, [currentSlide]);

    const handleDotClick = React.useCallback((slideIndex: number) => {
        setDirection(slideIndex > currentSlide ? 1 : -1);
        setCurrentSlide(slideIndex);
    }, [currentSlide]);

    const sharedProps = useMemo(() => ({
        currentSlide,
        slides,
        nextSlide,
        prevSlide,
        setCurrentSlide: handleDotClick,
        direction,
    }), [currentSlide, direction, nextSlide, prevSlide, handleDotClick]);
    return (
        <Box maxW="4xl" mx="auto" p={4}>
            {isMobile ? (
                <MobileView
                    {...sharedProps}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />
            ) : (
                <DesktopView
                    {...sharedProps}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                />
            )}
        </Box>
    );
};

CheckoutPurchaseGuide.displayName = 'CheckoutPurchaseGuide';

export default CheckoutPurchaseGuide;