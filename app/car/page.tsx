'use client'
import { Viewport } from 'next'

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
}

import MyDatePicker from '@/components/elements/MyDatePicker'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useState, useRef, useMemo } from "react"
import Marquee from 'react-fast-marquee'
import ModalVideo from 'react-modal-video'
import Slider from "react-slick"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
	useColorModeValue, Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton
} from "@chakra-ui/react"
import logo from '@/public/assets/imgs/template/logo-d.svg';
import { useBestDeals, useGetCar, useGetSimilarCars, useGetCharges } from "@/services/cars/useCars";
import {
	Heart,
	MapPin,
	ParkingMeterIcon,

	Power,

	SlidersHorizontal,
	ChevronLeft,
	ChevronRight,
	Bell,
} from 'lucide-react';
import logoDark from '@/public/assets/imgs/template/logo-w.svg';
import {

	Skeleton,
	SkeletonText,

	Heading,
	Container,
	Wrap,
	WrapItem,
	Tag,
	TagLabel,
	TagCloseButton,
	Link as ChakraLink,
	Select,
	AspectRatio,
} from '@chakra-ui/react';
import {
	Box,
	Text,
	Flex,
	Button,
	Icon,
	Badge,
	useBreakpointValue,
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerContent,
	DrawerOverlay,
	DrawerCloseButton,
	VStack,
	HStack,
	IconButton,
	SimpleGrid,
} from "@chakra-ui/react"
import Image from 'next/image'
import { ChevronUp, X, ChevronDown, Calendar, Clock, Info, Gauge, Fuel } from "lucide-react"

import FinancingSpecs from '@/components/checkout/PaymentMethod/FinancingSpecs'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import { useRouter } from 'next/navigation'
// import { XAxis, YAxis, CartesianGrid } from "recharts";

const arrowButtonStyle = {
	width: 36,
	height: 36,
	borderRadius: '50%',
	background: 'rgba(255,255,255,0.85)',
	border: '1px solid #ddd',
	boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	zIndex: 2,
	cursor: 'pointer',
	transition: 'background 0.2s, box-shadow 0.2s',
};

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: any) => (
	<button
		{...props}
		style={{
			...arrowButtonStyle,
			left: 12,
			opacity: currentSlide === 0 ? 0.5 : 1,
		}}
		aria-label="Previous"
		type="button"
	>
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M13 16L8 10L13 4" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	</button>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }: any) => (
	<button
		{...props}
		style={{
			...arrowButtonStyle,
			right: 12,
			opacity: currentSlide === slideCount - 1 ? 0.5 : 1,
		}}
		aria-label="Next"
		type="button"
	>
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M7 4L12 10L7 16" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	</button>
);

