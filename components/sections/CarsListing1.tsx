'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link"
import { swiperGroup3 } from '@/util/swiperOptions'
import {
	Heart,
	MapPin,
	ParkingMeterIcon,
	Calendar,
	Gauge,
	Power,
	Fuel,
	X,
	SlidersHorizontal,
	ChevronLeft,
	ChevronRight,
	Bell,
	LucideIcon as LucideIconType
} from 'lucide-react';
import { Box, Flex, HStack, SimpleGrid, Text, useColorModeValue, VStack, Wrap, WrapItem, Spinner, Alert, AlertIcon, AspectRatio, Heading, Badge, Button } from "@chakra-ui/react";
import { useBestDeals } from "@/services/cars/useCars";
import { useTranslation as useAzureTranslation } from '@/services/translation/useTranslation';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Image from 'next/image';
// Car interface
interface Car {
	id: string;
	images: string[];
	make: string;
	model: string;
	country: string;
	power: string;
	year: string;
	mileage: string;
	fuel: string;
	link: string;
	gear: string;
	price: string;
	features: string[];
}

interface LucideIconProps {
	icon: LucideIconType;
	[key: string]: any;
}

// CarCard Component
const CarCard = ({ car }: { car: any }) => {
	const textColor = useColorModeValue("gray.700", "gray.300");
	const cardBorderColor = useColorModeValue("gray.100", "#333333");
	const priceColor = useColorModeValue("black", "white");
	const badgeBg = useColorModeValue("gray.100", "#333333");
	const badgeColor = useColorModeValue("gray.700", "gray.300");
	const buttonLinkColor = useColorModeValue("gray.700", "gray.300");

	const { t } = useTranslation();
	const { translate, isLoading } = useAzureTranslation({
		apiKey: process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_API_KEY!,
		defaultTargetLanguage: 'en' // or get from user preferences
	});

	const [translatedModel, setTranslatedModel] = useState(car.model);
	const [translatedCountry, setTranslatedCountry] = useState(car.country);

	useEffect(() => {
		const translateContent = async () => {
			try {
				const [translatedModelResult, translatedCountryResult] = await translate(
					[car.model, car.country]
				);
				setTranslatedModel(translatedModelResult);
				setTranslatedCountry(translatedCountryResult);
			} catch (err) {
				console.error('Translation failed:', err);
			}
		};

		if (process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_API_KEY) {
			translateContent();
		}
	}, [car.model, car.country, translate]);

	const LucideIcon = ({ icon: Icon, ...props }: LucideIconProps) => {
		return <Box as={Icon} {...props} />;
	};
	const cardBg = useColorModeValue("white", "#1a1a1a");
	const headingColor = useColorModeValue("black", "red.400");

	return (
		<div className="col-lg-4 col-md-6" key={car.id}>
		<Flex
			direction={["column", "column", "column"]}
			bg={cardBg}
			borderRadius="md"
			overflow="hidden"
			borderWidth="1px"
			borderColor={cardBorderColor}
			transition="all 0.3s ease"
			_hover={{
				boxShadow: "xl",
				transform: "scale(1.02)",
				borderColor: "red.200"
			}}
			w="full"
			position="relative"
			zIndex="1"
			alignItems={["flex-start", "flex-start", "flex-start"]}
			gap={[2, 2, 2]}
			mb={["4", "4", "4"]}
		>
			{/* Image Section */}
			<Box position="relative" w={["full", "full", "full"]} h={["full", "full", "full"]}>
				<AspectRatio ratio={[16 / 9, 16 / 9, 4 / 3]} w="full">
					<Box position="relative" w="full" h="full" className='card-image'>
						<Image
							src={Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : '/fallback-image.jpg'}
							alt={car.make}
							fill
							priority
							style={{ objectFit: "cover" }}
						/>
					</Box>
				</AspectRatio>
			</Box>

			{/* Content Section - maintain size but reduce spacing */}
			<Flex
				flex="1"
				p={["4", "4", "3"]}
				flexDir="column"
				justifyContent="space-between"
			// mt={["3", "3", "0"]}
			>
				<Box>
					<Flex
						direction={["row", "row", "row"]}
						justify="space-between"
						align="center"
						mb={["3", "3", "2"]}
						mt={["2", "2", "0"]}
					>
						<Heading
							as="h3"
							ml='1'
							fontSize={["lg", "lg", "xl"]}
							fontWeight="bold"
							color={headingColor}
							letterSpacing="wide"
							fontFamily="inter"
							_hover={{ color: "red.500" }}
						// mb={["1", "1", "0"]}
						>
							{[car?.make, car?.model].filter(Boolean).join(' ') || 'Car Details'}
						</Heading>
						{/* <Box mt={["1", "1", "0"]} className='light-mode'>
					<Image
						src={logo.src}
						alt="Logo"
						width={70}
						height={35}
						style={{ display: "inline-block" }}
					/>
				</Box>
			<Box mt={["1", "1", "0"]} className='dark-mode'>
				<Image
					src={logoDark.src}
					alt="Logo"
					width={70}
					height={35}
					style={{ display: "inline-block" }}
				/>
			</Box> */}
					</Flex>

					{/* Specs Row - inline with minimal spacing */}
					<Box mb={["4", "4", "4"]} ml="1">
						<Flex direction="row" gap={4} mb={1} >
							<HStack spacing="1">
								<LucideIcon icon={Power} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.power} hp</Text>
							</HStack>
							<HStack spacing="1">
								<LucideIcon icon={Calendar} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.year}</Text>
							</HStack>
							<HStack spacing="1">
								<LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.mileage} km</Text>
							</HStack>
						</Flex>
						<Flex direction="row" gap={6}>
							<HStack spacing="1">
								<LucideIcon icon={Gauge} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor} fontWeight="semibold">{car.gear}</Text>
							</HStack>
							<HStack spacing="1">
								<LucideIcon icon={Fuel} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor} fontWeight="semibold">{car.fuel}</Text>
							</HStack>
						</Flex>
					</Box>

					{/* Features - keeping size with less vertical space */}
					<Flex wrap="wrap" gap={["2", "2", "1.5"]} mt="0" mb={["4", "4", "0"]} ml="1">
						{car.features &&
							(Object.values(car.features) as string[][])
								.flat()
								.slice(0, 4)
								.map((feature, index) => (
									<Badge
										key={index}
										px="2"
										bg={badgeBg}
										color={badgeColor}
										borderRadius="md"
										fontSize="sm"
										fontWeight="medium"
										style={{ textTransform: "none" }}
									>
										{feature}
									</Badge>
								))
						}
						{car.features && Object.values(car.features).flat().length > 4 && (
							<Button
								variant="unstyled"
								color={buttonLinkColor}
								fontSize="sm"
								fontWeight="medium"
								height="auto"
								padding="0"
								lineHeight="1.5"
								_hover={{ textDecoration: "underline" }}
								onClick={e => e.preventDefault()}
								style={{ textTransform: "none" }}
							>
								+ {Object.values(car.features).flat().length - 4} more
							</Button>
						)}
					</Flex>
				</Box>

				{/* Location and Price - maintain size with reduced space */}
				<Box
					// pt={["3", "3", "1.5"]}
					px={["0", "0", "2"]}
					borderTopWidth="1px"
					borderColor={cardBorderColor}
				// mt={["2", "2", "1"]}
				>
					{/* Top row: Very Good Price (left) and Main Price (right) */}

					<Flex direction="row" justify="space-between" alignItems="flex-start" align="flex-start" w="100%">
						<VStack display="flex" alignItems="flex-start" gap="1" mt="3" ml="0">
							<HStack spacing="1" >
								{[...Array(5)].map((_, i) => (
									<Box key={i} w="7px" h="7px" borderRadius="full" bg="#64E364" />
								))}
								<Text fontSize="sm" color={textColor} fontWeight="semibold" mb="0">
									Very Good Price
								</Text>
							</HStack>
							<HStack> <Flex align="center" gap="1">
								<Text fontSize="md" color={textColor} fontWeight="bold" lineHeight="1">
									€ 5043
								</Text>
								<Text fontSize="xs" color={textColor} display="flex" alignItems="center" flexWrap="wrap" gap="1" mt="1">
									Cheaper than <LucideIcon icon={MapPin} boxSize="3" color={textColor} /> Spain!
								</Text>
							</Flex>
							</HStack>
						</VStack>
						<Box borderRadius="md" textAlign={["right", "right", "right"]} mt={["2", "1", "3"]}>
							<Text fontSize={["xl", "xl", "2xl"]} fontWeight="bold" color={priceColor}>
								€ {car.price.toLocaleString()}
							</Text>
							<Text fontSize="xs" color={textColor}>
								€{(car.price / 4).toFixed(2)} without VAT
							</Text>
						</Box>
					</Flex>
					{/* Bottom row: Cheaper than in Spain! */}

				</Box>

			</Flex>
		</Flex>
	</div>
	);
};

