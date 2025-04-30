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
import { Box, Flex, HStack, SimpleGrid, Text, useColorModeValue, VStack, Wrap, WrapItem } from "@chakra-ui/react";

// Car interface
interface Car {
	id: number;
	image: string;
	rating: string;
	reviews: string;
	title: string;
	location: string;
	power: string;
	date: string;
	mileage: string;
	fuelType: string;
	link: string;
	transmission: string;
	price: string;
}

interface LucideIconProps {
	icon: LucideIconType;
	[key: string]: any;
}

// CarCard Component
const CarCard = ({ car }: { car: Car }) => {
	const textColor = useColorModeValue("gray.700", "gray.300");
	const cardBorderColor = useColorModeValue("gray.100", "#333333");
	const priceColor = useColorModeValue("black", "white");

	const LucideIcon = ({ icon: Icon, ...props }: LucideIconProps) => {
		return <Box as={Icon} {...props} />;
	};
	return (
		<div className="card-journey-small background-card hover-up">
			<div className="card-image">
				<Link href={car.link}>
					<img src={car.image} alt="Fast4Car" />
				</Link>
			</div>
			<div className="card-info">
				{/* <div className="card-rating">
					<div className="card-left" />
					<div className="card-right">
						<span className="rating">
							{car.rating} <span className="text-sm-medium neutral-500">({car.reviews} reviews)</span>
						</span>
					</div>
				</div> */}
				<div className="card-title ">
					<Link className="heading-6 neutral-1000" href={car.link}>
						{car.title}
					</Link>
				</div>
				<div className="card-program">
					<div className="card-location">
						<p className="text-location  text-md-medium ">{car.location}</p>
					</div>
					{/* Specs Row - inline with minimal spacing */}
					<Box mb={["2", "2", "1"]} ml="1">
						<SimpleGrid columns={2} spacingX={6} spacingY={2} mb="2">
							<HStack spacing="1">
								<LucideIcon icon={Power} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.power}</Text>
							</HStack>
							<HStack spacing="1">
								<LucideIcon icon={Calendar} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.date}</Text>
							</HStack>
							<HStack spacing="1">
								<LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.mileage}</Text>
							</HStack>
							<HStack spacing="1">
								<LucideIcon icon={Gauge} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor} fontWeight="semibold">{car.transmission}</Text>
							</HStack>
							<HStack spacing="1">
								<LucideIcon icon={Fuel} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor} fontWeight="semibold">{car.fuelType}</Text>
							</HStack>
						</SimpleGrid>
					</Box>

					<Box
						// pt={["3", "3", "1.5"]}
						px={["0", "0", "2"]}
						borderTopWidth="1px"
						borderColor={cardBorderColor}
					// mt={["2", "2", "1"]}
					>
						{/* Top row: Very Good Price (left) and Main Price (right) */}

						<Flex direction="row" justify="space-between" alignItems="center" align="center" w="100%">
							<VStack display="flex" alignItems="flex-start" gap="1" mt="3" ml="0">
								<HStack spacing="1" >
									{[...Array(5)].map((_, i) => (
										<Box key={i} w="5px" h="5px" borderRadius="full" bg="#64E364" />
									))}
									<Text fontSize="xs" color="gray.700" fontWeight="semibold" mb="0">
										Very Good Price
									</Text>
								</HStack>
								
							</VStack>
							<Box borderRadius="md" textAlign="right" mt={["2", "1", "3"]}>
								<Text fontSize={["xl", "xl", "2xl"]} fontWeight="bold" color={priceColor}>
									€ {car.price.toLocaleString()}
								</Text>
								<Text fontSize="xs" color="gray.500">
									€ {car.price.toLocaleString()} without VAT
								</Text>
							</Box>
						</Flex>
						{/* Bottom row: Cheaper than in Spain! */}

					</Box>
				</div>
			</div>
		</div>
	);
};

// Car data array
const carsData = [
	{
		id: 1,
		image: "/assets/imgs/cars-listing/cars-listing-1/car-1.png",
		rating: "4.96",
		reviews: "672",
		title: "Audi A3 1.6 TDI S line",
		location: "Manchester, England",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "18,496 km",
		transmission: "Automatic",
		fuelType: "Petrol",
		price: "498.25",
		link: "/car"
	},
	{
		id: 2,
		image: "/assets/imgs/cars-listing/cars-listing-1/car-2.png",
		rating: "4.96",
		reviews: "672",
		title: "Volvo S60 D4 R-Design",
		location: "New South Wales, Australia",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "18,496 km",
		transmission: "Automatic",
		fuelType: "Petrol",
		price: "498.25",
		link: "/car"
	},
	{
		id: 3,
		image: "/assets/imgs/cars-listing/cars-listing-1/car-3.png",
		rating: "4.96",
		reviews: "672",
		title: "Mercedes-Benz C220d",
		location: "Manchester, England",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "18,496 km",
		transmission: "Automatic",
		fuelType: "Petrol",
		price: "498.25",
		link: "/car"
	},
	{
		id: 4,
		image: "/assets/imgs/cars-listing/cars-listing-1/car-4.png",
		rating: "4.96",
		reviews: "672",
		title: "Jaguar XE 2.0d R-Sport",
		location: "Manchester, England",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "18,496 km",
		transmission: "Automatic",
		fuelType: "Petrol",
		price: "498.25",
		link: "/car"
	},
	{
		id: 5,
		image: "/assets/imgs/cars-listing/cars-listing-1/car-5.png",
		rating: "4.96",
		reviews: "672",
		title: "Volkswagen Golf GTD 2.0 TDI",
		location: "Manchester, England",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "18,496 km",
		transmission: "Automatic",
		fuelType: "Petrol",
		price: "498.25",
		link: "/car"
	},
	{
		id: 6,
		image: "/assets/imgs/cars-listing/cars-listing-1/car-6.png",
		rating: "4.96",
		reviews: "672",
		title: "Lexus IS 300h F Sport",
		location: "Manchester, England",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "18,496 km",
		transmission: "Automatic",
		fuelType: "Petrol",
		price: "498.25",
		link: "/car"
	}
];

export default function CarsListing1() {
	return (
		<>
			<section className="section-box box-flights background-body">
				<div className="container">
					<div className="row align-items-end">
						<div className="col-md-9 wow fadeInUp">
							<h3 className="title-svg neutral-1000 mb-5">Most Searched Vehicles</h3>
							<p className="text-lg-medium text-bold neutral-500">The world's leading car brands</p>
						</div>
						<div className="col-md-3 position-relative mb-30 wow fadeInUp">
							<div className="box-button-slider box-button-slider-team justify-content-end">
								<div className="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
								<div className="swiper-button-next swiper-button-next-style-1 swiper-button-next-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div className="block-flights wow fadeInUp">
						<div className="box-swiper mt-30">
							<Swiper {...swiperGroup3} className="swiper-container swiper-group-3 swiper-group-journey">
								<div className="swiper-wrapper">
									{/* Group cars into pairs for SwiperSlides */}
									{Array.from({ length: Math.ceil(carsData.length / 2) }, (_, index) => (
										<SwiperSlide key={index}>
											{carsData.slice(index * 2, index * 2 + 2).map((car) => (
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
							Load More Cars
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