export default function CarsDetails1() {
	const borderColor = useColorModeValue("gray.100", "gray.700");
	const darkGrayTextColor = useColorModeValue("gray.800", "gray.200");
	const redTextColor = useColorModeValue("red.600", "red.300");
	const [isOpen, setOpen] = useState(false)
	const [nav1, setNav1] = useState(null)
	const [nav2, setNav2] = useState(null)
	const [slider1, setSlider1] = useState(null)
	const [slider2, setSlider2] = useState(null)
	const [activeTab, setActiveTab] = useState("details")
	const [activeStep, setActiveStep] = useState(1)
	const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
	const carId = searchParams.get('id');
	const [isDrawerOpen, setDrawerOpen] = useState(false)
	const isMobile = useBreakpointValue({ base: true, md: false })
	const { data: carData, isLoading, error } = useGetCar(carId || '');
	const { data: similarCars, isLoading: isSimilarLoading } = useGetSimilarCars(carId || "");
	// const { data: charges, isLoading: isChargesLoading } = useGetCharges(carId || "");
	console.log('Car Data:', similarCars);
	useEffect(() => {
		console.log('Car ID:', carId);
		// Here you would fetch the car data based on the ID

		setNav1(slider1)
		setNav2(slider2)

		// Handle smooth scrolling for nav links
		const navLinks = document.querySelectorAll('.car-nav-tabs a');
		navLinks.forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetId = (e.currentTarget as HTMLAnchorElement).getAttribute('href')?.substring(1);
				if (targetId) {
					setActiveTab(targetId);


					const targetElement = document.getElementById(targetId);
					if (targetElement) {
						window.scrollTo({
							top: targetElement.offsetTop - 100,
							behavior: 'smooth'
						});
					}
				}
			});
		});

		// Initialize carousel event listeners
		const carousel = document.getElementById('howItWorksCarousel');
		if (carousel) {
			// Manual handling for Bootstrap carousel
			const prevButton = document.querySelector('[data-bs-target="#howItWorksCarousel"][data-bs-slide="prev"]');
			const nextButton = document.querySelector('[data-bs-target="#howItWorksCarousel"][data-bs-slide="next"]');
			const indicators = document.querySelectorAll('[data-bs-target="#howItWorksCarousel"][data-bs-slide-to]');

			// Manually initialize the carousel if Bootstrap is not available
			if (typeof window !== 'undefined' && !(window as any)['bootstrap']) {
				let currentSlide = 0;
				const slides = carousel.querySelectorAll('.carousel-item');

				const updateCarousel = () => {
					slides.forEach((slide, index) => {
						if (index === currentSlide) {
							slide.classList.add('active');
						} else {
							slide.classList.remove('active');
						}
					});
					setActiveStep(currentSlide + 1);
				};

				// Handle indicator clicks
				indicators.forEach((indicator, index) => {
					indicator.addEventListener('click', () => {
						currentSlide = index;
						updateCarousel();
					});
				});

				// Handle prev/next clicks
				if (prevButton) {
					prevButton.addEventListener('click', () => {
						currentSlide = (currentSlide - 1 + slides.length) % slides.length;
						updateCarousel();
					});
				}

				if (nextButton) {
					nextButton.addEventListener('click', () => {
						currentSlide = (currentSlide + 1) % slides.length;
						updateCarousel();
					});
				}
			}

			// Event listener for slide changes (if Bootstrap is available)
			carousel.addEventListener('slide.bs.carousel', (e: any) => {
				if (e && typeof e.to === 'number') {
					setActiveStep(e.to + 1);
				}
			});

			// Add click handlers for the step buttons
			const stepButtons = document.querySelectorAll('[data-bs-target="#howItWorksCarousel"][data-bs-slide-to]');
			stepButtons.forEach((button) => {
				button.addEventListener('click', () => {
					const slideIndex = button.getAttribute('data-bs-slide-to');
					if (slideIndex) {
						setActiveStep(parseInt(slideIndex) + 1);
					}
				});
			});
		}

		// Track scroll position to update active tab
		const handleScroll = () => {
			const sections = [
				{ id: 'details', offset: document.getElementById('details')?.offsetTop || 0 },
				{ id: 'features', offset: document.getElementById('features')?.offsetTop || 0 },
				{ id: 'how-it-works', offset: document.getElementById('how-it-works')?.offsetTop || 0 },
				{ id: 'price-map', offset: document.getElementById('price-map')?.offsetTop || 0 },
				{ id: 'comparison', offset: document.getElementById('comparison')?.offsetTop || 0 },
				{ id: 'financing', offset: document.getElementById('financing')?.offsetTop || 0 },
			];
			const scrollPosition = window.scrollY + 120; // adjust offset for sticky nav

			let current = 'details';
			for (let i = 0; i < sections.length; i++) {
				if (scrollPosition >= sections[i].offset) {
					current = sections[i].id;
				}
			}
			setActiveTab(current);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [slider2, slider1, carId]);

	const settingsMain = {
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: false,

		prevArrow: <SlickArrowLeft />,
		nextArrow: <SlickArrowRight />,
	}

	const settingsThumbs = {
		slidesToShow: 6,
		slidesToScroll: 1,
		asNavFor: nav1,
		dots: false,
		focusOnSelect: true,
		vertical: false,
		responsive: [
			{ breakpoint: 1200, settings: { slidesToShow: 5 } },
			{ breakpoint: 1024, settings: { slidesToShow: 4 } },
			{ breakpoint: 700, settings: { slidesToShow: 3 } },
			{ breakpoint: 480, settings: { slidesToShow: 2 } },
		],
	}
	const [isAccordion, setIsAccordion] = useState(null)

	const handleAccordion = (key: any) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	const axisLabelColor = useColorModeValue("#222", "#E5E7EB");
	const gridLineColor = useColorModeValue("#E5E7EB", "#2D3748"); // Light gray for light mode, darker gray for dark
	const backgroundColor = useColorModeValue("#ffffff", "#1A202C"); // White for light, dark gray for dark
	const badgeBgLight = useColorModeValue("#f8f9fa", "#2D3748"); // Bootstrap's light bg alternative
	const marketDotColor = useColorModeValue("#BBC5D5", "#4A5568"); // Muted blue-gray in dark mode
	const textMuted = useColorModeValue("gray.600", "gray.400");
	// Custom mobile drawer component for Buy Car
	const MobileBuyCarDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

		const bgColor = useColorModeValue("white", "gray.800")
		const borderColor = useColorModeValue("gray.200", "gray.700")
		const overlayBg = useColorModeValue("blackAlpha.600", "blackAlpha.800")
		const textColor = useColorModeValue("gray.900", "white")
		const mutedTextColor = useColorModeValue("gray.600", "gray.400");
		const lightMutedTextColor = useColorModeValue("gray.500", "gray.500");
		const redTextColor = useColorModeValue("red.600", "red.300");
		const redBgLight = useColorModeValue("red.50", "red.900");
		const redBorderLight = useColorModeValue("red.100", "red.800");
		const greenBgLight = useColorModeValue("green.50", "green.900");
		const greenTextColor = useColorModeValue("green.600", "green.300");
		const greenBorderLight = useColorModeValue("green.100", "green.800");
		const hoverBgColor = useColorModeValue("gray.50", "gray.700");

		// Additional color values
		const premiumHeaderBgGradient = useColorModeValue(
			"linear(to-br, red.500, red.600, red.700)",
			"linear(to-br, red.700, red.600, red.500)"
		);
		const gray50BgColor = useColorModeValue("gray.50", "gray.700");
		const grayTextColor = useColorModeValue("gray.700", "gray.300");
		const darkGrayTextColor = useColorModeValue("gray.800", "gray.200");
		interface ServiceItem {
			label: string;
			price: string;
			hasDropdown?: boolean;
			isFree?: boolean;
		}
		const services: ServiceItem[] = [
			{ label: 'Home delivery', price: 'EUR 15,005', hasDropdown: true },
			{ label: '12 liters of fuel', price: 'FREE', isFree: true },
			{ label: 'Import MOT', price: 'EUR 4,490' },
			{ label: 'Administration Fee', price: 'EUR 800' },
			{ label: 'Car registration', price: 'EUR 1,990' },
			{ label: 'Extended warranty', price: 'FREE', isFree: true }
		];
		const { t } = useTranslation()
		return (
			<>
				<Box
					position="fixed"
					inset="0"
					bg={overlayBg}
					zIndex={1000}
					transition="all 0.3s"
					opacity={isOpen ? 1 : 0}
					pointerEvents={isOpen ? "auto" : "none"}
					onClick={onClose}
					display={{ md: "none" }}
				/>
				<Box
					position="fixed"
					bottom="0"
					left="0"
					right="0"
					bg={bgColor}
					borderTopRadius="2xl"
					transition="transform 0.3s"
					transform={isOpen ? "translateY(0)" : "translateY(100%)"}
					zIndex={1001}
					display={{ md: "none" }}
					maxHeight="90vh"
					overflow="hidden"
				>
					{/* Handle at the top for swipe gesture */}
					<Box
						width="36px"
						height="4px"
						bg={useColorModeValue("gray.300", "gray.600")}
						borderRadius="full"
						mx="auto"
						mt={2}
						mb={2}
					/>

					<Flex justify="space-between" align="center" p={4} borderBottom="1px" borderColor={borderColor}>
						<Text fontSize="lg" fontWeight="semibold" color={textColor}>
							{carData?.brand} {carData?.model}
						</Text>
						<IconButton
							variant="ghost"
							icon={<Icon as={X} w={5} h={5} />}
							onClick={onClose}
							aria-label="Close drawer"
						/>
					</Flex>

					<Box p={2} overflowY="auto" maxHeight="calc(90vh - 100px)" pb="80px">
						{/* Price Card */}
						<Box bgGradient="linear(to-br, red.500, red.600, red.700)" borderRadius="xl" p={5} mx={3} mt={3} mb={4} color="white" textAlign="left">
							<Text fontSize="sm" fontWeight="medium" color="red.100" opacity={0.9}>
								{t('car.totalPriceInclServices')}
							</Text>
							<Text fontSize="3xl" fontWeight="bold" mt={2} color="white" letterSpacing="tight">
								EUR 647,765
							</Text>
							<Text fontSize="xs" color="red.100" opacity={0.8} mt={1.5}>
								EUR 542,965 without VAT
							</Text>
							<VStack display="flex" alignItems="flex-start" justifyContent="center" gap="1" mt="3" ml="0">
								<HStack spacing="1" >
									{[...Array(5)].map((_, i) => (
										<Box key={i} w="7px" h="7px" borderRadius="full" bg="#64E364" />
									))}
									<Text fontSize="sm" color='white' fontWeight="semibold" mb="0">
										{t('car.sideBar.vgoodprice')}
									</Text>
								</HStack>

							</VStack>
						</Box>

						{/* Vehicle details */}
						<Box borderBottom="1px" borderColor={borderColor} mb={1} p={2}>
							<Text fontSize="md" fontWeight="semibold" color={textColor} mb={3}>
								{carData?.brand} {carData?.model}
							</Text>
							<VStack spacing={1} align="stretch">
								<Flex justify="space-between" align="center">
									<Text fontSize="sm" color={mutedTextColor}>{t('car.sideBar.price')}</Text>
									<Text fontSize="sm" fontWeight="semibold" color={textColor}>EUR 634,490</Text>
								</Flex>
								<Flex justify="space-between" align="center">
									<Text fontSize="sm" color={lightMutedTextColor}>{t('car.sideBar.priceWithoutVAT')}</Text>
									<Text fontSize="sm" color={lightMutedTextColor}>EUR 447,915</Text>
								</Flex>
								<Flex align="center" gap={1} mt={2} bg={gray50BgColor} rounded="lg">
									<Text fontSize="xs" color={mutedTextColor}>{t('car.sideBar.price')}</Text>
									<Icon as={Info} w={3.5} h={3.5} color={lightMutedTextColor} aria-label="info-Icon" />
								</Flex>
							</VStack>
						</Box>

						{/* CarAudit */}
						<Box borderBottom="1px" borderColor={borderColor} p={2}>
							<Flex
								justify="space-between"
								align="center"
								p={1}
								rounded="lg"
								_hover={{ bg: hoverBgColor, opacity: 0.4 }}
								transition="all 0.3s"
							>
								<Text fontSize="sm" fontWeight="medium" color={darkGrayTextColor}>CarAudit™</Text>
								<Text fontSize="sm" fontWeight="semibold" color={textColor}>EUR 1,990</Text>
							</Flex>
						</Box>

						{/* Additional Services */}
						<Box mb={2} p={2}>
							<Text
								fontSize="xs"
								fontWeight="semibold"
								color={lightMutedTextColor}
								textTransform="uppercase"
								letterSpacing="wider"
								mb={1}
							>
								{t('car.sideBar.additionalServices')}
							</Text>
							<VStack spacing={1} align="stretch">
								{services.map((service, index) => (
									<Flex
										key={index}
										justify="space-between"
										align="center"
										p={1}
										_hover={{ bg: hoverBgColor }}
										rounded="lg"
										transition="all 0.3s"
									>
										<HStack spacing={2}>
											<Text fontSize="sm" color={grayTextColor}>{service.label}</Text>
											{service.hasDropdown && (
												<Icon as={ChevronDown} w={4} h={4} color={lightMutedTextColor} />
											)}
										</HStack>
										{service.isFree ? (
											<Badge
												px={2.5}
												py={1}
												colorScheme="green"
												variant="solid"
												fontSize="xs"
												fontWeight="medium"
											>
												{service.price}
											</Badge>
										) : (
											<Text fontSize="sm" fontWeight="medium" color={textColor}>
												{service.price}
											</Text>
										)}
									</Flex>
								))}
							</VStack>
						</Box>

						{/* Optional Services */}
						<Box
							bg={gray50BgColor}
							opacity={0.5}
							mb={2}
							rounded="xl"
							p={4}
						>
							<Text
								fontSize="xs"
								fontWeight="semibold"
								color={lightMutedTextColor}
								textTransform="uppercase"
								letterSpacing="wider"
							>
								{t('car.sideBar.optionalServices')}
							</Text>
							<Text fontSize="xs" color={mutedTextColor}>
								{t('car.sideBar.otherRecommendedServices')}
							</Text>
						</Box>

						{/* Total Price */}
						<Box borderTop="1px" borderColor={borderColor} p={2}>
							<Flex justify="space-between" align="center">
								<Text fontSize="md" fontWeight="medium" color={darkGrayTextColor}>
									{t('car.sideBar.totalPrice')}
								</Text>
								<Text fontSize="2xl" fontWeight="bold" color={redTextColor}>
									EUR 667,765
								</Text>
							</Flex>
						</Box>

						{/* Financing Note */}
						<Box
							bg={redBgLight}
							rounded="xl"
							p={2}
							border="1px"
							borderColor={redBorderLight}
							opacity={0.5}
							mt={2}
						>
							<Flex justify="space-between" align="center" mb={2}>
								<Text fontSize="sm" color={grayTextColor}>
									You are financing car for example for
								</Text>
								<Text fontSize="md" fontWeight="bold" color={redTextColor}>
									EUR 5,557/mo
								</Text>
							</Flex>
							<Flex align="center" gap={0.5}>
								<Text fontSize="xs" color={mutedTextColor}>
									120%, 48 instalments
								</Text>
								<Icon as={Info} w={3.5} h={3.5} color={lightMutedTextColor} aria-label="info-Icon" />
							</Flex>
						</Box>
					</Box>
					<Box
						position="absolute"
						bottom="0"
						left="0"
						right="0"
						bg={bgColor}
						borderTop="1px solid"
						borderColor={borderColor}
						p={4}
						zIndex={2}
					>
						<Button onClick={handleBuyNow} bg="red.500" color="white" size="lg" w="100%">
							{t('car.sideBar.buynow')}
						</Button>
					</Box>
				</Box>
			</>
		);
	};
	const headingColor = useColorModeValue("black", "red.400");
	const cars = useMemo(() => [
		{
			id: 1,
			name: "BMW Cooper 100 kW",
			images: [
				"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
				"https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
				"https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwMzMwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
				"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGklMjBhNXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
				"https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
			],
			power: "100 kW (136 hp)",
			date: "9/2021",
			mileage: "18,496 km",
			transmission: "Automatic",
			fuelType: "Petrol",
			features: [
				"Digital cockpit",
				"Keyless entry",
				"Apple CarPlay",
				"Navigation system",
				"Cruise control",
				"LED headlights"
			],
			price: 25749,
			logo: "/Logo/logo.png"
		}
	], []);
	const LucideIcon = ({ icon: Icon, ...props }: { icon: React.ElementType;[key: string]: any }) => {
		return <Box as={Icon} {...props} />;
	};
	const textColor = useColorModeValue("gray.900", "white");
	const priceColor = useColorModeValue("#171923", "white");
	const bgColor = useColorModeValue("white", "#171923");
	const badgeBg = useColorModeValue("red.50", "#171923");
	const bgnavitem = useColorModeValue("red.500", "red.500")
	const badgeColor = useColorModeValue("red.400", "red.300");

	const buttonLinkColor = useColorModeValue("red.500", "red.300");
	const car = cars[0];

	const priceMapData = [
		{ km: 57000, price: 36000, type: "this" },      // orange
		{ km: 66000, price: 35000, type: "similar" },   // blue
		{ km: 61000, price: 40000, type: "market" },    // gray
		// ...more
	];

	const axisColor = useColorModeValue("#6B7280", "#E5E7EB"); // gray-500 for light, gray-200 for dark
	const gridColor = useColorModeValue("#E5AF2", "#444857"); // light gray for light, dark gray for dark

	const allPrices = [
		...(similarCars?.map((car: any) => car.price) || []),
		carData?.price
	].filter((p) => typeof p === 'number' && !isNaN(p));
	allPrices.sort((a, b) => a - b);

	const minPrice = allPrices[0];
	const maxPrice = allPrices[allPrices.length - 1];
	const segmentSize = (maxPrice - minPrice) / 5;
	// 6 boundaries for 5 segments
	const segmentPrices = Array.from({ length: 6 }).map((_, i) =>
		minPrice + i * segmentSize
	);

	const carPrice = carData?.price;
	let carSegment = 0;
	if (carPrice !== undefined) {
		carSegment = Math.min(
			4,
			Math.floor((carPrice - minPrice) / segmentSize)
		);
	}

	// Calculate marker position for THIS CAR
	let markerLeft = '0%';
	if (carPrice !== undefined) {
		for (let i = 0; i < 5; i++) {
			if (carPrice >= segmentPrices[i] && carPrice <= segmentPrices[i + 1]) {
				const segmentStart = segmentPrices[i];
				const segmentEnd = segmentPrices[i + 1];
				const percentWithin = (carPrice - segmentStart) / (segmentEnd - segmentStart);
				const markerPercent = ((i + percentWithin) / 5) * 100;
				markerLeft = `${markerPercent}%`;
				console.log("markerLeft", markerLeft);
				console.log("carPrice", carPrice);
				console.log("segmentPrices", segmentPrices);
				console.log("segmentStart", segmentStart);
				console.log("segmentEnd", segmentEnd);
				console.log("percentWithin", percentWithin);
				break;
			}
		}
	}

	const allMileages = [
		...(similarCars?.map((car: any) => car.mileage) || []),
		carData?.mileage
	].filter((m) => typeof m === 'number' && !isNaN(m));
	allMileages.sort((a, b) => a - b);

	const minMileage = allMileages[0];
	const maxMileage = allMileages[allMileages.length - 1];

	const getX = (mileage: number) =>
		((mileage - minMileage) / (maxMileage - minMileage)) * 100;

	const getY = (price: number) =>
		100 - ((price - minPrice) / (maxPrice - minPrice)) * 100; // 0% is top, 100% is bottom

	// Generate 6 ticks for X (mileage) and Y (price) axes
	const xTicks = Array.from({ length: 6 }).map((_, i) =>
		Math.round(minMileage + ((maxMileage - minMileage) / 5) * i)
	);
	const yTicks = Array.from({ length: 6 }).map((_, i) =>
		Math.round(maxPrice - ((maxPrice - minPrice) / 5) * i)
	);

	// Add state for zipcode and charges
	const [zipcode, setZipcode] = useState("");
	const [submittedZip, setSubmittedZip] = useState("");
	const { data: charges, isLoading: isChargesLoading } = useGetCharges(carData?.id || "", submittedZip);

	// Add this handler inside CarsDetails1 component, before the return statement
	const handleBuyNow = () => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('token');
			if (!token) {
				setIsLoginModalOpen(true);
				return;
			}
			window.location.href = `/checkout?carId=${carData?.id}`;
		}
	};
	const router = useRouter()
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	return (
		<Layout footerStyle={1}>
			<div className='bg-gray-100'>
				<Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} isCentered>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Please Login</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Text>You need to be logged In.</Text>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="red" mr={3} onClick={() => {
								setIsLoginModalOpen(false);
								router.push('/login');
							}}>
								Go to Login
							</Button>
							<Button variant="ghost" onClick={() => setIsLoginModalOpen(false)}>Cancel</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<section className="section-box box-banner-home2 background-body">
					<div className="container">
						<div className="row">
							<div className="col-lg-8">
								<div className="container-banner-activities">
									<div className="box-banner-activities mt-4">
										<Slider
											{...settingsMain}
											asNavFor={nav2 as any}
											ref={(slider) => setSlider1(slider as any)}
											className="banner-activities-detail">
											{carData?.images?.map((img: string, idx: number) => (
												<div className="banner-slide-activity" key={idx}>
													<img src={img} alt={`Car image ${idx + 1}`} className="w-100" />
												</div>
											))}
										</Slider>
										{/* <div className="box-button-abs">
											<Link className="btn btn-red rounded-pill text-white" href="#">
												<svg className="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6Z" fill="currentColor" />
													<path d="M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM13 15H15V11H19V9H15V5H13V9H9V11H13V15Z" fill="currentColor" />
												</svg>
												See All Photos
											</Link>
											<a className="btn btn-light rounded-pill popup-youtube" onClick={() => setOpen(true)}>
												<svg className="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
												</svg>
												Video Clips
											</a>
										</div> */}
									</div>
									<div className="slider-thumnail-activities d-none d-md-block">
										<Slider
											{...settingsThumbs}
											asNavFor={nav1 as any}
											ref={(slider) => setSlider2(slider as any)}
											className="slider-nav-thumbnails-activities-detail">
											{carData?.images?.map((img: string, idx: number) => (
												<div className="banner-slide" key={idx}>
													<img src={img} alt={`Car thumbnail ${idx + 1}`} />
												</div>
											))}
										</Slider>
									</div>
								</div>
								<div>
									<Flex
										flex="1"
										// p={["4", "4", "3"]} 
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
													fontSize={["2xl", "2xl", "2xl"]}
													fontWeight="bold"
													color={headingColor}
													letterSpacing="wide"
													fontFamily="inter"
													_hover={{ color: "red.500" }}
												// mb={["1", "1", "0"]}
												>
													{carData?.brand} {carData?.model}
													{carData?.power ? ` ${(carData.power * 0.7355).toFixed(0)} kW` : ''}
												</Heading>
												<Box mt={["1", "1", "0"]} className='light-mode'>
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
												</Box>
											</Flex>

											{/* Specs Row - inline with minimal spacing */}
											<Box mb={["2", "2", "1"]} ml="1">
												<Flex direction="row" gap={6} mb={1}>
													<HStack spacing="1">
														<LucideIcon icon={Power} boxSize="4" color={textColor} />
														<Text fontSize="sm" color={textColor}>{carData?.power} kW	</Text>
													</HStack>
													<HStack spacing="1">
														<LucideIcon icon={Calendar} boxSize="4" color={textColor} />
														<Text fontSize="sm" color={textColor}>{carData?.year}</Text>
													</HStack>
													<HStack spacing="1">
														<LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
														<Text fontSize="sm" color={textColor}>{carData?.mileage} km</Text>
													</HStack>
												</Flex>
												<Flex direction="row" gap={6}>
													<HStack spacing="1">
														<LucideIcon icon={Gauge} boxSize="4" color={textColor} />
														<Text fontSize="sm" color={textColor} fontWeight="semibold">{carData?.gear}</Text>
													</HStack>
													<HStack spacing="1">
														<LucideIcon icon={Fuel} boxSize="4" color={textColor} />
														<Text fontSize="sm" color={textColor} fontWeight="semibold">{carData?.fuel}</Text>
													</HStack>
												</Flex>
											</Box>

											{/* Features - keeping size with less vertical space */}
											<Flex wrap="wrap" gap={["2", "2", "1.5"]} mt="0" mb={["4", "4", "0"]} ml="1">
												{carData?.features &&
													Object.entries(carData?.features)
														.flatMap(([category, features]) => (Array.isArray(features) ? features : []))
														.slice(0, 4)
														.map((feature, index) => (
															<Badge
																key={index}
																px="2"
																bg={badgeBg}
																// className="bg-gray-100"
																color={badgeColor}
																borderRadius="md"
																fontSize="sm"
																fontWeight="medium"
																style={{ textTransform: "none" }}
															>
																{feature}
															</Badge>
														))}
												{carData?.features && Object.entries(carData?.features)
													.flatMap(([category, features]) => (Array.isArray(features) ? features : []))
													.length > 4 && (
														<Button
															variant="unstyled"
															color={buttonLinkColor}
															fontSize="sm"
															fontWeight="medium"
															height="auto"
															padding="0"
															lineHeight="1.5"
															_hover={{ textDecoration: "underline" }}
															onClick={(e) => e.preventDefault()}
															style={{ textTransform: "none" }}
														>
															+ {Object.entries(carData?.features)
																.flatMap(([category, features]) => (Array.isArray(features) ? features : []))
																.length - 4} more
														</Button>
													)}
											</Flex>
										</Box>

										{/* Location and Price - maintain size with reduced space */}


									</Flex>
								</div>
								<div className="car-nav-tabs mt-4 mb-4 " style={{ top: "0", zIndex: "100" }}>
									<div className="container-fluid px-0">
										<div className="nav-scroll py-3  rounded" style={{ overflowX: "auto", whiteSpace: "nowrap", backgroundColor: bgColor }}>
											<ul className="nav nav-pills px-1 nav-tabs-grid">
												<li className="nav-item ">
													<a onClick={() => setActiveTab('#details')} href="#details" className={` font-extrabold text-xs nav-link ${activeTab === 'details' ? 'text-white' : 'text-gray-900 dark:text-white'}`} style={activeTab === 'details' ? { backgroundColor: "#E53E3E" } : {}}>{t('car.details')}</a>
												</li>
												<li className="nav-item">
													<a onClick={() => setActiveTab('features')} href="#features" className={`text-xs nav-link ${activeTab === 'features' ? 'text-white' : 'text-gray-900 dark:text-white'}`} style={activeTab === 'features' ? { backgroundColor: "#E53E3E" } : {}}>{t('car.features')}</a>
												</li>
												<li className="nav-item">
													<a onClick={() => setActiveTab('how-it-works')} href="#how-it-works" className={`text-xs nav-link ${activeTab === 'how-it-works' ? 'text-white' : 'text-gray-900 dark:text-white'}`} style={activeTab === 'how-it-works' ? { backgroundColor: "#E53E3E" } : {}}>{t('car.howItWorks')}</a>
												</li>
												<li className="nav-item">
													<a onClick={() => setActiveTab('price-map')} href="#price-map" className={`text-xs nav-link ${activeTab === 'price-map' ? 'text-white' : 'text-gray-900 dark:text-white'}`} style={activeTab === 'price-map' ? { backgroundColor: "#E53E3E" } : {}}>{t('car.priceMap')}</a>
												</li>
												<li className="nav-item">
													<a onClick={() => setActiveTab('financing')} href="#financing" className={`text-xs nav-link ${activeTab === 'financing' ? 'text-white' : 'text-gray-900 dark:text-white'}`} style={activeTab === 'financing' ? { backgroundColor: "#E53E3E" } : {}}>{t('car.financing')}</a>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div className="box-collapse-expand mt-4" id="details">
									<div className="group-collapse-expand border-none">
										<div className="card card-body">
											<div className="car-details-specifications py-4">
												<h2 className="mb-4 text-gray-900 dark:text-white">{t('car.details')}</h2>

												<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4">
													<div className="row g-4">
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0z"></path>
																		<path d="M12 7v5l3 3"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-gray-500 dark:text-gray-400 small">{t('car.mileage')}</div>
																	<div className="fw-bold text-gray-900 dark:text-white">46,042 km</div>
																</div>
															</div>
														</div>
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
																		<line x1="16" y1="2" x2="16" y2="6"></line>
																		<line x1="8" y1="2" x2="8" y2="6"></line>
																		<line x1="3" y1="10" x2="21" y2="10"></line>
																	</svg>
																</div>
																<div>
																	<div className="text-gray-500 dark:text-gray-400 small">{t('car.firstRegistration')}</div>
																	<div className="fw-bold text-gray-900 dark:text-white">12/2020</div>
																</div>
															</div>
														</div>
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M4 20h16a2 2 0 0 1 2-2V8a2 2 0 0 0-2-2h-2V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
																		<path d="M12 8v8"></path>
																		<path d="M8 12h8"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-gray-500 dark:text-gray-400 small">{t('car.power')}</div>
																	<div className="fw-bold text-gray-900 dark:text-white">181 hp</div>
																</div>
															</div>
														</div>
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M5 16l2.5-7.5L10 16"></path>
																		<path d="M14 16l2-4 2 4"></path>
																		<path d="M4 19h4"></path>
																		<path d="M14 19h6"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-gray-500 dark:text-gray-400 small">{t('car.transmission')}</div>
																	<div className="fw-bold text-gray-900 dark:text-white">Automatic</div>
																</div>
															</div>
														</div>
														{/* <div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-gray-500 dark:text-gray-400 small">{t('car.driveType')}</div>
																	<div className="fw-bold text-gray-900 dark:text-white">4x2</div>
																</div>
															</div>
														</div> */}
														{/* <div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"></path>
																		<path d="M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2"></path>
																		<path d="M6 6h.01"></path>
																		<path d="M6 18h.01"></path>
																		<path d="M13 12l-3-3m0 6l3-3"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-gray-500 dark:text-gray-400 small">{t('car.consumption')}</div>
																	<div className="fw-bold text-gray-900 dark:text-white">4 l/100km</div>
																</div>
															</div>
														</div> */}
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M9 20L3 17V7l6 3"></path>
																		<path d="M9 20v-9"></path>
																		<path d="M15 20l6-3V7l-6 3"></path>
																		<path d="M15 20v-9"></path>
																		<path d="M9 11L15 8"></path>
																		<path d="M9 4l6-3"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-gray-500 dark:text-gray-400 small">{t('car.co2Emissions')}</div>
																	<div className="fw-bold text-gray-900 dark:text-white">{carData?.CO2_emissions}/km</div>
																</div>
															</div>
														</div>
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
																		<path d="M8.5 8.5v.01"></path>
																		<path d="M16 12v.01"></path>
																		<path d="M12 16v.01"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-gray-500 dark:text-gray-400 small">{t('car.location')}</div>
																	<div className="fw-bold text-gray-900 dark:text-white">{carData?.country}</div>
																</div>
															</div>
														</div>
													</div>
												</div>

												<div className="electric-specs bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4" >
													<div className="d-flex justify-content-between mb-3">
														<h6 className='sm:text-md md:text-lg lg:text-xl text-gray-900 dark:text-white'>{t('car.specifications')}</h6>
														<span className="badge bg-red-500 text-dark p-2 rounded">{t('car.spec')}ⓘ</span>
													</div>

													{/* <div className="row g-4 mt-2">
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3 text-primary">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<rect x="2" y="4" width="20" height="16" rx="2"></rect>
																		<path d="M12 4v16"></path>
																		<path d="M6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
																		<path d="M18 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-muted small">{t('car.batteryCapacity')}</div>
																	<div className="fw-bold">2 kWh</div>
																</div>
															</div>
														</div>
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3 text-primary">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-muted small">{t('car.electricMotorPower')}</div>
																	<div className="fw-bold">80 kW</div>
																</div>
															</div>
														</div>
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3 text-primary">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M5 4h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
																		<path d="M16 4h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
																		<path d="M8 10h6"></path>
																		<path d="M4 15l4 5"></path>
																		<path d="M16 20l4-5"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-muted small">{t('car.internalCombEnginePower')}</div>
																	<div className="fw-bold">112 kW</div>
																</div>
															</div>
														</div>
														<div className="col-6 col-md-4">
															<div className="d-flex align-items-center">
																<div className="icon-container me-3 text-primary">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M5 4h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
																		<path d="M16 4h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
																		<path d="M8 10h6"></path>
																		<path d="M4 15l4 5"></path>
																		<path d="M16 20l4-5"></path>
																	</svg>
																</div>
																<div>
																	<div className="text-muted small">{t('car.secondaryFuel')}</div>
																	<div className="fw-bold">Petrol</div>
																</div>
															</div>
														</div>
													</div> */}

													{/* <div className="row mt-4">
														<div className="col-6 col-md-4">
															<div className="mb-3">
																<div className="text-muted small">Battery type</div>
																<div className="fw-bold">Nickel-metal hydride (Ni-MH)</div>
															</div>
														</div>
													</div> */}

													<div className="mt-2">
														<a href="#" className="text-primary d-flex align-items-center">
															<span>{t('car.moreAbout')}</span>
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2">
																<path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"></path>
																<path d="M14 2h6v6"></path>
																<path d="M18 8L8 18"></path>
															</svg>
														</a>
													</div>

													<div className="mt-4 pt-3 border-top text-muted small">
														<p className="mb-0">{t('car.moreAboutDesc')}</p>
													</div>
												</div>

												<div className="general-engine-info ">
													<div className="row">
														<div className="col-6 col-md-4 ">
															<div className="card border-0 mb-4">
																<div className="card-header bg-gray-50 dark:bg-gray-800">{t('car.general')}</div>
																<div className="card-body p-0">
																	<table className="table table-striped mb-0">
																		<tbody>
																			<tr>
																				<td className="text-muted">{t('car.vehicleId')}</td>
																				<td className="fw-medium">{carData?.id}</td>
																			</tr>
																			<tr>
																				<td className="text-muted">{t('car.make')}</td>
																				<td className="fw-medium">{carData?.brand}</td>
																			</tr>
																		</tbody>
																	</table>
																</div>
															</div>
														</div>
														<div className="col-6 col-md-4">
															<div className="card border-0 mb-4">
																<div className="card-header bg-gray-50 dark:bg-gray-800">{t('car.engine')}</div>
																<div className="card-body p-0">
																	<table className="table table-striped mb-0">
																		<tbody>
																			<tr>
																				<td className="text-muted">{t('car.enginecapacity')}</td>
																				<td className="fw-medium">{carData?.engine_size}</td>
																			</tr>
																			{/* <tr>
																				<td className="text-muted">{t('car.consumptionComb')}</td>
																				<td className="fw-medium">{carData?.CO2_emissions}</td>
																			</tr> */}
																		</tbody>
																	</table>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="features-section py-5" id="features">
									<div className="container-fluid px-0">
										<h2 className="mb-4 text-gray-900 dark:text-white">{t('car.features')}</h2>
										<div className="row">
											{Object.entries(carData?.features || {}).map(([category, features]) => (
												<div key={category} className="col-md-6 mb-4">
													<div className="card border-0 h-100 bg-gray-50 dark:bg-gray-800">
														<div className="d-flex align-items-center justify-content-between p-4">
															<h6 className="card-title text-gray-900 dark:text-white mb-0 sm:text-md md:text-lg lg:text-xl">
																{category}
															</h6>
														</div>
														<div className="card-body p-4 pt-0">
															<div className="row">
																<div className="col-md-6">
																	<ul className="list-unstyled feature-list">
																		{(features as string[]).map((feature: string, index: number) => (
																			<li key={index} className="mb-2">
																				<span className="text-gray-900 dark:text-white">{feature}</span>
																			</li>
																		))}
																	</ul>
																</div>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>

								<div id="how-it-works" className="mt-5 pt-3 w-full">
									<h3 className="mb-4 text-gray-900 dark:text-white">{t('car.howitworks.title')}</h3>
									<div className="card border-0 rounded-4 overflow-hidden ">
										<div id="howItWorksCarousel" className="carousel slide" data-bs-ride="carousel">
											<div className="carousel-inner">
												<div className="carousel-item active  p-4">
													<div className="position-relative">
														<div className="d-flex">
															<div className="position-relative" style={{ width: "fit-content", clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", overflow: "hidden" }}>
																<div style={{ height: "fit-content" }}>
																	<img src="/check.jpg" className="w-100 h-100" alt="Car inspection" style={{ objectFit: "cover", objectPosition: "center" }} />
																</div>
																<div className="position-absolute" style={{ top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(135deg, rgba(0,0,0,0) 60%, rgba(255,122,0,0.4) 100%)" }}></div>
															</div>
															<div className="py-5 px-4 px-md-5" style={{ width: "fit-content" }}>
																<h4 className="text-gray-900 dark:text-white mb-3">{t('car.howitworks.step1Title')}</h4>
																<p className="mb-4 text-gray-900 dark:text-gray-200">
																	{t('car.howitworks.step1Desc1')}
																</p>

																<div className="mt-4 position-relative">
																	<div className="rounded-circle d-flex align-items-center justify-content-center"
																		style={{
																			width: "60px",
																			height: "60px",
																			backgroundColor: "#FF7A00",
																			boxShadow: "0 0 20px rgba(255, 122, 0, 0.3)"
																		}}>
																		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
																			<polygon points="6 3 20 12 6 21 6 3"></polygon>
																		</svg>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className="carousel-item p-4">
													<div className="position-relative">
														<div className="d-flex">


															<div className="position-relative" style={{ width: "fit-content", clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", overflow: "hidden" }}>
																<div style={{ height: "fit-content" }}>
																	<img src="/4.jpg" className="w-100 h-100" alt="Customer warranty" style={{ objectFit: "cover", objectPosition: "center" }} />
																</div>
																<div className="position-absolute" style={{ top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(135deg, rgba(0,0,0,0) 60%, rgba(255,122,0,0.4) 100%)" }}></div>
															</div>
															<div className="py-5 px-4 px-md-5" style={{ width: "fit-content" }} color='black'>
																<h4 className="text-gray-900 dark:text-white mb-3">We stand by the guarantee!</h4>
																<p className="mb-4 text-gray-900 dark:text-white">
																	{t('car.howitworks.step2Desc1')}
																</p>

															</div>
														</div>
													</div>
												</div>
												<div className="carousel-item bg-gray-50 dark:bg-black p-4">
													<div className="position-relative">
														<div className="d-flex">
															<div className="position-relative mb-3 mb-md-0" style={{ width: "fit-content", maxWidth: "350px", clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", overflow: "hidden" }}>
																<div style={{ height: "fit-content" }}>
																	<img src="/order.jpg" className="w-100 h-100" alt="Delivery truck" style={{ objectFit: "cover", objectPosition: "center" }} />
																</div>
																<div className="position-absolute" style={{ top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(135deg, rgba(0,0,0,0) 60%, rgba(255,122,0,0.4) 100%)" }}></div>
															</div>
															<div className="py-5 px-4 px-md-5" style={{ width: "fit-content" }} color='black'>

																<h4 className="text-gray-900 dark:text-white mb-3">{t('car.howitworks.step3Title')}</h4>
																<p className="mb-4 text-gray-900 dark:text-white">
																	{t('car.howitworks.step3Desc1')}
																</p>
																<p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-white">
																	{t('car.howitworks.step3Desc2')}
																</p>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="position-relative border-top py-3 dark:border-gray-700">
												<div className="container-fluid px-4">
													<div className="d-flex justify-content-between align-items-center">
														<div className="d-flex align-items-center">
															<div className="d-flex">
																{[1, 2, 3].map((step, index) => (
																	<button
																		key={step}
																		type="button"
																		data-bs-target="#howItWorksCarousel"
																		data-bs-slide-to={index}
																		className={`position-relative mx-2`}
																		style={{
																			width: '12px',
																			height: '12px',
																			borderRadius: '50%',
																			border: 'none',
																			padding: 0,
																			backgroundColor: '#F5F5F5',
																			opacity: activeStep === step ? 1 : 0.5,
																			transition: 'all 0.2s ease'
																		}}
																		aria-label={`Go to slide ${index}`}
																	></button>
																))}
															</div>
															<div className="ms-4 text-gray-500 dark:text-gray-400">
																{activeStep} / 3
															</div>
														</div>
														<div className="d-flex">
															<button
																className="btn btn-sm me-2 d-flex align-items-center justify-content-center shadow"
																style={{
																	width: '40px',
																	height: '40px',
																	backgroundColor: '#f5f5f5',
																	color: 'black',
																	borderRadius: '20%',
																	fontSize: '15px',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center'
																}}
																type="button"
																data-bs-target="#howItWorksCarousel"
																data-bs-slide="prev"
															>
																<p><IoIosArrowBack style={{ fontWeight: 'bold' }} /></p>
															</button>
															<button
																className="btn btn-sm d-flex align-items-center justify-content-center shadow"
																style={{
																	width: '40px',
																	height: '40px',
																	backgroundColor: '#f5f5f5',
																	color: 'black',
																	borderRadius: '20%',
																	fontSize: '15px',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center'
																}}
																type="button"
																data-bs-target="#howItWorksCarousel"
																data-bs-slide="next"
															>
																<p><IoIosArrowForward style={{ fontWeight: 'bold' }} /></p>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div id="price-map" className="mt-5 pt-3">
									<h2 className="mb-4 text-gray-900">{t('car.pricemap.title')}</h2>
									<div className="card border-0 rounded-4 overflow-hidden mb-4">
										<div className="card-body p-4 bg-white">
											<div className="d-flex justify-content-between align-items-center mb-3 bg-white">
												<h5 className="mb-0 fs-6 text-black">{t('car.pricemap.priceVsMileage')}</h5>
												<div className="d-flex gap-3 align-items-center">
													<div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#FF7A00' }}></div>
														<span className="small text-black">{t('car.pricemap.thisVehicle')}</span>
													</div>
													<div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#3B66FF' }}></div>
														<span className="small text-black">{t('car.pricemap.similarModels')}</span>
													</div>
													{/* <div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#BBC5D5' }}></div>
														<span className="small text-black">Market average</span>
													</div> */}
												</div>
											</div>

											<div className="price-map-chart rounded-3 p-3" style={{ backgroundColor, height: '250px' }}>

												{/* Enhanced price map chart */}
												<div className="position-relative h-100">
													{/* Y-axis (prices) */}
													<div className="position-absolute start-0 h-100 d-flex flex-column justify-content-between" style={{ width: '60px' }}>
														{yTicks.map((price, i) => (
															<div key={i} className="text-muted small" style={{ color: axisLabelColor }}>
																€{price.toLocaleString()}
															</div>
														))}
													</div>

													{/* X-axis (mileages) */}
													<div className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-between ">
														{xTicks.map((mileage, i) => (
															<div key={i} className="text-muted small" style={{ color: axisLabelColor }}>
																{mileage.toLocaleString()} km
															</div>
														))}
													</div>

													{/* Chart with grid lines and dots */}
													<div className="position-absolute top-0 start-0 w-100 h-100 ">
														{/* Horizontal grid lines */}
														{[0, 25, 50, 75, 100].map((pos) => (
															<div key={pos} className="position-absolute w-100 border-top border-gray-200" style={{ top: `${pos}%`, opacity: 0.3 }}></div>
														))}

														{/* Vertical grid lines */}
														{[0, 25, 50, 75, 100].map((pos) => (
															<div key={`v-${pos}`} className="position-absolute h-100 border-start border-gray-200" style={{ left: `${pos}%`, opacity: 0.3 }}></div>
														))}

														{/* Similar cars dots */}
														{similarCars?.map((car: any, idx: number) => (
															<div
																key={car.id}
																className="position-absolute"
																style={{
																	top: `${getY(car.price)}%`,
																	left: `${getX(car.mileage)}%`
																}}
															>
																<div
																	className="rounded-circle"
																	style={{
																		width: '14px',
																		height: '14px',
																		backgroundColor: '#3B66FF',
																		boxShadow: '0 0 0 3px rgba(59, 102, 255, 0.2)',
																		cursor: 'pointer',
																		transform: 'translate(-50%, -50%)'
																	}}
																	data-bs-toggle="tooltip"
																	data-bs-placement="top"
																	title={`${car.brand} ${car.model}: €${car.price.toLocaleString()} | ${car.mileage.toLocaleString()} km`}
																></div>
															</div>
														))}

														{/* Current car dot */}
														{carData && (
															<div
																className="position-absolute"
																style={{
																	top: `${getY(carData.price)}%`,
																	left: `${getX(carData.mileage)}%`
																}}
															>
																<div
																	className="rounded-circle position-relative"
																	style={{
																		width: '16px',
																		height: '16px',
																		backgroundColor: '#FF7A00',
																		boxShadow: '0 0 0 4px rgba(255, 122, 0, 0.2)',
																		cursor: 'pointer'
																	}}
																	data-bs-toggle="tooltip"
																	data-bs-placement="top"
																	title={`This car: €${carData.price.toLocaleString()} | ${carData.mileage.toLocaleString()} km`}
																></div>
															</div>
														)}
													</div>
												</div>
											</div>

											<div className="d-flex justify-content-between align-items-center mt-3 px-3">
												{segmentPrices.map((price, index) => (
													<div key={index} className="text-muted">€{price}</div>
												))}
											</div>
										</div>
									</div>

									<div className="row g-4">
										<div className="col-md-6">
											<div className="card border-0 rounded-4 h-100">
												<div className="position-relative ">
													<img src={carData?.images[0]} className="card-img-top rounded-top-4" alt={carData?.brand} style={{ height: '200px', objectFit: 'cover' }} />
													<div className="position-absolute top-0 start-0 m-3">
														<span className="badge bg-primary text-white px-3 py-2">THIS CAR</span>
													</div>
												</div>
												<div className="card-body p-4">
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
													>{carData?.[0]?.model } {carData?.power ? ` ${(carData?.power * 0.7355).toFixed(0)} kW` : ''}</Heading>
													<Box mb={["2", "2", "1"]} ml="1" mt={4}>
														<Flex direction="row" gap={3} mb={1}>
															<HStack spacing="1">
																<LucideIcon icon={Power} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor}>{carData?.power} hp</Text>
															</HStack>
															<HStack spacing="1">
																<LucideIcon icon={Calendar} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor}>{carData?.year}</Text>
															</HStack>
															<HStack spacing="1">
																<LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor}>{carData?.mileage} km</Text>
															</HStack>
														</Flex>
														<Flex direction="row" gap={6}>
															<HStack spacing="1">
																<LucideIcon icon={Gauge} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor} fontWeight="semibold">{carData?.gear}</Text>
															</HStack>
															<HStack spacing="1">
																<LucideIcon icon={Fuel} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor} fontWeight="semibold">{carData?.fuel}</Text>
															</HStack>
														</Flex>
													</Box>


													<Flex direction="row" justify="space-between" alignItems="flex-start" align="flex-start" w="100%">
														<VStack display="flex" alignItems="center" justifyContent="center" gap="1" mt="3" ml="0">
															<HStack spacing="1" >
																{[...Array(5)].map((_, i) => (
																	<Box key={i} w="7px" h="7px" borderRadius="full" bg="#64E364" />
																))}
																<Text fontSize="sm" color={textColor} fontWeight="semibold" mb="0">
																	{t('cars.veryGoodPrice')}
																</Text>
															</HStack>

														</VStack>
														<Box borderRadius="md" textAlign="right" mt={["2", "1", "3"]}>
															<Text fontSize={["xl", "xl", "2xl"]} fontWeight="bold" color={priceColor}>
																€ {carData?.price.toLocaleString()}
															</Text>
															<Text fontSize="xs" color={textColor}>
																€{(carData?.price / 4).toFixed(2)} {t('cars.withoutVAT')}
															</Text>
														</Box>
													</Flex>

													<h6 className="mt-4 mb-3">{t('car.pricemap.equipment')}</h6>
													<Flex wrap="wrap" gap={["2", "2", "1.5"]} mt="0" mb={["4", "4", "0"]} ml="1">
														{carData?.features &&
															Object.entries(carData?.features)
																.flatMap(([category, features]) => (Array.isArray(features) ? features : []))
																.slice(0, 4)
																.map((feature, index) => (
																	<span key={`feature-${index}`} className="badge bg-light text-primary px-3 py-2">
																		{feature}
																	</span>
																))}
														{/* {carData?.features && Object.entries(carData?.features)
															.flatMap(([category, features]) => (Array.isArray(features) ? features : []))
															.length > 4 && (
																<Button
																	variant="unstyled"
																	color={buttonLinkColor}
																	fontSize="sm"
																	fontWeight="medium"
																	height="auto"
																	padding="0"
																	lineHeight="1.5"
																	_hover={{ textDecoration: "underline" }}
																	onClick={(e) => e.preventDefault()}
																	style={{ textTransform: "none" }}
																>
																	+ {Object.entries(carData?.features)
																		.flatMap(([category, features]) => (Array.isArray(features) ? features : []))
																		.length - 4} more
																</Button>
															)} */}
													</Flex>
												</div>
											</div>
										</div>

										<div className="col-md-6">
											<div className="card border-0 rounded-4 h-100">
												<div className="position-relative">
													<img src={similarCars?.[0]?.image} className="card-img-top rounded-top-4" alt={similarCars?.[0]?.name || "Similar Car"} style={{ height: '200px', objectFit: 'cover' }} />
													<div className="position-absolute top-0 start-0 m-3">
														<span className="badge bg-warning text-dark px-3 py-2">{t('car.pricemap.comparedTo')}</span>
													</div>
												</div>
												<div className="card-body p-4">
													<Heading
														as="h3"
														ml='1'
														fontSize={["lg", "lg", "xl"]}
														fontWeight="bold"
														color={headingColor}
														letterSpacing="wide"
														fontFamily="inter"
														_hover={{ color: "red.500" }}
													>{similarCars?.[0]?.brand} {similarCars?.[0]?.model || "Loading..."} {similarCars?.power ? ` ${(similarCars?.power * 0.7355).toFixed(0)} kW` : ''}KW</Heading>
													<Box mb={["2", "2", "1"]} ml="1" mt={4}>
														<Flex direction="row" gap={3} mb={1}>
															<HStack spacing="1">
																<LucideIcon icon={Power} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor}>{similarCars?.[0]?.power} hp</Text>
															</HStack>
															<HStack spacing="1">
																<LucideIcon icon={Calendar} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor}>{similarCars?.[0]?.year}</Text>
															</HStack>
															<HStack spacing="1">
																<LucideIcon icon={ParkingMeterIcon} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor}>{similarCars?.[0]?.mileage}</Text>
															</HStack>
														</Flex>
														<Flex direction="row" gap={6}>
															<HStack spacing="1">
																<LucideIcon icon={Gauge} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor} fontWeight="semibold">{similarCars?.[0]?.gear || "N/A"}</Text>
															</HStack>
															<HStack spacing="1">
																<LucideIcon icon={Fuel} boxSize="4" color={textColor} />
																<Text fontSize="sm" color={textColor} fontWeight="semibold">{similarCars?.[0]?.fuel || "N/A"}</Text>
															</HStack>
														</Flex>
													</Box>

													<Flex direction="row" justify="space-between" alignItems="flex-start" align="flex-start" w="100%">
														<VStack display="flex" alignItems="center" justifyContent="center" gap="1" mt="3" ml="0">
															<HStack spacing="1" >
																{[...Array(5)].map((_, i) => (
																	<Box key={i} w="7px" h="7px" borderRadius="full" bg="#64E364" />
																))}
																<Text fontSize="sm" color={textColor} fontWeight="semibold" mb="0">
																	{t('cars.veryGoodPrice')}
																</Text>
															</HStack>
														</VStack>
														<Box borderRadius="md" textAlign="right" mt={["2", "1", "3"]}>
															<Text fontSize={["xl", "xl", "2xl"]} fontWeight="bold" color={priceColor}>
																€ {similarCars?.[0]?.price?.toLocaleString() || "N/A"}
															</Text>
															<Text fontSize="xs" color={textColor}>
																€{(similarCars?.[0]?.price ? (similarCars[0].price / 4).toFixed(2) : "N/A")} {t('cars.	withoutVAT')}
															</Text>
														</Box>
													</Flex>

													<h6 className="mt-4 mb-3">{t('car.pricemap.equipment')}</h6>
													<div className="d-flex flex-wrap gap-2">
														{similarCars?.[0]?.features && Object.entries(similarCars[0].features as Record<string, string[]>).map(([category, features]) => (
															features.map((feature: string, index: number) => (
																<span key={`${category}-${index}`} className="badge bg-light text-primary px-3 py-2">
																	{feature}
																</span>
															))
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div id="comparison" className="mt-5 pt-3">
									<h2 className="mb-4 ">{t('car.comparisonPage.title')}</h2>
									<div className="card border-0 rounded-4 overflow-hidden mb-4">
										<div className="card-body p-4">
											<div className="text-center mb-4">
												<p className="mb-2 fs-6">{t('car.comparisonPage.desc')}</p>


												<div className="position-relative mt-5 pt-4">
													<div className="position-relative" style={{ maxWidth: '550px', margin: '0 auto' }}>
														{/* Price marker */}
														<div style={{ position: 'relative', width: '100%' }}>
															{/* Marker */}
															<div
																className="text-white text-center p-3 rounded-3 mb-5 position-absolute comparison-price-box"
																style={{
																	width: '200px',
																	backgroundColor: '#E53E3E',
																	left: markerLeft,

																	top: '-110px', // moved further up
																	transform: 'translateX(-50%)',
																	zIndex: 2,
																	marginBottom: '50px',
																	marginTop: "20px"
																}}
															>
																<div className="mb-1 fw-bold">THIS CAR</div>
																<div className="fs-4 fw-bold">€{carPrice?.toLocaleString('en-US')}</div>
																<div className="position-absolute start-50 translate-middle-x" style={{ bottom: '-12px' }}>
																	<div style={{ width: '0', height: '0', borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid #E53E3E' }}></div>
																</div>
															</div>
															{/* Price bar */}
															<div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden', position: 'relative', zIndex: 1, marginTop: '70px' }}>
																<div style={{ width: '20%', backgroundColor: '#64C359' }}></div>
																<div style={{ width: '20%', backgroundColor: '#8BD980' }}></div>
																<div style={{ width: '20%', backgroundColor: '#FFD25F' }}></div>
																<div style={{ width: '20%', backgroundColor: '#FFC107' }}></div>
																<div style={{ width: '20%', backgroundColor: '#FF8A00' }}></div>
															</div>
															{/* Price labels below each segment */}
															<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
																{segmentPrices.map((price, i) => (
																	<div
																		key={i}
																		style={{
																			width: '20%',
																			textAlign: i === 0 ? 'left' : i === 5 ? 'right' : 'center',
																			color: '#bbb',
																			fontWeight: 600,
																		}}
																	>
																		€{Math.round(price).toLocaleString('en-US')}
																	</div>
																))}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div id="financing" className="mt-5 pt-3">
									<h2 className="mb-4">{t('car.financing')}</h2>
									<div className="card border-0 rounded-4 overflow-hidden mb-4">
										<div className="card-body p-4">


											<div className="mt-4">
												<FinancingSpecs
													onFinancingRequest={() => console.log('Financing requested')}
													onFullPayment={() => console.log('Full payment selected')}
													onToggleSpecs={(isExpanded) => console.log('Specs toggled:', isExpanded)}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-4">
								<div className="sidebar-banner mb-4 d-none d-md-block" style={{
									position: 'sticky',
									top: '20px',
									zIndex: 100,
									backgroundColor: 'white',
									// boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
								}}>
									<div className="p-4 background-body  rounded-3">
										<div className="bg-light-green rounded-2 py-2 px-3 mb-3 d-flex align-items-center">
											<div className="me-2">
												<span className="d-inline-block me-1 rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#64E364" }}></span>
												<span className="d-inline-block me-1 rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#64E364" }}></span>
												<span className="d-inline-Fblock me-1 rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#64E364" }}></span>
												<span className="d-inline-block me-1 rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#64E364" }}></span>
												<span className="d-inline-block rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#E9FAE3" }}></span>
											</div>
											<p className="text-success m-0 fw-semibold">{t('car.sideBar.vgoodprice')}</p>
										</div>

										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="text-lg-bold neutral-1000 m-0">{t('car.sideBar.price')}</h6>
											<p className="text-xl-bold m-0 fs-3">€{charges?.car_price}</p>
										</div>
										<div className="d-flex justify-content-between align-items-center mb-4">
											<p className="text-md-medium text-muted m-0">{t('car.sideBar.priceWithoutVAT')}</p>
											<p className="text-md-medium text-muted m-0">€{charges?.price_without_vat}</p>
										</div>

										<Button onClick={handleBuyNow} bg="#E53E3E" color="white" size="lg" w="100%" className="btn w-100 rounded-3 py-3 mb-3 d-flex align-items-center justify-content-center">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
												<path d="M7.5 21.75C8.32843 21.75 9 21.0784 9 20.25C9 19.4216 8.32843 18.75 7.5 18.75C6.67157 18.75 6 19.4216 6 20.25C6 21.0784 6.67157 21.75 7.5 21.75Z" fill="currentColor" />
												<path d="M17.25 21.75C18.0784 21.75 18.75 21.0784 18.75 20.25C18.75 19.4216 18.0784 18.75 17.25 18.75C16.4216 18.75 15.75 19.4216 15.75 20.25C15.75 21.0784 16.4216 21.75 17.25 21.75Z" fill="currentColor" />
												<path d="M3.96562 6.75H20.7844L18.3094 15.4125C18.2211 15.7269 18.032 16.0036 17.7711 16.2C17.5103 16.3965 17.1922 16.5019 16.8656 16.5H7.88437C7.55783 16.5019 7.2397 16.3965 6.97886 16.2C6.71803 16.0036 6.52893 15.7269 6.44062 15.4125L3.04688 3.54375C3.00203 3.38696 2.9073 3.24905 2.77704 3.15093C2.64677 3.05282 2.48808 2.99983 2.325 3H0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											{t('car.sideBar.buynow')}
										</Button>

										<Link href="#" className="btn w-100 rounded-3 py-3 d-flex align-items-center justify-content-center mb-4" style={{ background: "#F0F0FF", color: "#E53E3E", border: "1px solid #E2E2E2" }}>
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
												<path d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M16.5 7.5C15.6716 7.5 15 8.17157 15 9C15 9.82843 15.6716 10.5 16.5 10.5C17.3284 10.5 18 9.82843 18 9C18 8.17157 17.3284 7.5 16.5 7.5Z" fill="currentColor" />
												<path d="M8.25 12L5.25 15.75H18.75L14.25 9.75L11.25 13.5L8.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											{t('car.sideBar.financing')} €327/mo
										</Link>

										<div className="d-flex justify-content-between align-items-center mb-3">
											<h6 className="m-0 d-flex align-items-center">
												{t('car.sideBar.servicesTotal')}
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2">
													<path d="M8 10.6667L4 6.66675H12L8 10.6667Z" fill="currentColor" />
												</svg>
											</h6>
											<p className="text-md-bold m-0">€{charges?.services_total}</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0">{t('car.sideBar.carInspection')}</p>
											<p className="text-md-medium m-0">€{charges?.car_inspection}</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2 border-bottom">
											<p className="text-md-medium m-0 d-flex align-items-center">
												{t('car.sideBar.delivery')}
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 text-primary">
													<path d="M12.6667 6.00008H10.6667V2.66675H12L12.6667 6.00008ZM12.6667 6.00008H3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M11.9999 10H12.6666C13.0348 10 13.3333 9.70152 13.3333 9.33333V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M3.99992 13.3333C4.73626 13.3333 5.33325 12.7363 5.33325 12C5.33325 11.2636 4.73626 10.6666 3.99992 10.6666C3.26359 10.6666 2.66659 11.2636 2.66659 12C2.66659 12.7363 3.26359 13.3333 3.99992 13.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M11.9999 13.3333C12.7363 13.3333 13.3333 12.7363 13.3333 12C13.3333 11.2636 12.7363 10.6666 11.9999 10.6666C11.2636 10.6666 10.6666 11.2636 10.6666 12C10.6666 12.7363 11.2636 13.3333 11.9999 13.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M10.6667 12H5.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M2.66659 12H1.99992V4.66667C1.99992 4.29848 2.29841 4 2.66659 4H10.6666V9.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</p>
											<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
												<input
													type="text"
													value={zipcode}
													onChange={e => setZipcode(e.target.value)}
													placeholder={t('car.sideBar.enterZipcode')}
													style={{ width: 100, marginRight: 8, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', height: '38px' }}
												/>
												<button
													className="btn btn-primary btn-sm"
													style={{ padding: '2px 12px' }}
													onClick={() => setSubmittedZip(zipcode)}
													disabled={!zipcode || isChargesLoading}
												>
													{isChargesLoading ? t('car.sideBar.loading') : t('car.sideBar.check')}
												</button>
											</div>
										</div>
										{submittedZip && (
											<div style={{ marginTop: 8 }}>
												{isChargesLoading && <span>Loading charges...</span>}
												{charges && (
													<div className="d-flex justify-content-between align-items-center py-2">
														<p className="text-md-medium m-0">{t('car.sideBar.delivery')}</p>

														<p className="text-md-medium m-0">€{charges?.delivery}</p>
													</div>
												)}
											</div>
										)}

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0 d-flex align-items-center">
												{t('car.sideBar.registrationTax')}
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 text-muted">
													<path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</p>
											<p className="text-md-medium m-0">€{charges?.registration_tax}</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0 d-flex align-items-center">
												{t('car.sideBar.preDeliveryPrep')}
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 text-muted">
													<path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</p>
											<p className="text-md-medium m-0">€{charges?.pre_delivery_prep}</p>
										</div>


										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0 d-flex align-items-center">
												{t('car.sideBar.10litresfuel')}
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 text-muted">
													<path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</p>
											<p className="text-md-medium m-0 px-3 py-1 bg-success text-white rounded-3">Free</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0">{t('car.sideBar.extendedWarranty')}</p>
											<p className="text-md-medium m-0 px-3 py-1 bg-success text-white rounded-3">Free</p>
										</div>
										<Box borderTop="1px" borderColor={borderColor} p={2}>
											<Flex justify="space-between" align="center">
												<Text fontSize="md" fontWeight="medium" color={darkGrayTextColor}>
													{t('car.sideBar.totalPrice')}
												</Text>
												<Text fontSize="2xl" fontWeight="bold" color={redTextColor}>
													EUR {charges?.total_price}
												</Text>
											</Flex>
										</Box>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="background-100 pt-55 pb-55 mt-100">
					<div className="container">
						<Marquee direction='left' pauseOnHover={true} className="carouselTicker carouselTicker-left box-list-brand-car justify-content-center wow fadeIn">
							<ul className="carouselTicker__list">
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/lexus.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/lexus-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/mer.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/mer-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/bugatti.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/bugatti-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/jaguar.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/jaguar-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/honda.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/honda-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/chevrolet.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/chevrolet-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/acura.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/acura-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/bmw.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/bmw-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/toyota.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/toyota-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/lexus.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/lexus-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/mer.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/mer-w.png" alt="Fast4Car" />
									</div>
								</li>
								<li className="carouselTicker__item">
									<div className="item-brand">
										<img className="light-mode" src="/assets/imgs/page/homepage2/bugatti.png" alt="Fast4Car" />
										<img className="dark-mode" src="/assets/imgs/page/homepage2/bugatti-w.png" alt="Fast4Car" />
									</div>
								</li>
							</ul>
						</Marquee>
					</div>
				</section>
				<ModalVideo
					channel='youtube'
					isOpen={isOpen}
					videoId="JXMWOmuR1hU"
					onClose={() => setOpen(false)}
				/>

				{/* Mobile Buy Car Footer */}
				<Box
					position="fixed"
					bottom={0}
					left={0}
					right={0}
					zIndex={999}
					display={{ base: 'block', md: 'none' }}
				>
					{/* Floating Buy Car Bar with Arrow */}
					<Box
						bg={useColorModeValue("white", "gray.800")}
						borderTop="1px"
						borderColor={useColorModeValue("gray.200", "gray.700")}
						p={4}
						boxShadow={useColorModeValue("0 -4px 6px -1px rgba(0, 0, 0, 0.05)", "0 -4px 6px -1px rgba(0, 0, 0, 0.3)")}
						position="relative"
					>
						{/* Arrow Tab */}
						<Flex justify="center" position="absolute" top={-18} left={0} right={0} zIndex={2}>
							<IconButton
								aria-label="Show details"
								icon={<Icon as={ChevronUp} boxSize={6} />}
								borderRadius="full"
								bg={useColorModeValue('white', 'gray.700')}
								// boxShadow="md"
								onClick={() => setDrawerOpen(true)}
								size="lg"
							// border="1px solid #E2E8F0"
							/>
						</Flex>
						<Box pt={3} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
							<div>
								<Text fontWeight="bold" fontSize="xl" color={useColorModeValue('gray.800', 'white')}>
									€28,149 <Text as="span" fontWeight="normal" fontSize="lg" color={useColorModeValue('gray.700', 'gray.300')}>+ services</Text>
								</Text>
								<Text as="a" href="#" color="red" fontWeight="bold" fontSize="md" mt={2} display="block" textDecoration="underline">
									€406/mo
								</Text>
							</div>
							<div>
								<Button onClick={handleBuyNow} bg="red.500" color="white" size="lg" w="100%" >
									{t('car.sideBar.buynow')}
								</Button>
							</div>
						</Box>

					</Box>
					<MobileBuyCarDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
				</Box>
			</div>
		</Layout>
	)
}