'use client';

import React, { useState, memo, useMemo } from 'react';
import { 
  Box, Button, Flex, Text, Image, Icon, VStack, HStack, useBreakpointValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, CreditCard, Shield, FileText, Car, Info, ArrowRight } from 'lucide-react';

// Motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);

// Animation presets
const animations = {
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  scale: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 }
  }
};

// Slide data
const slides = [
  {
    id: 1,
    title: "How to Make a Purchase",
    icon: Info,
    tag: "Overview",
    content: "You're just a few steps away from owning your new car! The total price includes everything MOT, registration, and delivery. No hidden fees or surprises, unless you choose additional services.",
    image: "/1.png",
  },
  {
    id: 2,
    title: "Payment Method",
    icon: CreditCard,
    tag: "Step 1",
    subTitle: "Secure Payment",
    price: "CZK 567,265",
    priceLabel: "TOTAL PRICE INCLUDING ALL SERVICES",
    content: "Select your preferred payment method for a smooth and secure transaction.",
    image: "/2.png",
  },
  {
    id: 3,
    title: "Car Inspection",
    icon: Car,
    tag: "Step 2",
    subTitle: "Thorough Check",
    content: "Get a full technical report on the car's condition for CZK 1,990. Our comprehensive inspection ensures transparency and helps you make an informed decision.",
    image: "/3.png",
  },
  {
    id: 4,
    title: "Warranty Coverage",
    icon: Shield,
    tag: "Step 3",
    subTitle: "Complete Protection",
    content: "Enjoy full warranty coverage when purchasing through us. Contracts are in English, ensuring clarity and peace of mind.",
    image: "/warranty.webp",
  },
  {
    id: 5,
    title: "Contract Review",
    icon: FileText,
    tag: "Final Step",
    subTitle: "Total Transparency",
    content: "Review your contract at home before committing. Available in English, with our support team ready to assist with any questions.",
    image: "/contract.webp",
  }
];

const SlideContent = memo(({ slide, direction }) => {
  const IconComponent = slide.icon;
  
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 40 : -40,
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
      spacing={4}
    >
      <Box bg="red.50" p={6} borderRadius="xl" width="full">
        <Flex alignItems="flex-start" gap={3} mb={6}>
          <MotionBox
            {...animations.scale}
            p={2}
            bg="red.50"
            borderRadius="lg"
          >
            <Icon as={IconComponent} boxSize={5} color="gray.700" />
          </MotionBox>
          <Box>
            <Text fontSize="sm" color="gray.500">{slide.tag}</Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">{slide.title}</Text>
            {slide.subTitle && (
              <Text fontSize="sm" color="gray.600" mt={1}>{slide.subTitle}</Text>
            )}
          </Box>
        </Flex>

        <Flex 
          direction={{ base: "column", md: "row" }}
          gap={6}
        >
          <Box 
            width={{ base: "full", md: "240px" }}
            flexShrink={0}
          >
            <MotionBox 
              position="relative"
              overflow="hidden"
              borderRadius="lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                objectFit="contain"
                width="full"
                height="full"
                loading="lazy"
              />
            </MotionBox>
          </Box>

          <Box flex="1">
            {slide.price ? (
              <VStack spacing={4} align="stretch">
                <Text color="gray.600">{slide.content}</Text>
                <Box bg="white" p={4} borderRadius="lg">
                  <Text fontSize="sm" color="gray.500" textTransform="uppercase">{slide.priceLabel}</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="red.500" mt={1}>{slide.price}</Text>
                </Box>
              </VStack>
            ) : (
              <Box bg="white" p={4} borderRadius="lg">
                <Text color="gray.600">{slide.content}</Text>
              </Box>
            )}
          </Box>
        </Flex>
      </Box>
    </MotionBox>
  );
});

const Controls = memo(({ current, total, onPrev, onNext, onDotClick }) => (
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

const MobileView = memo(({ isMobileOpen, setIsMobileOpen, currentSlide, slides, nextSlide, prevSlide, setCurrentSlide, direction }) => (
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

const DesktopView = memo(({ isExpanded, setIsExpanded, currentSlide, slides, nextSlide, prevSlide, setCurrentSlide, direction }) => (
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

const CheckoutPurchaseGuide = () => {
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
  
  const handleDotClick = (slideIndex) => {
    setDirection(slideIndex > currentSlide ? 1 : -1);
    setCurrentSlide(slideIndex);
  };

  // Common props for mobile and desktop views
  const sharedProps = useMemo(() => ({
    currentSlide,
    slides,
    nextSlide,
    prevSlide,
    setCurrentSlide: handleDotClick,
    direction
  }), [currentSlide, direction]);

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