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
const InfoItem: FC<{ Icon: any; text: string }> = memo(({ Icon, text }) => (
    <Flex align="center" gap={1.5}>
        <Box w={4} h={4} display="flex" alignItems="center" justifyContent="center">
            <Icon size={14} color="#6B7280" />
        </Box>
        <Text fontSize="sm" color="gray.500">
            {text}
        </Text>
    </Flex>
));
InfoItem.displayName = 'InfoItem';
const DeliveryInfo: FC<{ text: string }> = memo(({ text }) => (
    <Flex align="start" gap={2} fontSize="sm" color="red.500">
        <Icon as={Timer} boxSize={4} mt="1px" />
        <Text>{text}</Text>
    </Flex>
));
DeliveryInfo.displayName = 'DeliveryInfo';
const SupportCard: FC<{ phone: string; hours: string; isMobile: boolean }> = memo(
    ({ phone, hours, isMobile }) => (
        <Box
            bg="white"
            border="1px"
            borderColor="gray.100"
            borderRadius="lg"
            boxShadow="sm"
            mt={isMobile ? 4 : 0}
            w={isMobile ? '100%' : '280px'}
        >
            <Flex p={4} h="100%" align="center">
                <Flex
                    align="center"
                    gap={3}
                    w="100%"
                    justify={isMobile ? 'center' : 'flex-start'}
                >
                    <Box
                        w={10}
                        h={10}
                        bg="blue.50"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                    >
                        <Phone size={18} color="#EF4444" />
                    </Box>
                    <Box textAlign={isMobile ? 'center' : 'left'}>
                        <Text fontSize="sm" color="gray.600">
                            Do you need advice?
                        </Text>
                        <Text fontSize="md" color="red.500" fontWeight="medium">
                            {phone}
                        </Text>
                        {!isMobile && (
                            <Text fontSize="sm" color="gray.500" mt={0.5}>
                                {hours}
                            </Text>
                        )}
                    </Box>
                </Flex>
            </Flex>
        </Box>
    )
);
SupportCard.displayName = 'SupportCard';
const CarInfoCard: FC<{ data: CarData; isMobile: boolean }> = memo(({ data, isMobile }) => (
    <Box bg="white" border="1px" borderColor="gray.100" borderRadius="lg" boxShadow="sm" flex="1">
        <Flex p={4} direction="column" h="100%">
            <Flex gap={3}>
                <CarImage src={data.image} alt={data.title} />
                <Box flex="1" minW="0">
                    <Flex justify="space-between" align="start">
                        <Text fontSize="md" color="gray.900" fontWeight="medium" pr={2} lineHeight="short">
                            {data.title}
                        </Text>
                        <ArrowUpRight size={16} color="#EF4444" />
                    </Flex>
                    <Flex gap={4} mt={1.5}>
                        <InfoItem Icon={Timer} text={data.mileage} />
                        <InfoItem Icon={CalendarDays} text={data.year} />
                    </Flex>
                    {!isMobile && (
                        <Box mt={3}>
                            <DeliveryInfo text={data.deliveryInfo} />
                        </Box>
                    )}
                </Box>
            </Flex>
            {isMobile && (
                <Box px={4} pt={4} pb={4}>
                    <DeliveryInfo text={data.deliveryInfo} />
                </Box>
            )}
        </Flex>
    </Box>
));
CarInfoCard.displayName = 'CarInfoCard';
const CheckoutCarDetails: FC = () => {
    // const isMobile = useBreakpointValue({ base: true, lg: false });

    return (
        <Box w="full" fontFamily="sans">
            {/* Mobile */}
            <Box display={{ base: 'block', lg: 'none' }}>
                <Stack spacing={4}>
                    <CarInfoCard data={carData} isMobile />
                    <SupportCard phone={carData.support.phone} hours={carData.support.hours} isMobile />
                </Stack>
            </Box>

            {/* Desktop */}
            <Box display={{ base: 'none', lg: 'block' }} bg="white" py={4}>
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
