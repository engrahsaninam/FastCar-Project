'use client'
import {
    Box,
    Flex,
    Text,
    Image,
    Icon,
    Stack,
    useBreakpointValue,
    chakra,
    useColorModeValue,
} from '@chakra-ui/react';
import { Timer, CalendarDays, ArrowUpRight, Phone } from 'lucide-react';
import { FC, memo } from 'react';
import { CarData } from './CarType';
import { carData } from './Data';

const CarImage: FC<{ src: string; alt: string }> = memo(({ src, alt }) => (
    <Box w="86px" h="64px" flexShrink={0}>
        <Image src={src} alt={alt} w="100%" h="100%" objectFit="cover" borderRadius="md" />
    </Box>
));
CarImage.displayName = 'CarImage';

const InfoItem: FC<{ Icon: any; text: string }> = memo(({ Icon, text }) => {
    const iconColor = useColorModeValue("#6B7280", "#9CA3AF");
    const textColor = useColorModeValue("gray.500", "gray.400");

    return (
        <Flex align="center" gap={1.5}>
            <Box w={4} h={4} display="flex" alignItems="center" justifyContent="center">
                <Icon size={14} color={iconColor} aria-label="Icon" />
            </Box>
            <Text fontSize="sm" color={textColor}>
                {text}
            </Text>
        </Flex>
    );
});
InfoItem.displayName = 'InfoItem';

const DeliveryInfo: FC<{ text: string }> = memo(({ text }) => {
    const iconColor = useColorModeValue("red.500", "red.300");
    const textColor = useColorModeValue("red.500", "red.300");

    return (
        <Flex align="start" gap={2} fontSize="sm" color={textColor}>
            <Icon as={Timer} boxSize={4} mt="1px" color={iconColor} aria-label="Icon" />
            <Text fontSize="sm" lineHeight="1.4">
                {text}
            </Text>
        </Flex>
    );
});
DeliveryInfo.displayName = 'DeliveryInfo';

const SupportCard: FC<{ phone: string; hours: string; isMobile: boolean }> = memo(
    ({ phone, hours, isMobile }) => {
        const bgColor = useColorModeValue("white", "gray.800");
        const borderColor = useColorModeValue("gray.100", "gray.700");
        const boxShadow = useColorModeValue("sm", "none");
        const iconBgColor = useColorModeValue("blue.50", "blue.900");
        const phoneColor = useColorModeValue("red.500", "red.300");
        const titleColor = useColorModeValue("gray.600", "gray.400");
        const hoursColor = useColorModeValue("gray.500", "gray.500");

        return (
            <Box
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                borderRadius="xl"
                boxShadow={boxShadow}
                mt={isMobile ? 4 : 0}
                w={isMobile ? '100%' : '280px'}
                py={3}
            >
                <Flex p={4} h="100%" align="center">
                    <Flex
                        align="center"
                        gap={3}
                        w="100%"
                        justify={isMobile ? 'flex-start' : 'flex-start'}
                    >
                        <Box
                            w={10}
                            h={10}
                            bg={iconBgColor}
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                        >
                            <Phone size={18} color={useColorModeValue("#EF4444", "#F87171")} />
                        </Box>
                        <Box>
                            <Text fontSize="sm" color={titleColor}>
                                Do you need advice?
                            </Text>
                            <Text fontSize="md" color={phoneColor} fontWeight="medium">
                                {phone}
                            </Text>
                            {!isMobile && (
                                <Text fontSize="sm" color={hoursColor} mt={0.5}>
                                    {hours}
                                </Text>
                            )}
                        </Box>
                    </Flex>
                </Flex>
            </Box>
        );
    }
);
SupportCard.displayName = 'SupportCard';

const CarInfoCard: FC<{ data: CarData; isMobile: boolean }> = memo(({ data, isMobile }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const boxShadow = useColorModeValue("sm", "none");
    const titleColor = useColorModeValue("gray.900", "white");
    const iconColor = useColorModeValue("#EF4444", "#F87171");

    return (
        <Box bg={bgColor} border="1px" borderColor={borderColor} borderRadius="xl" boxShadow={boxShadow} flex="1" py={2}>
            <Flex p={4} direction="column" h="100%">
                <Flex gap={3}>
                    <CarImage src={data.image} alt={data.title} />
                    <Box flex="1" minW="0">
                        <Flex justify="space-between" align="start">
                            <Text fontSize="md" color={titleColor} fontWeight="medium" pr={2} lineHeight="short">
                                {data.title}
                            </Text>
                            <ArrowUpRight size={16} color={iconColor} />
                        </Flex>
                        <Flex gap={4} mt={1.5}>
                            <InfoItem Icon={Timer} text={data.mileage} aria-label="Icon" />
                            <InfoItem Icon={CalendarDays} text={data.year} aria-label="Icon" />
                        </Flex>
                    </Box>
                </Flex>
                <Box mt={3} pl={isMobile ? 0 : 0}>
                    <DeliveryInfo text={data.deliveryInfo} />
                </Box>
            </Flex>
        </Box>
    );
});
CarInfoCard.displayName = 'CarInfoCard';

const CheckoutCarDetails: FC = () => {
    const bgColor = useColorModeValue("white", "gray.800");

    return (
        <Box w="full" bg={useColorModeValue("gray.50", "gray.900")}>
            {/* Mobile */}
            <Box
                display={{ base: 'block', lg: 'none' }}
                width="100%"
                maxW="100%"
                px={4}
                py={4}
            >
                <Stack spacing={4} width="100%">
                    <CarInfoCard data={carData} isMobile={true} />
                    <SupportCard phone={carData.support.phone} hours={carData.support.hours} isMobile={true} />
                </Stack>
            </Box>

            {/* Desktop */}
            <Box display={{ base: 'none', lg: 'block' }} bg={bgColor} py={4}>
                <Box maxW="92%" mx="auto">
                    <Flex gap={4} justify="space-between" align="stretch">
                        <CarInfoCard data={carData} isMobile={false} />
                        <SupportCard phone={carData.support.phone} hours={carData.support.hours} isMobile={false} />
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};
CheckoutCarDetails.displayName = 'CheckoutCarDetails';
export default CheckoutCarDetails;
