import React from 'react';
import { Box, Text, Flex, VStack, Icon, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { animations } from './animations';
import { SlideContentProps } from './CarType';
const MotionBox = motion(Box);


export const SlideContent: React.FC<SlideContentProps> = ({ slide, direction }) => {
    const IconComponent = slide.icon;

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 })
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
            <Box bg="red.50" p={6} borderRadius="xl" w="full">
                <Flex alignItems="flex-start" gap={3} mb={6}>
                    <MotionBox {...animations.scale} p={2} bg="red.50" borderRadius="lg">
                        <Icon as={IconComponent} boxSize={5} color="gray.700" aria-label="Icon" />
                    </MotionBox>
                    <Box>
                        <Text fontSize="sm" color="gray.500">{slide.tag}</Text>
                        <Text fontSize="xl" fontWeight="bold" color="gray.900">{slide.title}</Text>
                        {slide.subTitle && (
                            <Text fontSize="sm" color="gray.600" mt={1}>{slide.subTitle}</Text>
                        )}
                    </Box>
                </Flex>

                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                    <Box w={{ base: "full", md: "240px" }} flexShrink={0}>
                        <MotionBox position="relative" overflow="hidden" borderRadius="lg" whileHover={{ scale: 1.02 }} transition={{ type: "tween", duration: 0.2 }}>
                            <Image src={slide.image} alt={slide.title} objectFit="contain" w="full" h="full" loading="lazy" />
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
};