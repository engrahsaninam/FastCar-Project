'use client';

import React, { useState, memo, useMemo } from 'react';
import {
    Box, Button, Flex, Text, Image, Icon, VStack, HStack, useBreakpointValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Car, ArrowRight } from 'lucide-react';
import { slides } from './slides';
import { animations } from './animations';
import { SlideContent } from './SlideContent';
import type { ControlsProps, MobileViewProps, DesktopViewProps } from './CarType';

// Motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Controls = memo(({ current, total, onPrev, onNext, onDotClick }: ControlsProps) => (
    <Flex
        alignItems="center"
        justifyContent="space-between"
        mt={4}
        pt={4}
        px={4}
        borderTopWidth="1px"
        borderColor="gray.200"
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
                        bg={current === i + 1 ? 'red.500' : current > i + 1 ? 'green.500' : 'gray.200'}
                        {...(current === i + 1 && { boxShadow: '0 0 0 2px var(--chakra-colors-red-200)' })}
                    />
                    <Text
                        position="absolute"
                        top="-8"
                        left="50%"
                        transform="translateX(-50%)"
                        px={2}
                        py={1}
                        bg="gray.900"
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
                _hover={{ bg: "gray.100" }}
                _disabled={{ opacity: 0.4 }}
                aria-label="Previous slide"
            >
                <Icon as={ChevronLeft} boxSize={4} />
            </MotionButton>
            <MotionButton
                onClick={onNext}
                isDisabled={current === total}
                {...animations.scale}
                variant="ghost"
                p={1.5}
                borderRadius="lg"
                _hover={{ bg: "gray.100" }}
                _disabled={{ opacity: 0.4 }}
                aria-label="Next slide"
            >
                <Icon as={ChevronRight} boxSize={4} />
            </MotionButton>
        </HStack>
    </Flex>
));
Controls.displayName = "Controls";
const MobileView = memo(({ isMobileOpen, setIsMobileOpen, currentSlide, slides, nextSlide, prevSlide, setCurrentSlide, direction }: MobileViewProps) => (
    <>
        <MotionButton
            onClick={() => setIsMobileOpen(true)}
            {...animations.scale}
            w="full"
            bg="white"
            borderRadius="lg"
            p={3}
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            variant="unstyled"
            height="auto"
        >
            <Flex alignItems="center" gap={2}>
                <Box p={1.5} bg="red.50" borderRadius="md">
                    <Icon as={Car} boxSize={4} color="red.500" />
                </Box>
                <Text fontWeight="medium">Purchase Guide</Text>
            </Flex>
            <Icon as={ArrowRight} boxSize={4} color="gray.400" />
        </MotionButton>

        <AnimatePresence initial={false}>
            {isMobileOpen && (
                <MotionBox
                    {...animations.fade}
                    position="fixed"
                    inset={0}
                    bg="white"
                    zIndex={50}
                >
                    <Flex direction="column" h="full">
                        <Flex
                            alignItems="center"
                            justifyContent="space-between"
                            p={3}
                            borderBottomWidth="1px"
                        >
                            <Flex alignItems="center" gap={2}>
                                <Icon as={Car} boxSize={4} />
                                <Text fontWeight="medium">Purchase Guide</Text>
                            </Flex>
                            <MotionButton
                                onClick={() => setIsMobileOpen(false)}
                                {...animations.scale}
                                variant="unstyled"
                                display="flex"
                                p={0}
                                minW="auto"
                                height="auto"
                                aria-label="Close"
                            >
                                <Icon as={X} boxSize={4} />
                            </MotionButton>
                        </Flex>
                        <Box flex="1" overflowY="auto" p={4}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <SlideContent
                                    key={currentSlide}
                                    slide={slides[currentSlide - 1]}
                                    direction={direction}
                                />
                            </AnimatePresence>
                        </Box>
                        <Controls
                            current={currentSlide}
                            total={slides.length}
                            onNext={nextSlide}
                            onPrev={prevSlide}
                            onDotClick={setCurrentSlide}
                        />
                    </Flex>
                </MotionBox>
            )}
        </AnimatePresence>
    </>
));
MobileView.displayName = "MobileView";
const DesktopView = memo(({ isExpanded, setIsExpanded, currentSlide, slides, nextSlide, prevSlide, setCurrentSlide, direction }: DesktopViewProps) => (
    <MotionBox
        {...animations.fade}
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
    >
        <Flex p={4} alignItems="center" justifyContent="space-between" borderBottomWidth="1px">
            <Flex alignItems="center" gap={2}>
                <MotionBox
                    {...animations.scale}
                    p={1.5}
                    bg="red.50"
                    borderRadius="md"
                >
                    <Icon as={Car} boxSize={4} color="red.500" />
                </MotionBox>
                <Text fontWeight="medium">Purchase Guide</Text>
            </Flex>
            <MotionButton
                onClick={() => setIsExpanded(!isExpanded)}
                {...animations.scale}
                color="red.500"
                fontSize="sm"
                _hover={{ bg: "red.50" }}
                px={3}
                py={1.5}
                borderRadius="lg"
                variant="ghost"
                size="sm"
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
));
DesktopView.displayName = "DesktopView";
const CheckoutPurchaseGuide: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [direction, setDirection] = useState(0);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const nextSlide = () => {
        if (currentSlide < slides.length) {
            setDirection(1);
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 1) {
            setDirection(-1);
            setCurrentSlide(prev => prev - 1);
        }
    };

    const handleDotClick = (slideIndex: number) => {
        setDirection(slideIndex > currentSlide ? 1 : -1);
        setCurrentSlide(slideIndex);
    };

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

export default CheckoutPurchaseGuide;