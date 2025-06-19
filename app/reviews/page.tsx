'use client';

import {
    Box,
    Flex,
    Text,
    Heading,
    Button,
    VStack,
    HStack,
    Icon,
    useColorModeValue,
    Avatar,
    ChakraProvider,
    extendTheme,
    Link,
    Container
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import Layout from '@/components/layout/Layout';
import { useTranslation } from 'react-i18next';
// import { Container } from 'lucide-react';

const reviews = [
    {
        name: 'Rakesh K P',
        date: 'May 8, 2025',
        textKey: 'reviews.review1.text',
    },
    {
        name: 'Jaap',
        date: 'May 7, 2025',
        textKey: 'reviews.review2.text',
    },
    {
        name: 'Ping Ping Lau',
        date: 'May 7, 2025',
        textKey: 'reviews.review3.text',
    },
    {
        name: 'Rakesh K P',
        date: 'May 8, 2025',
        textKey: 'reviews.review1.text',
    },
    {
        name: 'Jaap',
        date: 'May 7, 2025',
        textKey: 'reviews.review2.text',
    },
    {
        name: 'Ping Ping Lau',
        date: 'May 7, 2025',
        textKey: 'reviews.review3.text',
    },

];

export default function ReviewsPage() {
    const { t } = useTranslation();
    const bg = useColorModeValue('gray.50', 'black');
    const cardBg = useColorModeValue('white', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const subTextColor = useColorModeValue('gray.600', 'gray.400');
    const starColor = useColorModeValue('green.400', 'green.300');
    const maxContentWidth = "1400px"; // Maximum width

    return (
        <div style={{ backgroundColor: bg }}>
            <Layout>
                <Container maxWidth={maxContentWidth} mx="auto" bg={bg}>
                    <Box minH="100vh" bg={bg} px={[4, 4, 50]} py={10} margin="0 auto">
                        <Box mb={8} paddingInline={8}>
                            <Heading size="2xl" mb={2} color={textColor} fontFamily='satoshi' fontWeight={900}>
                                {t('reviews.title')}
                            </Heading>
                            <Text fontSize="lg" color={subTextColor}>
                                {t('reviews.subtitle')}
                            </Text>
                        </Box>
                        <Flex align="center" mb={8} gap={6} flexWrap="wrap" paddingInline={8}>
                            <HStack spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                    4.9
                                </Text>
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} color={starColor} fontSize="2xl" />
                                ))}
                            </HStack>
                            <Text color={subTextColor}>{t('reviews.reviewCount')}</Text>
                            <Link href="https://www.trustpilot.com" target="_blank" ml="auto">
                                <Button
                                    bg="#003C2F"
                                    color="#00B67A"
                                    _hover={{ bg: "#002F24" }}
                                    borderRadius="full"
                                    px={6}
                                    fontWeight="medium"
                                >
                                    {t('reviews.reviewButton')}
                                </Button>
                            </Link>
                        </Flex>
                        <Flex gap={10} flexWrap="wrap" alignItems="center" justifyContent="center" >
                            {reviews.map((review, idx) => (
                                <Box
                                    key={idx}
                                    bg={cardBg}
                                    color={subTextColor}
                                    p={6}
                                    borderRadius="xl"
                                    boxShadow="md"
                                    minW="300px"
                                    flex="1"
                                    maxW="350px"
                                    display="flex"
                                    textAlign="center"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Text mb={4} fontSize="md">
                                        {t(review.textKey)}
                                    </Text>
                                    <Text fontWeight="bold" fontSize="xl">
                                        {review.name}
                                    </Text>
                                    <Text fontSize="sm" color={subTextColor} mb={2}>
                                        {review.date}
                                    </Text>
                                    <HStack marginTop="10px">
                                        <Box bg='#003C2F' p={2} borderRadius='full'>
                                            <svg
                                                role="img"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{ color: 'rgb(0, 182, 122)' }}
                                                width={24}
                                                height={24}
                                            >
                                                <title>Trustpilot</title>
                                                <path
                                                    d="M17.227 16.67l2.19 6.742-7.413-5.388 5.223-1.354zM24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z"
                                                    fill="#00b67a"
                                                />
                                            </svg>
                                        </Box>
                                        <VStack spacing={0}>
                                            <Text fontSize="sm" color={subTextColor}>
                                                {t('reviews.postedOn')}
                                            </Text>
                                            <Text fontSize="sm" color="green.400" fontWeight="bold">
                                                {t('reviews.trustpilot')}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            ))}
                        </Flex>
                    </Box>
                </Container>
            </Layout>
        </div>
    );
}
