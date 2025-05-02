'use client'
import Link from "next/link"
import { Box, Flex, HStack, SimpleGrid, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { Power, Calendar, ParkingMeterIcon, Gauge, Fuel } from 'lucide-react';

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

// CarCard Component
const CarCard = ({ car }: { car: Car }) => {
	const textColor = useColorModeValue("gray.700", "gray.300");
	const cardBorderColor = useColorModeValue("gray.100", "#333333");
	const priceColor = useColorModeValue("black", "white");

	return (
		<div className="card-journey-small background-card hover-up">
			<div className="card-image">
				<Link href={car.link}>
					<img src={car.image} alt="Fast4Car" />
				</Link>
			</div>
			<div className="card-info">
				<div className="card-title">
					<Link className="heading-6 neutral-1000" href={car.link}>
						{car.title}
					</Link>
				</div>
				<div className="card-program">
					<div className="card-location">
						<p className="text-location text-md-medium">{car.location}</p>
					</div>
					<Box mb={["2", "2", "1"]} ml="1">
						<SimpleGrid columns={2} spacingX={6} spacingY={2} mb="2">
							<HStack spacing="1">
								<Box as={Power} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.power}</Text>
							</HStack>
							<HStack spacing="1">
								<Box as={Calendar} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.date}</Text>
							</HStack>
							<HStack spacing="1">
								<Box as={ParkingMeterIcon} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor}>{car.mileage}</Text>
							</HStack>
							<HStack spacing="1">
								<Box as={Gauge} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor} fontWeight="semibold">{car.transmission}</Text>
							</HStack>
							<HStack spacing="1">
								<Box as={Fuel} boxSize="4" color={textColor} />
								<Text fontSize="sm" color={textColor} fontWeight="semibold">{car.fuelType}</Text>
							</HStack>
						</SimpleGrid>
					</Box>

					<Box
						px={["0", "0", "2"]}
						borderTopWidth="1px"
						borderColor={cardBorderColor}
					>
						<Flex direction="row" justify="space-between" alignItems="center" align="center" w="100%">
							<VStack display="flex" alignItems="flex-start" gap="1" mt="3" ml="0">
								<HStack spacing="1">
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
		image: "/assets/imgs/cars-listing/cars-listing-2/car-1.png",
		rating: "4.96",
		reviews: "672",
		title: "Volkswagen Golf GTD",
		location: "Manchester, England",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "25,100 miles",
		transmission: "Automatic",
		fuelType: "Diesel",
		price: "498.25",
		link: "/cars-details-2"
	},
	{
		id: 2,
		image: "/assets/imgs/cars-listing/cars-listing-2/car-2.png",
		rating: "4.96",
		reviews: "672",
		title: "Volvo S60 D4 R-Design",
		location: "New South Wales, Australia",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "25,100 miles",
		transmission: "Automatic",
		fuelType: "Diesel",
		price: "498.25",
		link: "/cars-details-2"
	},
	{
		id: 3,
		image: "/assets/imgs/cars-listing/cars-listing-2/car-3.png",
		rating: "4.96",
		reviews: "672",
		title: "Jaguar XE 2.0d R-Sport",
		location: "Manchester, England",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "25,100 miles",
		transmission: "Automatic",
		fuelType: "Diesel",
		price: "498.25",
		link: "/cars-details-2"
	},
	{
		id: 4,
		image: "/assets/imgs/cars-listing/cars-listing-2/car-4.png",
		rating: "4.96",
		reviews: "672",
		title: "Lexus IS 300h F Sport",
		location: "Manchester, England",
		power: "100 kW (136 hp)",
		date: "9/2021",
		mileage: "25,100 miles",
		transmission: "Automatic",
		fuelType: "Diesel",
		price: "498.25",
		link: "/cars-details-2"
	}
];

export default function CarsListing2() {
	return (
		<>
			<section className="section-box box-flights background-body">
				<div className="container">
					<div className="row align-items-end mb-10">
						<div className="col-md-8">
							<h3 className="neutral-1000 wow fadeInUp">Featured Listings</h3>
							<p className="text-lg-medium neutral-500 wow fadeInUp">Find the perfect ride for any occasion</p>
						</div>
						<div className="col-md-4 mt-md-0 mt-4">
							<div className="d-flex justify-content-end">
								<Link className="btn btn-primary wow fadeInUp" href="/cars">
									View More
									<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
					<div className="row pt-30">
						{carsData.map((car) => (
							<div className="col-lg-3 col-md-6 wow fadeIn" key={car.id} data-wow-delay={`${car.id * 0.1}s`}>
								<CarCard car={car} />
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}
