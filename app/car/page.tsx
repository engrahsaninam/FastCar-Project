'use client'
import MyDatePicker from '@/components/elements/MyDatePicker'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import Marquee from 'react-fast-marquee'
import ModalVideo from 'react-modal-video'
import Slider from "react-slick"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useColorModeValue } from "@chakra-ui/react"
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
import { ChevronUp, X, ArrowRight, Calendar, Clock, Info, Gauge, Fuel } from "lucide-react"

import FinancingSpecs from '@/components/checkout/PaymentMethod/FinancingSpecs'
const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: any) => (
	<button
		{...props}
		className={
			"slick-prev slick-arrow" +
			(currentSlide === 0 ? " slick-disabled" : "")
		}
		type="button"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" stroke="" strokeLinecap="round" strokeLinejoin="round"></path></svg>
	</button>
)
const SlickArrowRight = ({ currentSlide, slideCount, ...props }: any) => (
	<button
		{...props}
		className={
			"slick-next slick-arrow" +
			(currentSlide === slideCount - 1 ? " slick-disabled" : "")
		}
		type="button"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33301 7.99992" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	</button>
)
export default function CarsDetails1() {
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
			const scrollPosition = window.scrollY + 200;

			// Find all sections
			const sections = ['details', 'features', 'how-it-works', 'price-map', 'comparison', 'financing'];

			// Find the current visible section
			for (let i = sections.length - 1; i >= 0; i--) {
				const section = document.getElementById(sections[i]);
				if (section && section.offsetTop <= scrollPosition) {
					setActiveTab(sections[i]);
					break;
				}
			}
		};

		// Initialize carousel indicators and counter
		const currentSlideSpan = document.getElementById('current-slide');
		const indicators = document.querySelectorAll('.carousel-indicators button');
		const prevButton = document.querySelector('[data-bs-target="#howItWorksCarousel"][data-bs-slide="prev"]') as HTMLElement | null;
		const nextButton = document.querySelector('[data-bs-target="#howItWorksCarousel"][data-bs-slide="next"]') as HTMLElement | null;

		// Function to update indicators
		const updateIndicators = (slideIndex: number) => {
			// Update the current slide number in the counter
			if (currentSlideSpan) {
				currentSlideSpan.textContent = (slideIndex + 1).toString();
			}

			// Update indicator styling
			indicators.forEach((indicator, i) => {
				if (i === slideIndex) {
					indicator.classList.remove('bg-secondary');
					indicator.classList.add('bg-primary', 'active');
				} else {
					indicator.classList.remove('bg-primary', 'active');
					indicator.classList.add('bg-secondary');
				}
			});
		};

		// Event handler for carousel slide change
		const handleSlideChange = (e: Event) => {
			const slideEvent = e as unknown as { to: number };
			updateIndicators(slideEvent.to);
		};

		// Touch event handlers for mobile swipe
		let touchStartX = 0;
		let touchEndX = 0;

		const handleTouchStart = (e: TouchEvent) => {
			touchStartX = e.changedTouches[0].screenX;
		};

		const handleTouchEnd = (e: TouchEvent) => {
			touchEndX = e.changedTouches[0].screenX;

			// Handle swipe
			const swipeThreshold = 50;
			if (touchEndX < touchStartX - swipeThreshold) {
				// Swipe left - next slide
				if (nextButton) nextButton.click();
			} else if (touchEndX > touchStartX + swipeThreshold) {
				// Swipe right - previous slide
				if (prevButton) prevButton.click();
			}
		};

		// Add event listeners
		window.addEventListener('scroll', handleScroll);

		if (carousel) {
			carousel.addEventListener('slide.bs.carousel', handleSlideChange);
			carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
			carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

			// Initialize with first slide
			updateIndicators(0);
		}

		// Clean up event listeners
		return () => {
			navLinks.forEach(link => {
				link.removeEventListener('click', () => { });
			});
			window.removeEventListener('scroll', handleScroll);

			if (carousel) {
				carousel.removeEventListener('slide.bs.carousel', handleSlideChange);
				carousel.removeEventListener('touchstart', handleTouchStart);
				carousel.removeEventListener('touchend', handleTouchEnd);
			}
		};
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

	// Custom mobile drawer component for Buy Car
	const MobileBuyCarDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
		const bgColor = useColorModeValue("white", "gray.800")
		const borderColor = useColorModeValue("gray.200", "gray.700")
		const overlayBg = useColorModeValue("blackAlpha.600", "blackAlpha.800")
		const textColor = useColorModeValue("gray.900", "white")
		const mutedTextColor = useColorModeValue("gray.600", "gray.400")
		const redColor = useColorModeValue("red.500", "red.400")
		const greenBg = useColorModeValue("green.50", "green.900")
		const greenText = useColorModeValue("green.600", "green.300")
		const includedBg = useColorModeValue("green.100", "green.800")
		const includedText = useColorModeValue("green.700", "green.200")
		const sectionBorder = useColorModeValue("gray.100", "gray.700")
		const highlightBg = useColorModeValue("red.50", "red.900")
		const highlightBorder = useColorModeValue("red.200", "red.700")
		const highlightText = useColorModeValue("red.600", "red.300")

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
						<Text fontSize="lg" fontWeight="semibold" color={textColor}>Toyota C-HR 2.0 Hybrid 135 kW</Text>
						<IconButton
							variant="ghost"
							icon={<Icon as={X} w={5} h={5} />}
							onClick={onClose}
							aria-label="Close drawer"
						/>
					</Flex>

					<Box p={0} overflowY="auto" maxHeight="calc(90vh - 100px)" pb="80px">
						{/* Price Card */}
						<Box bgGradient="linear(to-br, red.500, red.600, red.700)" borderRadius="xl" p={5} mx={3} mt={3} mb={4} color="white" textAlign="left">
							<Text fontSize="sm" opacity={0.9}>PRICE INCL SERVICES</Text>
							<Text fontSize="3xl" fontWeight="bold" mt={1}>24 999 €</Text>
							<Text fontSize="sm" opacity={0.8} mt={1}>20 491 € without VAT</Text>
						</Box>

						{/* Vehicle details */}
						<Box px={4}>
							<Text fontWeight="semibold" color={textColor} mb={2}>Vehicle details</Text>
							<Flex justify="space-between" align="center" mb={1}>
								<Flex align="center" gap={2}><Icon as={Calendar} w={4} h={4} />First registration</Flex>
								<Text>12/2020</Text>
							</Flex>
							<Flex justify="space-between" align="center" mb={2}>
								<Flex align="center" gap={2}><Icon as={Gauge} w={4} h={4} />Mileage</Flex>
								<Text>46,042 km</Text>
							</Flex>
							<Badge bg={greenBg} color={greenText} px={3} py={2} borderRadius="md" fontWeight="bold" mb={3}>VERY GOOD PRICE</Badge>
						</Box>

						{/* Included in price */}
						<Box px={4} pt={2} pb={2} borderTop="1px" borderColor={sectionBorder}>
							<Text fontWeight="semibold" color={textColor} mb={2}>Included in price</Text>
							<Flex justify="space-between" align="center" mb={1}>
								<Text>Car inspection</Text>
								<Badge bg={includedBg} color={includedText} px={3} py={1} borderRadius="md">INCLUDED</Badge>
							</Flex>
							<Flex justify="space-between" align="center" mb={1}>
								<Text>6-month warranty</Text>
								<Badge bg={includedBg} color={includedText} px={3} py={1} borderRadius="md">INCLUDED</Badge>
							</Flex>
							<Flex justify="space-between" align="center" mb={2}>
								<Text>Full service check</Text>
								<Badge bg={includedBg} color={includedText} px={3} py={1} borderRadius="md">INCLUDED</Badge>
							</Flex>
						</Box>

						{/* Payment options */}
						<Box px={4} pt={2} pb={4} borderTop="1px" borderColor={sectionBorder}>
							<Text fontWeight="semibold" color={textColor} mb={2}>Payment options</Text>
							<VStack spacing={3} align="stretch">
								<Flex align="center" justify="space-between" p={3} borderRadius="lg" borderWidth="1px" borderColor={highlightBorder} bg={highlightBg} cursor="pointer">
									<Box>
										<Text color={highlightText} fontWeight="bold">Financing</Text>
										<Text color={highlightText} fontSize="sm">From 199€/month</Text>
									</Box>
									<Icon as={ArrowRight} color={highlightText} w={5} h={5} />
								</Flex>
								<Flex align="center" justify="space-between" p={3} borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={bgColor}>
									<Box>
										<Text color={textColor} fontWeight="bold">Cash payment</Text>
										<Text color={mutedTextColor} fontSize="sm">Pay online or at dealership</Text>
									</Box>
								</Flex>
							</VStack>
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
						<Link href="/checkout" passHref legacyBehavior>
							<Button as="a" colorScheme="red" size="lg" w="100%">
								Buy for 24 999 €
							</Button>
						</Link>
					</Box>
				</Box>
			</>
		);
	};

	return (
		<Layout footerStyle={1}>
			<div>
				<section className="box-section box-breadcrumb background-body">
					<div className="container">
						<ul className="breadcrumbs">
							{/* <li>
								<Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="dark:text-white">
										<path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
									</svg>
									Back to search
								</Link>
							</li>
							<li>
								<Link href="/cars">Cars</Link>
								<span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</span>
							</li> */}
							<li><span className="text-breadcrumb " style={{ fontSize: "2rem" }}>Hyundai Accent 2025</span></li>
						</ul>
					</div>
				</section>
				<section className="section-box box-banner-home2 background-body">
					<div className="container">
						<div className="row">
							<div className="col-lg-8">
								<div className="container-banner-activities">
									<div className="box-banner-activities">
										<Slider
											{...settingsMain}
											asNavFor={nav2 as any}
											ref={(slider) => setSlider1(slider as any)}
											className="banner-activities-detail">
											<div className="banner-slide-activity">
												<img src="/assets/imgs/cars-details/banner.png" alt="Fast4Car" className="w-100" />
											</div>
											<div className="banner-slide-activity">
												<img src="/assets/imgs/cars-details/banner2.png" alt="Fast4Car" className="w-100" />
											</div>
											<div className="banner-slide-activity">
												<img src="/assets/imgs/cars-details/banner3.png" alt="Fast4Car" className="w-100" />
											</div>
											<div className="banner-slide-activity">
												<img src="/assets/imgs/cars-details/banner4.png" alt="Fast4Car" className="w-100" />
											</div>
											<div className="banner-slide-activity">
												<img src="/assets/imgs/cars-details/banner5.png" alt="Fast4Car" className="w-100" />
											</div>
										</Slider>
										<div className="box-button-abs">
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
										</div>
									</div>
									<div className="slider-thumnail-activities">
										<Slider
											{...settingsThumbs}
											asNavFor={nav1 as any}
											ref={(slider) => setSlider2(slider as any)}
											className="slider-nav-thumbnails-activities-detail">
											<div className="banner-slide"><img src="/assets/imgs/page/car/banner-thumn.png" alt="Fast4Car" /></div>
											<div className="banner-slide"><img src="/assets/imgs/page/car/banner-thumn2.png" alt="Fast4Car" /></div>
											<div className="banner-slide"><img src="/assets/imgs/page/car/banner-thumn3.png" alt="Fast4Car" /></div>
											<div className="banner-slide"><img src="/assets/imgs/page/car/banner-thumn4.png" alt="Fast4Car" /></div>
											<div className="banner-slide"><img src="/assets/imgs/page/car/banner-thumn5.png" alt="Fast4Car" /></div>
											<div className="banner-slide"><img src="/assets/imgs/page/car/banner-thumn6.png" alt="Fast4Car" /></div>
											<div className="banner-slide"><img src="/assets/imgs/page/car/banner-thumn.png" alt="Fast4Car" /></div>
											<div className="banner-slide"><img src="/assets/imgs/page/car/banner-thumn3.png" alt="Fast4Car" /></div>
										</Slider>
									</div>
								</div>

								<div className="car-nav-tabs mt-4 mb-4 position-sticky" style={{ top: "0", zIndex: "100" }}>
									<div className="container-fluid px-0">
										<div className="nav-scroll py-3 bg-light dark:bg-gray-800 rounded" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
											<ul className="nav nav-pills d-flex px-3">
												<li className="nav-item">
													<a href="#details" className={`nav-link px-4 ${activeTab === 'details' ? 'text-white' : 'text-dark'}`} style={activeTab === 'details' ? { backgroundColor: "#E53E3E" } : {}}>Details</a>
												</li>
												<li className="nav-item">
													<a href="#features" className={`nav-link px-4 ${activeTab === 'features' ? 'text-white' : 'text-dark'}`} style={activeTab === 'features' ? { backgroundColor: "#E53E3E" } : {}}>Features</a>
												</li>
												<li className="nav-item">
													<a href="#how-it-works" className={`nav-link px-4 ${activeTab === 'how-it-works' ? 'text-white' : 'text-dark'}`} style={activeTab === 'how-it-works' ? { backgroundColor: "#E53E3E" } : {}}>How it works</a>
												</li>
												<li className="nav-item">
													<a href="#price-map" className={`nav-link px-4 ${activeTab === 'price-map' ? 'text-white' : 'text-dark'}`} style={activeTab === 'price-map' ? { backgroundColor: "#E53E3E" } : {}}>Price map</a>
												</li>
												<li className="nav-item">
													<a href="#comparison" className={`nav-link px-4 ${activeTab === 'comparison' ? 'text-white' : 'text-dark'}`} style={activeTab === 'comparison' ? { backgroundColor: "#E53E3E" } : {}}>Comparison</a>
												</li>
												<li className="nav-item">
													<a href="#financing" className={`nav-link px-4 ${activeTab === 'financing' ? 'text-white' : 'text-dark'}`} style={activeTab === 'financing' ? { backgroundColor: "#E53E3E" } : {}}>Financing</a>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div className="box-collapse-expand mt-4" id="details">
									<div className="group-collapse-expand border-none">
										<button className={isAccordion == 1 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOverview" aria-expanded="false" aria-controls="collapseOverview" onClick={() => handleAccordion(1)}>
											<h6>Overview</h6>
											<svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
												<path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
											</svg>
										</button>
										<div className={isAccordion == 1 ? "collapse" : "collapse show"} id="collapseOverview">
											<div className="card card-body">
												<div className="car-details-specifications py-4">
													<h4 className="mb-4">Details</h4>

													<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4">
														<div className="row g-4">
															<div className="col-md-4">
																<div className="d-flex align-items-center">
																	<div className="icon-container me-3">
																		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																			<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0z"></path>
																			<path d="M12 7v5l3 3"></path>
																		</svg>
																	</div>
																	<div>
																		<div className="text-gray-500 dark:text-gray-400 small">MILEAGE</div>
																		<div className="fw-bold text-gray-900 dark:text-white">46,042 km</div>
																	</div>
																</div>
															</div>
															<div className="col-md-4">
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
																		<div className="text-gray-500 dark:text-gray-400 small">FIRST REGISTRATION</div>
																		<div className="fw-bold text-gray-900 dark:text-white">12/2020</div>
																	</div>
																</div>
															</div>
															<div className="col-md-4">
																<div className="d-flex align-items-center">
																	<div className="icon-container me-3">
																		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																			<path d="M4 20h16a2 2 0 0 1 2-2V8a2 2 0 0 0-2-2h-2V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
																			<path d="M12 8v8"></path>
																			<path d="M8 12h8"></path>
																		</svg>
																	</div>
																	<div>
																		<div className="text-gray-500 dark:text-gray-400 small">POWER</div>
																		<div className="fw-bold text-gray-900 dark:text-white">181 hp</div>
																	</div>
																</div>
															</div>
															<div className="col-md-4">
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
																		<div className="text-gray-500 dark:text-gray-400 small">TRANSMISSION</div>
																		<div className="fw-bold text-gray-900 dark:text-white">Automatic</div>
																	</div>
																</div>
															</div>
															<div className="col-md-4">
																<div className="d-flex align-items-center">
																	<div className="icon-container me-3">
																		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																			<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
																		</svg>
																	</div>
																	<div>
																		<div className="text-gray-500 dark:text-gray-400 small">DRIVE TYPE</div>
																		<div className="fw-bold text-gray-900 dark:text-white">4x2</div>
																	</div>
																</div>
															</div>
															<div className="col-md-4">
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
																		<div className="text-gray-500 dark:text-gray-400 small">CONSUMPTION</div>
																		<div className="fw-bold text-gray-900 dark:text-white">4 l/100km</div>
																	</div>
																</div>
															</div>
															<div className="col-md-4">
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
																		<div className="text-gray-500 dark:text-gray-400 small">CO2 EMISSIONS</div>
																		<div className="fw-bold text-gray-900 dark:text-white">92 g/km</div>
																	</div>
																</div>
															</div>
															<div className="col-md-4">
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
																		<div className="text-gray-500 dark:text-gray-400 small">LOCATION</div>
																		<div className="fw-bold text-gray-900 dark:text-white">Germany</div>
																	</div>
																</div>
															</div>
														</div>
													</div>

													<div className="electric-specs bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4" >
														<div className="d-flex justify-content-between mb-3">
															<h5>Electric motor specifications for a new car</h5>
															<span className="badge bg-red-500 text-dark p-2 rounded">Hybrid (HEV) ⓘ</span>
														</div>

														<div className="row g-4 mt-2">
															<div className="col-md-6">
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
																		<div className="text-muted small">BATTERY CAPACITY</div>
																		<div className="fw-bold">2 kWh</div>
																	</div>
																</div>
															</div>
															<div className="col-md-6">
																<div className="d-flex align-items-center">
																	<div className="icon-container me-3 text-primary">
																		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																			<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
																		</svg>
																	</div>
																	<div>
																		<div className="text-muted small">ELECTRIC MOTOR POWER ⓘ</div>
																		<div className="fw-bold">80 kW</div>
																	</div>
																</div>
															</div>
															<div className="col-md-6">
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
																		<div className="text-muted small">INTERNAL COMB. ENGINE POWER ⓘ</div>
																		<div className="fw-bold">112 kW</div>
																	</div>
																</div>
															</div>
															<div className="col-md-6">
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
																		<div className="text-muted small">SECONDARY FUEL ⓘ</div>
																		<div className="fw-bold">Petrol</div>
																	</div>
																</div>
															</div>
														</div>

														<div className="row mt-4">
															<div className="col-md-4">
																<div className="mb-3">
																	<div className="text-muted small">Battery type</div>
																	<div className="fw-bold">Nickel-metal hydride (Ni-MH)</div>
																</div>
															</div>
														</div>

														<div className="mt-2">
															<a href="#" className="text-primary d-flex align-items-center">
																<span>More about electric cars</span>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2">
																	<path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"></path>
																	<path d="M14 2h6v6"></path>
																	<path d="M18 8L8 18"></path>
																</svg>
															</a>
														</div>

														<div className="mt-4 pt-3 border-top text-muted small">
															<p className="mb-0">The specified parameters of the electric drive are indicative and represent the best possible option for a new vehicle. Actual values may vary depending on the configuration, age, and technical condition of the vehicle.</p>
														</div>
													</div>

													<div className="general-engine-info ">
														<div className="row">
															<div className="col-md-6 ">
																<div className="card border-0 mb-4">
																	<div className="card-header bg-gray-50 dark:bg-gray-800">General</div>
																	<div className="card-body p-0">
																		<table className="table table-striped mb-0">
																			<tbody>
																				<tr>
																					<td className="text-muted">Vehicle ID</td>
																					<td className="fw-medium">74002238</td>
																				</tr>
																				<tr>
																					<td className="text-muted">Make</td>
																					<td className="fw-medium">Toyota</td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																</div>
															</div>
															<div className="col-md-6">
																<div className="card border-0 mb-4">
																	<div className="card-header bg-gray-50 dark:bg-gray-800">Engine</div>
																	<div className="card-body p-0">
																		<table className="table table-striped mb-0">
																			<tbody>
																				<tr>
																					<td className="text-muted">Engine capacity</td>
																					<td className="fw-medium">1,987 ccm</td>
																				</tr>
																				<tr>
																					<td className="text-muted">Consumption (comb.)</td>
																					<td className="fw-medium">4 l/100km</td>
																				</tr>
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

									{/* <div className="group-collapse-expand" id="price-history">
											<button className={isAccordion == 3 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseQuestion" aria-expanded="false" aria-controls="collapseQuestion" onClick={() => handleAccordion(3)}>
												<h6>Question  Answers</h6>
												<svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
													<path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
												</svg>
											</button>
											<div className={isAccordion == 3 ? "collapse" : "collapse show"} id="collapseQuestion">
												<div className="card card-body">
													<div className="list-questions">
														<div className="item-question">
															<div className="head-question">
																<p className="text-md-bold neutral-1000">Is The High Roller suitable for all ages?</p>
															</div>
															<div className="content-question">
																<p className="text-sm-medium neutral-800">Absolutely! The High Roller offers a family-friendly experience suitable for visitors of all ages. Children must be accompanied by an adult.</p>
															</div>
														</div>
														<div className="item-question active">
															<div className="head-question">
																<p className="text-md-bold neutral-1000">Can I bring food or drinks aboard The High Roller?</p>
															</div>
															<div className="content-question">
																<p className="text-sm-medium neutral-800">Outside food and beverages are not permitted on The High Roller. However, there are nearby dining options at The LINQ Promenade where you can enjoy a meal before or after your ride.</p>
															</div>
														</div>
														<div className="item-question">
															<div className="head-question">
																<p className="text-md-bold neutral-1000">Is The High Roller wheelchair accessible?</p>
															</div>
															<div className="content-question">
																<p className="text-sm-medium neutral-800">es, The High Roller cabins are wheelchair accessible, making it possible for everyone to enjoy the breathtaking views of Las Vegas.</p>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div> */}

								</div>


								<div className="features-section py-5" id="features">
									<div className="container-fluid px-0">
										<h3 className="mb-4">Features</h3>

										<div className="row">
											<div className="col-md-6 mb-4">
												<div className="card border-0 h-100 bg-gray-50 dark:bg-gray-800">
													<div className="card-body p-4">
														<h5 className="card-title text-gray-900 dark:text-white mb-4">Security, Safety and Assistance</h5>
														<div className="row">
															<div className="col-md-6">
																<ul className="list-unstyled feature-list">
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white rounded">
																			Parking camera
																		</span>
																	</li>
																	<li className="mb-2">
																		<a href="#" className="text-gray-900 dark:text-white text-decoration-none">Parking assist system self-steering</a>
																	</li>
																	<li className="mb-2">
																		<a href="#" className="text-gray-900 dark:text-white text-decoration-none">Blind spot assist</a>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">ABS</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Emergency braking assist (EBA, BAS)</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Emergency call</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Fatigue warning system</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Front collision warning system</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Hill-start assist</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Immobilizer</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Lane assist</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Front and rear parking sensors</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Power assisted steering</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Rain sensor</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Rear seats ISOFIX points</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Traction control (TC, ASR)</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Traffic sign recognition</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Tyre pressure monitoring</span>
																	</li>
																</ul>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="col-md-6 mb-4">
												<div className="card border-0 h-100">
													<div className="card-body p-4">
														<h5 className="card-title text-gray-900 dark:text-white mb-4">Comfort and Convenience</h5>
														<div className="row">
															<div className="col-md-6">
																<ul className="list-unstyled feature-list">
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">USB</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Navigation system</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Keyless entry</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Heated steering wheel</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Heated front seats</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Apple CarPlay</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Android Auto</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Automatic 2-zones air conditioning</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Alloy wheels</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Armrest front</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">JBL audio</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Automatic parking brake</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Bluetooth</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Central locking</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Adaptive cruise control</span>
																	</li>
																</ul>
															</div>
															<div className="col-md-6">
																<ul className="list-unstyled feature-list">
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">DAB radio</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Daytime running lights</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Front electric windows</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Front Fog lights</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Hands-free</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">LED headlights</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">High beam assist</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Integrated music streaming</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Keyless ignition</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Leather steering wheel</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Light sensor</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Multifunctional steering wheel</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">On-board computer</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Radio</span>
																	</li>
																</ul>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div className="col-md-6 mb-4">
												<div className="card border-0">
													<div className="card-body p-4">
														<h5 className="card-title text-gray-900 dark:text-white mb-4">Accessories and Extra features</h5>
														<div className="row">
															<div className="col-md-6">
																<ul className="list-unstyled feature-list">
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Tyre repair kit</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Divided rear seats</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Side mirrors with electric adjustment</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Start-stop system</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Tinted windows</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Touch screen</span>
																	</li>
																	<li className="mb-2">
																		<span className="text-gray-900 dark:text-white">Voice control</span>
																	</li>
																</ul>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div id="how-it-works" className="mt-5 pt-3 w-full">
									<h3 className="mb-4 text-gray-900 dark:text-white">How it works</h3>
									<div className="card border-0 rounded-4 overflow-hidden bg-white dark:bg-gray-800">
										<div id="howItWorksCarousel" className="carousel slide" data-bs-ride="carousel">
											<div className="carousel-inner">
												<div className="carousel-item active bg-gray-50 dark:bg-gray-800 p-4">
													<div className="position-relative">
														<div className="d-flex">
															<div className="position-relative" style={{ width: "45%", clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", overflow: "hidden" }}>
																<div style={{ height: "400px" }}>
																	<img src="/how_works_2.webp" className="w-100 h-100" alt="Car inspection" style={{ objectFit: "cover", objectPosition: "center" }} />
																</div>
																<div className="position-absolute" style={{ top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(135deg, rgba(0,0,0,0) 60%, rgba(255,122,0,0.4) 100%)" }}></div>
															</div>
															<div className="py-5 px-4 px-md-5" style={{ width: "55%" }}>
																<h4 className="text-gray-900 dark:text-white mb-3">Check the car first, decide later</h4>
																<p className="mb-4 text-gray-900 dark:text-gray-200">
																	For each car, we first arrange an inspection, which results in a complete report on the technical condition of the car.
																</p>
																<p className="text-gray-500 dark:text-gray-400">
																	Only then do you decide whether you want to buy the car.
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
												<div className="carousel-item bg-gray-50 dark:bg-gray-800 p-4">
													<div className="position-relative">
														<div className="d-flex">
															<div className="position-relative" style={{ width: "45%", clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", overflow: "hidden" }}>
																<div style={{ height: "400px" }}>
																	<img src="/how_works_3.webp" className="w-100 h-100" alt="Customer warranty" style={{ objectFit: "cover", objectPosition: "center" }} />
																</div>
																<div className="position-absolute" style={{ top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(135deg, rgba(0,0,0,0) 60%, rgba(255,122,0,0.4) 100%)" }}></div>
															</div>
															<div className="py-5 px-4 px-md-5" style={{ width: "55%" }}>
																<h4 className="text-gray-900 dark:text-white mb-3">We keep the guarantee!</h4>
																<p className="mb-4 text-gray-900 dark:text-gray-200">
																	We don't doubt the cars you buy from us, but for your peace of mind, we'll give you a 6-month warranty on the essentials - engine, transmission, differential - in addition to the warranty on hidden defects.
																</p>
																<p className="text-gray-500 dark:text-gray-400">
																	If you still don't like the car, <strong>you can return it to us within 14 days of receipt.</strong>
																</p>
															</div>
														</div>
													</div>
												</div>
												<div className="carousel-item bg-gray-50 dark:bg-gray-800 p-4">
													<div className="position-relative">
														<div className="d-flex">
															<div className="position-relative" style={{ width: "45%", clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)", overflow: "hidden" }}>
																<div style={{ height: "400px" }}>
																	<img src="/how_works_1.webp" className="w-100 h-100" alt="Delivery truck" style={{ objectFit: "cover", objectPosition: "center" }} />
																</div>
																<div className="position-absolute" style={{ top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(135deg, rgba(0,0,0,0) 60%, rgba(255,122,0,0.4) 100%)" }}></div>
															</div>
															<div className="py-5 px-4 px-md-5" style={{ width: "55%" }}>
																<h4 className="text-gray-900 dark:text-white mb-3">Delivery time</h4>
																<p className="mb-4 text-gray-900 dark:text-gray-200">
																	We can deliver most cars within 20 business days from the confirmation of your order and receipt of payment.
																</p>
																<p className="text-gray-500 dark:text-gray-400">
																	Depending on the specific location of the vehicle and the legal timeframes required for administrative procedures, which vary between countries, the expected delivery time may be extended.
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
									<h3 className="mb-4 fs-5">Price Map <span className="badge bg-light text-primary fs-6 ms-2">Market Analysis</span></h3>
									<div className="card border-0 rounded-4 overflow-hidden mb-4">
										<div className="card-body p-4">
											<div className="d-flex justify-content-between align-items-center mb-3">
												<h5 className="mb-0 fs-6">Price vs Mileage Comparison</h5>
												<div className="d-flex gap-3 align-items-center">
													<div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#FF7A00' }}></div>
														<span className="small">This vehicle</span>
													</div>
													<div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#3B66FF' }}></div>
														<span className="small">Similar models</span>
													</div>
													<div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#BBC5D5' }}></div>
														<span className="small">Market average</span>
													</div>
												</div>
											</div>

											<div className="price-map-chart bg-white rounded-3 p-3" style={{ height: '250px' }}>
												{/* Enhanced price map chart */}
												<div className="position-relative h-100">
													{/* Y-axis labels */}
													<div className="position-absolute start-0 h-100 d-flex flex-column justify-content-between" style={{ width: '60px' }}>
														<div className="text-muted small">€31,000</div>
														<div className="text-muted small">€29,000</div>
														<div className="text-muted small">€27,000</div>
														<div className="text-muted small">€25,000</div>
														<div className="text-muted small">€23,000</div>
													</div>

													{/* X-axis labels */}
													<div className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-between ps-5 pe-3">
														<div className="text-muted small">40,000 km</div>
														<div className="text-muted small">44,000 km</div>
														<div className="text-muted small">48,000 km</div>
														<div className="text-muted small">52,000 km</div>
														<div className="text-muted small">56,000 km</div>
													</div>

													{/* Chart with grid lines and dots */}
													<div className="position-absolute top-0 start-0 w-100 h-100 ps-5 pe-3 pt-3 pb-5">
														{/* Horizontal grid lines */}
														{[0, 25, 50, 75, 100].map((pos) => (
															<div key={pos} className="position-absolute w-100 border-top border-gray-200" style={{ top: `${pos}%`, opacity: 0.3 }}></div>
														))}

														{/* Vertical grid lines */}
														{[0, 25, 50, 75, 100].map((pos) => (
															<div key={`v-${pos}`} className="position-absolute h-100 border-start border-gray-200" style={{ left: `${pos}%`, opacity: 0.3 }}></div>
														))}

														{/* This car dot with tooltip */}
														<div className="position-absolute" style={{ top: '40%', left: '25%' }}>
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
																title="This car: €24,999 | 46,042 km"
															></div>
														</div>

														{/* Comparison car dots with pulsing effect */}
														<div className="position-absolute" style={{ top: '35%', left: '45%' }}>
															<div
																className="rounded-circle"
																style={{
																	width: '14px',
																	height: '14px',
																	backgroundColor: '#3B66FF',
																	boxShadow: '0 0 0 3px rgba(59, 102, 255, 0.2)',
																	cursor: 'pointer'


																}}
																data-bs-toggle="tooltip"
																data-bs-placement="top"
																title="Toyota C-HR: €25,499 | 48,500 km"
															></div>
														</div>

														<div className="position-absolute" style={{ top: '50%', left: '55%' }}>
															<div
																className="rounded-circle"
																style={{
																	width: '14px',
																	height: '14px',
																	backgroundColor: '#3B66FF',
																	boxShadow: '0 0 0 3px rgba(59, 102, 255, 0.2)',
																	cursor: 'pointer'
																}}
																data-bs-toggle="tooltip"
																data-bs-placement="top"
																title="Toyota C-HR: €23,750 | 51,200 km"
															></div>
														</div>

														{/* Background dots for other cars */}
														{Array.from({ length: 15 }).map((_, index) => (
															<div key={index} className="position-absolute" style={{
																top: `${20 + Math.random() * 60}%`,
																left: `${15 + Math.random() * 70}%`
															}}>
																<div
																	className="rounded-circle"
																	style={{
																		width: '8px',
																		height: '8px',
																		backgroundColor: '#BBC5D5',
																		opacity: 0.8,
																		cursor: 'pointer'
																	}}
																	data-bs-toggle="tooltip"
																	data-bs-placement="top"
																	title={`Toyota ${Math.random() > 0.5 ? 'C-HR' : 'RAV4'}: €${(23000 + Math.random() * 4000).toFixed(0)} | ${(42000 + Math.random() * 14000).toFixed(0)} km`}
																></div>
															</div>
														))}
													</div>
												</div>
											</div>

											<div className="d-flex justify-content-between align-items-center mt-3">
												<div className="text-muted small">Data from similar vehicles in market</div>
												<div className="bg-light-green rounded-2 py-1 px-2 d-flex align-items-center">
													<span className="text-success small fw-medium">Good price positioning</span>
												</div>
											</div>
										</div>
									</div>

									<div className="row g-4">
										<div className="col-md-6">
											<div className="card border-0 rounded-4 h-100">
												<div className="position-relative">
													<img src="/assets/imgs/cars-details/banner.png" className="card-img-top rounded-top-4" alt="Toyota C-HR" style={{ height: '200px', objectFit: 'cover' }} />
													<div className="position-absolute top-0 start-0 m-3">
														<span className="badge bg-primary text-white px-3 py-2">THIS CAR</span>
													</div>
												</div>
												<div className="card-body p-4">
													<h5 className="mb-2">Toyota C-HR 2.0 Hybrid 135 kW</h5>
													<div className="d-flex align-items-center mb-3">
														<div className="me-4">
															<span className="text-muted small">46,042 km</span>
														</div>
														<div>
															<span className="text-muted small">12/2020</span>
														</div>
													</div>

													<div className="d-flex mb-3">
														<div className="text-success me-2">
															★★★★☆
														</div>
														<span className="text-muted small">Very good price</span>
													</div>

													<div className="d-flex justify-content-between align-items-baseline mb-3">
														<h4 className="mb-0">24 999 €</h4>
														<span className="text-muted small">without VAT 20 491 €</span>
													</div>

													<h6 className="mt-4 mb-3">Equipment</h6>
													<div className="d-flex flex-wrap gap-2">
														<span className="badge bg-light text-primary px-3 py-2">Parking assist</span>
														<span className="badge bg-light text-primary px-3 py-2">Keyless entry</span>
														<span className="badge bg-light text-primary px-3 py-2">Heated wheel</span>
														<span className="badge bg-light text-primary px-3 py-2">Apple CarPlay</span>
														<span className="badge bg-light text-primary px-3 py-2">Android Auto</span>
													</div>
												</div>
											</div>
										</div>

										<div className="col-md-6">
											<div className="card border-0 rounded-4 h-100">
												<div className="position-relative">
													<img src="/assets/imgs/cars-details/banner2.png" className="card-img-top rounded-top-4" alt="Toyota C-HR" style={{ height: '200px', objectFit: 'cover' }} />
													<div className="position-absolute top-0 start-0 m-3">
														<span className="badge bg-warning text-dark px-3 py-2">COMPARED TO</span>
													</div>
												</div>
												<div className="card-body p-4">
													<h5 className="mb-2">Toyota C-HR 2.0 135 kW</h5>
													<div className="d-flex align-items-center mb-3">
														<div className="me-4">
															<span className="text-muted small">42,799 km</span>
														</div>
														<div>
															<span className="text-muted small">1/2022</span>
														</div>
													</div>

													<div className="d-flex justify-content-between align-items-baseline mb-3">
														<h4 className="mb-0">24 149 €</h4>
														<div className="text-end">
															<div className="small">by 1 150 € more expensive</div>
															<div className="text-muted small">without VAT 21 844 €</div>
														</div>
													</div>

													<h6 className="mt-4 mb-3">Differences in equipment</h6>
													<div className="mb-3">
														<div className="d-flex mb-2">
															<span className="badge bg-success me-2">+</span>
															<span>Electric adjustable front seats</span>
														</div>
														<div className="d-flex mb-2">
															<span className="badge bg-success me-2">+</span>
															<span>Full leather</span>
														</div>
														<div className="d-flex">
															<span className="badge bg-success me-2">+</span>
															<span>Heated side mirrors</span>
														</div>
													</div>

													<div>
														<div className="d-flex mb-2">
															<span className="badge bg-secondary me-2">-</span>
															<span>Parking assist system</span>
														</div>
														<div className="d-flex mb-2">
															<span className="badge bg-secondary me-2">-</span>
															<span>Keyless entry</span>
														</div>
														<div className="d-flex">
															<span className="badge bg-secondary me-2">-</span>
															<span>Apple CarPlay</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div id="comparison" className="mt-5 pt-3">
									<h3 className="mb-4 fs-5">Comparison</h3>
									<div className="card border-0 rounded-4 overflow-hidden mb-4">
										<div className="card-body p-4">
											<div className="text-center mb-4">
												<p className="mb-2 fs-6">Compared with more than <span className="fw-bold text-primary">408 similar vehicles</span> offered in recent months.</p>
												<p className="mb-5">We take in account <span className="fw-bold">up to 70 vehicle characteristics</span>.</p>

												<div className="position-relative mt-5 pt-4">
													<div className="position-relative" style={{ maxWidth: '550px', margin: '0 auto' }}>
														<div className="text-white text-center p-3 rounded-3 mb-5 position-relative" style={{ width: '200px', margin: '0 auto', backgroundColor: '#E53E3E' }}>
															<div className="mb-1 fw-bold">THIS CAR</div>
															<div className="fs-4 fw-bold">€24,999</div>
															<div className="position-absolute start-50 translate-middle-x" style={{ bottom: '-12px' }}>
																<div style={{ width: '0', height: '0', borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid #E53E3E' }}></div>
															</div>
														</div>
													</div>

													<div className="d-flex justify-content-between align-items-center mt-4 mb-2 px-4">
														<div className="text-success fw-medium" style={{ fontSize: '14px' }}>Top offer</div>
														<div className="text-success fw-medium" style={{ fontSize: '14px' }}>Very good price</div>
														<div className="text-warning fw-medium" style={{ fontSize: '14px' }}>Fair price</div>
														<div className="text-warning fw-medium" style={{ fontSize: '14px' }}>Higher price</div>
														<div style={{ color: '#FF8A00', fontWeight: '500', fontSize: '14px' }}>High price</div>
													</div>

													<div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
														<div style={{ width: '20%', backgroundColor: '#64C359' }}></div>
														<div style={{ width: '20%', backgroundColor: '#8BD980' }}></div>
														<div style={{ width: '20%', backgroundColor: '#FFD25F' }}></div>
														<div style={{ width: '20%', backgroundColor: '#FFC107' }}></div>
														<div style={{ width: '20%', backgroundColor: '#FF8A00' }}></div>
													</div>

													<div className="d-flex justify-content-between align-items-center mt-3 px-3">
														<div className="text-muted">€24,165</div>
														<div className="text-muted">€25,675</div>
														<div className="text-muted">€27,218</div>
														<div className="text-muted">€28,729</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div id="financing" className="mt-5 pt-3">
									<h3 className="mb-4 fs-5">Financing</h3>
									<div className="card border-0 rounded-4 overflow-hidden mb-4">
										<div className="card-body p-4">
											<div className="d-flex justify-content-between align-items-center mb-3">
												<h5 className="mb-0 fs-6">Financing options</h5>
												<div className="d-flex gap-3 align-items-center">
													<div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#FF7A00' }}></div>
														<span className="small">This vehicle</span>
													</div>
													<div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#3B66FF' }}></div>
														<span className="small">Similar models</span>
													</div>
													<div className="d-flex align-items-center">
														<div className="rounded-circle me-2" style={{ width: '12px', height: '12px', backgroundColor: '#BBC5D5' }}></div>
														<span className="small">Market average</span>
													</div>
												</div>
											</div>
											<div className="d-flex justify-content-between align-items-center">
												<div className="text-muted small">Data from similar vehicles in market</div>
												<div className="bg-light-green rounded-2 py-1 px-2 d-flex align-items-center">
													<span className="text-success small fw-medium">Good price positioning</span>
												</div>
											</div>

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
								<div className="sidebar-banner mb-4" style={{
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
											<p className="text-success m-0 fw-semibold">Very good price</p>
										</div>

										<div className="d-flex justify-content-between align-items-center mb-2">
											<h6 className="text-lg-bold neutral-1000 m-0">Car price</h6>
											<p className="text-xl-bold m-0 fs-3">€24,999</p>
										</div>
										<div className="d-flex justify-content-between align-items-center mb-4">
											<p className="text-md-medium text-muted m-0">Price without VAT</p>
											<p className="text-md-medium text-muted m-0">€20,491</p>
										</div>

										<Link href="/checkout" className="btn w-100 rounded-3 py-3 mb-3 d-flex align-items-center justify-content-center" style={{ background: "#E53E3E", color: "white" }} >
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
												<path d="M7.5 21.75C8.32843 21.75 9 21.0784 9 20.25C9 19.4216 8.32843 18.75 7.5 18.75C6.67157 18.75 6 19.4216 6 20.25C6 21.0784 6.67157 21.75 7.5 21.75Z" fill="currentColor" />
												<path d="M17.25 21.75C18.0784 21.75 18.75 21.0784 18.75 20.25C18.75 19.4216 18.0784 18.75 17.25 18.75C16.4216 18.75 15.75 19.4216 15.75 20.25C15.75 21.0784 16.4216 21.75 17.25 21.75Z" fill="currentColor" />
												<path d="M3.96562 6.75H20.7844L18.3094 15.4125C18.2211 15.7269 18.032 16.0036 17.7711 16.2C17.5103 16.3965 17.1922 16.5019 16.8656 16.5H7.88437C7.55783 16.5019 7.2397 16.3965 6.97886 16.2C6.71803 16.0036 6.52893 15.7269 6.44062 15.4125L3.04688 3.54375C3.00203 3.38696 2.9073 3.24905 2.77704 3.15093C2.64677 3.05282 2.48808 2.99983 2.325 3H0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											Buy
										</Link>

										<Link href="#" className="btn w-100 rounded-3 py-3 d-flex align-items-center justify-content-center mb-4" style={{ background: "#F0F0FF", color: "#E53E3E", border: "1px solid #E2E2E2" }}>
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
												<path d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M16.5 7.5C15.6716 7.5 15 8.17157 15 9C15 9.82843 15.6716 10.5 16.5 10.5C17.3284 10.5 18 9.82843 18 9C18 8.17157 17.3284 7.5 16.5 7.5Z" fill="currentColor" />
												<path d="M8.25 12L5.25 15.75H18.75L14.25 9.75L11.25 13.5L8.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											Financing €327/mo
										</Link>

										<div className="d-flex justify-content-between align-items-center mb-3">
											<h6 className="m-0 d-flex align-items-center">
												Services total
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2">
													<path d="M8 10.6667L4 6.66675H12L8 10.6667Z" fill="currentColor" />
												</svg>
											</h6>
											<p className="text-md-bold m-0">€1,111</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0">Car Inspection</p>
											<p className="text-md-medium m-0">€119</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2 border-bottom">
											<p className="text-md-medium m-0 d-flex align-items-center">
												Delivery
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 text-primary">
													<path d="M12.6667 6.00008H10.6667V2.66675H12L12.6667 6.00008ZM12.6667 6.00008H3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M11.9999 10H12.6666C13.0348 10 13.3333 9.70152 13.3333 9.33333V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M3.99992 13.3333C4.73626 13.3333 5.33325 12.7363 5.33325 12C5.33325 11.2636 4.73626 10.6666 3.99992 10.6666C3.26359 10.6666 2.66659 11.2636 2.66659 12C2.66659 12.7363 3.26359 13.3333 3.99992 13.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M11.9999 13.3333C12.7363 13.3333 13.3333 12.7363 13.3333 12C13.3333 11.2636 12.7363 10.6666 11.9999 10.6666C11.2636 10.6666 10.6666 11.2636 10.6666 12C10.6666 12.7363 11.2636 13.3333 11.9999 13.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M10.6667 12H5.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M2.66659 12H1.99992V4.66667C1.99992 4.29848 2.29841 4 2.66659 4H10.6666V9.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</p>
											<Link href="#" className="text-primary text-decoration-none">Enter ZIP code</Link>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0 d-flex align-items-center">
												Registration / Province Tax
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 text-muted">
													<path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</p>
											<p className="text-md-medium m-0">€293</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0 d-flex align-items-center">
												Preparing the car for delivery (with a license plate)
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 text-muted">
													<path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</p>
											<p className="text-md-medium m-0">€699</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0 d-flex align-items-center">
												10 liters of fuel
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2 text-muted">
													<path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M8 5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</p>
											<p className="text-md-medium m-0 px-3 py-1 bg-success text-white rounded-3">Free</p>
										</div>

										<div className="d-flex justify-content-between align-items-center py-2">
											<p className="text-md-medium m-0">Extended warranty</p>
											<p className="text-md-medium m-0 px-3 py-1 bg-success text-white rounded-3">Free</p>
										</div>
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
								<Link href="/checkout" passHref legacyBehavior>
									<Button as="a" colorScheme="red" size="lg" w="100%">
										Buy
									</Button>
								</Link>
							</div>
						</Box>

					</Box>
					<MobileBuyCarDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
				</Box>
			</div>
		</Layout>
	)
}