export default function CarsListing1() {
	const { data: cars, isLoading, error } = useBestDeals({
		limit: "6",
		page: "1"
	});
	console.log("cars", cars);
	const { t } = useTranslation();

	const mappedCars = Array.isArray(cars?.data)
		? cars.data.map((item:any) => ({
			id: item.id,
			image: item.images || [],
			make: item.brand || '', // API uses 'brand'
			model: item.model || '',
			country: item.country || '',
			power: item.power?.toString() || '',
			year: item.year?.toString() || '',
			mileage: item.mileage?.toString() || '',
			fuel: item.fuel || '',
			link: item.url || '', // API uses 'url'
			gear: item.gear || '',
			price: item.price ? Math.round(item.price).toString() : '',
		}))
		: [];

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minH="400px">
				<Spinner size="xl" />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert status="error">
				<AlertIcon />
				{t('cars.failedToLoad')}
			</Alert>
		);
	}

	return (
		<>
			<section className="section-box box-flights background-body">
				<div className="container">
					<div className="row align-items-end">
						<div className="col-md-9 wow fadeInUp">
							<h3 className="title-svg neutral-1000 mb-5">{t('cars.featuredVehicles')}</h3>
							<p className="text-lg-medium text-bold neutral-500">{t('cars.leadingBrands')}</p>
						</div>
						{/* <div className="col-md-3 position-relative mb-30 wow fadeInUp">
							<div className="box-button-slider box-button-slider-team justify-content-end d-flex">
								<div className="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2 d-flex justify-content-center align-items-center">
									<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
								<div className="swiper-button-next swiper-button-next-style-1 swiper-button-next-2 d-flex justify-content-center align-items-center">
									<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
							</div>
						</div> */}
					</div>
					<div className="block-flights wow fadeInUp">
						<div className="box-swiper mt-30">
							<Swiper {...swiperGroup3} className="swiper-container swiper-group-3 swiper-group-journey">
								<div className="swiper-wrapper">
									{/* Group cars into pairs for SwiperSlides */}
									{Array.from({ length: Math.ceil(mappedCars.length / 2) }, (_, index) => (
										<SwiperSlide key={index}>
											{mappedCars.slice(index * 2, index * 2 + 2).map((car: any) => (
												<CarCard key={car.id} car={car} />
											))}
										</SwiperSlide>
									))}
								</div>
							</Swiper>
						</div>
					</div>
					<div className="d-flex justify-content-center">
						<Link className="btn btn-brand-2 text-nowrap wow fadeInUp" href="/cars">
							<svg className="me-2" xmlns="http://www.w3.org/2000/svg" width={19} height={18} viewBox="0 0 19 18" fill="none">
								<g clipPath="url(#clip0_117_4717)">
									<path d="M4.4024 14.0977C1.60418 11.2899 1.60418 6.71576 4.4024 3.90794L5.89511 5.40064V0.90332H1.39779L3.13528 2.64081C-0.378102 6.1494 -0.378102 11.8562 3.13528 15.3696C5.35275 17.5823 8.43896 18.403 11.2996 17.8175V15.9648C8.91413 16.584 6.26949 15.9648 4.4024 14.0977Z" fill="#FFFFFFFF" />
									<path d="M15.864 2.64036C13.6465 0.418093 10.5603 -0.402657 7.69971 0.182907V2.03559C10.0852 1.41643 12.7346 2.04519 14.5969 3.90748C17.4047 6.71531 17.4047 11.2894 14.5969 14.0973L13.1042 12.6045V17.1067H17.6063L15.8688 15.3692C19.3774 11.8558 19.3774 6.14894 15.864 2.64036Z" fill="#FFFFFFFF" />
								</g>
								<defs>
									<clipPath id="clip0_117_4717">
										<rect width={18} height={18} fill="white" transform="translate(0.5)" />
									</clipPath>
								</defs>
							</svg>
							{t('cars.loadMore')}
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
