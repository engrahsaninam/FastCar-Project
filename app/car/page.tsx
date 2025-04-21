'use client'
import MyDatePicker from '@/components/elements/MyDatePicker'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useState } from "react"
import Marquee from 'react-fast-marquee'
import ModalVideo from 'react-modal-video'
import Slider from "react-slick"
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
	const [activeTab, setActiveTab] = useState("price-history")
	const [activeStep, setActiveStep] = useState(1)

	useEffect(() => {
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
			carousel.addEventListener('slide.bs.carousel', (e: any) => {
				if (e && typeof e.to === 'number') {
					setActiveStep(e.to + 1);
				}
			});
		}

		// Track scroll position to update active tab
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 200;

			// Find all sections
			const sections = ['details', 'features', 'how-it-works', 'price-history', 'price-map', 'comparison', 'financing'];

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
	}, [slider2, slider1]);

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
	return (
		<>

			<Layout footerStyle={1}>
				<div>
					<section className="box-section box-breadcrumb background-body">
						<div className="container">
							<ul className="breadcrumbs">
								<li>
									<Link href="/">Home</Link>
									<span className="arrow-right">
										<svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</span>
								</li>
								<li>
									<Link href="/destination">Cars Rental</Link>
									<span className="arrow-right">
										<svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</span>
								</li>
								<li><span className="text-breadcrumb">Hyundai Accent 2025 </span></li>
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
												<Link className="btn btn-success rounded-pill" href="#">
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
											<div className="nav-scroll py-3 bg-light rounded shadow-sm" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
												<ul className="nav nav-pills d-flex px-3">
													<li className="nav-item">
														<a href="#details" className={`nav-link px-4 ${activeTab === 'details' ? 'text-white' : 'text-dark'}`} style={activeTab === 'details' ? { backgroundColor: "#FF7A00" } : {}}>Details</a>
													</li>
													<li className="nav-item">
														<a href="#features" className={`nav-link px-4 ${activeTab === 'features' ? 'text-white' : 'text-dark'}`} style={activeTab === 'features' ? { backgroundColor: "#FF7A00" } : {}}>Features</a>
													</li>
													<li className="nav-item">
														<a href="#how-it-works" className={`nav-link px-4 ${activeTab === 'how-it-works' ? 'text-white' : 'text-dark'}`} style={activeTab === 'how-it-works' ? { backgroundColor: "#FF7A00" } : {}}>How it works</a>
													</li>
													{/* <li className="nav-item">
														<a href="#price-history" className={`nav-link px-4 ${activeTab === 'price-history' ? 'text-white' : 'text-dark'}`} style={activeTab === 'price-history' ? { backgroundColor: "#FF7A00" } : {}}>Price History</a>
													</li> */}
													<li className="nav-item">
														<a href="#price-map" className={`nav-link px-4 ${activeTab === 'price-map' ? 'text-white' : 'text-dark'}`} style={activeTab === 'price-map' ? { backgroundColor: "#FF7A00" } : {}}>Price map</a>
													</li>
													<li className="nav-item">
														<a href="#comparison" className={`nav-link px-4 ${activeTab === 'comparison' ? 'text-white' : 'text-dark'}`} style={activeTab === 'comparison' ? { backgroundColor: "#FF7A00" } : {}}>Comparison</a>
													</li>
													<li className="nav-item">
														<a href="#financing" className={`nav-link px-4 ${activeTab === 'financing' ? 'text-white' : 'text-dark'}`} style={activeTab === 'financing' ? { backgroundColor: "#FF7A00" } : {}}>Financing</a>
													</li>
												</ul>
											</div>
										</div>
									</div>

									<div className="features-section py-5" id="features">
										<div className="container-fluid px-0">
											<h3 className="mb-4">Features</h3>

											<div className="row">
												<div className="col-md-6 mb-4">
													<div className="card border-0 h-100">
														<div className="card-body p-4">
															<h5 className="card-title text-dark mb-4">Security, Safety and Assistance</h5>
															<div className="row">
																<div className="col-md-6">
																	<ul className="list-unstyled feature-list">
																		<li className="mb-2">
																			<a href="#" className="text-primary text-decoration-none">Parking camera</a>
																		</li>
																		<li className="mb-2">
																			<a href="#" className="text-primary text-decoration-none">Parking assist system self-steering</a>
																		</li>
																		<li className="mb-2">
																			<a href="#" className="text-primary text-decoration-none">Blind spot assist</a>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">ABS</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Emergency braking assist (EBA, BAS)</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Emergency call</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Fatigue warning system</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Front collision warning system</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Hill-start assist</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Immobilizer</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Lane assist</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Front and rear parking sensors</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Power assisted steering</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Rain sensor</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Rear seats ISOFIX points</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Traction control (TC, ASR)</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Traffic sign recognition</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Tyre pressure monitoring</span>
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
															<h5 className="card-title text-dark mb-4">Comfort and Convenience</h5>
															<div className="row">
																<div className="col-md-6">
																	<ul className="list-unstyled feature-list">
																		<li className="mb-2">
																			<span className="text-dark">USB</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Navigation system</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Keyless entry</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Heated steering wheel</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Heated front seats</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Apple CarPlay</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Android Auto</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Automatic 2-zones air conditioning</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Alloy wheels</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Armrest front</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">JBL audio</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Automatic parking brake</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Bluetooth</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Central locking</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Adaptive cruise control</span>
																		</li>
																	</ul>
																</div>
																<div className="col-md-6">
																	<ul className="list-unstyled feature-list">
																		<li className="mb-2">
																			<span className="text-dark">DAB radio</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Daytime running lights</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Front electric windows</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Front Fog lights</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Hands-free</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">LED headlights</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">High beam assist</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Integrated music streaming</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Keyless ignition</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Leather steering wheel</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Light sensor</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Multifunctional steering wheel</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">On-board computer</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Radio</span>
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
															<h5 className="card-title text-dark mb-4">Accessories and Extra features</h5>
															<div className="row">
																<div className="col-md-6">
																	<ul className="list-unstyled feature-list">
																		<li className="mb-2">
																			<span className="text-dark">Tyre repair kit</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Divided rear seats</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Side mirrors with electric adjustment</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Start-stop system</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Tinted windows</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Touch screen</span>
																		</li>
																		<li className="mb-2">
																			<span className="text-dark">Voice control</span>
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
										<h3 className="mb-4">How it works</h3>
										<div className="card border-0 rounded-4 overflow-hidden shadow">
											<div id="howItWorksCarousel" className="carousel slide" data-bs-ride="false">
												<div className="carousel-inner">
													<div className="carousel-item active">
														<div className="row g-0">
															<div className="col-md-4 position-relative">
																<img src="/how_works_1.webp" className="img-fluid rounded-start w-100 h-70 object-cover" alt="Delivery truck" />
																<div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}>
																	<span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Step 1</span>
																</div>
															</div>
															<div className="col-md-8">
																<div className="card-body p-4 p-md-5">
																	<div className="d-flex align-items-center mb-3">
																		<div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#FFEBE5' }}>
																			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																				<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
																				<line x1="16" y1="2" x2="16" y2="6"></line>
																				<line x1="8" y1="2" x2="8" y2="6"></line>
																				<line x1="3" y1="10" x2="21" y2="10"></line>
																			</svg>
																		</div>
																		<div>
																			<h4 className="card-title mb-0 text-primary">Delivery time</h4>
																			<p className="text-muted small mb-0">Order confirmation</p>
																		</div>
																	</div>
																	<div className="card-text">
																		<p className="mb-4">We can deliver most cars within 20 business days from the confirmation of your order and receipt of payment.</p>
																		<p className="text-muted">Depending on the specific location of the vehicle and the legal timeframes required for administrative procedures, which vary between countries, the expected delivery time may be extended.</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div className="carousel-item">
														<div className="row g-0">
															<div className="col-md-4 position-relative">
																<img src="/how_works_2.webp" className="img-fluid rounded-start w-100 h-100 object-cover" alt="Car inspection" />
																<div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}>
																	<span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Step 2</span>
																</div>
															</div>
															<div className="col-md-8">
																<div className="card-body p-4 p-md-5">
																	<div className="d-flex align-items-center mb-3">
																		<div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#FFEBE5' }}>
																			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																				<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
																			</svg>
																		</div>
																		<div>
																			<h4 className="card-title mb-0 text-primary">Check the car first, decide later</h4>
																			<p className="text-muted small mb-0">Technical inspection</p>
																		</div>
																	</div>
																	<div className="card-text">
																		<p className="mb-4">For each car, we first arrange an inspection, which results in a complete report on the technical condition of the car.</p>
																		<p className="text-muted">Only then do you decide whether you want to buy the car.</p>
																		<div className="mt-4">
																			<button className="btn rounded-circle border-0" style={{ backgroundColor: '#FF7A00', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 122, 0, 0.3)' }}>
																				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
																					<polygon points="6 3 20 12 6 21 6 3"></polygon>
																				</svg>
																			</button>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div className="carousel-item">
														<div className="row g-0">
															<div className="col-md-4 position-relative">
																<img src="/how_works_3.webp" className="img-fluid rounded-start w-100 h-100 object-cover" alt="Customer warranty" />
																<div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}>
																	<span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Step 3</span>
																</div>
															</div>
															<div className="col-md-8">
																<div className="card-body p-4 p-md-5">
																	<div className="d-flex align-items-center mb-3">
																		<div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#FFEBE5' }}>
																			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
																			</svg>
																		</div>
																		<div>
																			<h4 className="card-title mb-0 text-primary">We keep the guarantee!</h4>
																			<p className="text-muted small mb-0">6-month warranty</p>
																		</div>
																	</div>
																	<div className="card-text">
																		<p className="mb-4">We don't doubt the cars you buy from us, but for your peace of mind, we'll give you a 6-month warranty on the essentials - engine, transmission, differential - in addition to the warranty on hidden defects.</p>
																		<p className="text-muted">If you still don't like the car, <strong>you can return it to us within 14 days of receipt.</strong></p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>

												{/* Controls and indicators in a fixed footer */}
												<div className="position-relative border-top mt-3">
													<div className="d-flex justify-content-between align-items-center px-4 py-3">
														<div className="d-flex">
															{[1, 2, 3].map((step) => (
																<button
																	key={step}
																	type="button"
																	data-bs-target="#howItWorksCarousel"
																	data-bs-slide-to={step - 1}
																	className={`position-relative d-flex align-items-center justify-content-center me-3 ${activeStep === step ? 'active' : ''}`}
																	style={{
																		background: "transparent",
																		border: "none",
																		cursor: "pointer",
																		padding: 0
																	}}
																	onClick={() => setActiveStep(step)}
																	aria-label={`Go to slide ${step}`}
																>
																	<div className="position-relative">
																		<div
																			className={`rounded-circle transition-all duration-200`}
																			style={{
																				width: '12px',
																				height: '12px',
																				backgroundColor: activeStep === step ? '#FF7A00' : '#D1D5DB',
																				opacity: activeStep === step ? 1 : 0.5,
																				transition: 'all 0.2s ease'
																			}}
																		></div>
																		<div
																			className="position-absolute top-0 left-0 rounded-circle"
																			style={{
																				width: '12px',
																				height: '12px',
																				border: activeStep === step ? '2px solid #FFCCA5' : 'none',
																				opacity: activeStep === step ? 1 : 0,
																				transform: 'scale(1.5)',
																				transition: 'all 0.2s ease'
																			}}
																		></div>
																	</div>
																	<div className="ms-2 d-none d-md-block">
																		<span className="small fw-medium" style={{
																			color: activeStep === step ? '#FF7A00' : '#718096'
																		}}>
																			Step {step}
																		</span>
																	</div>
																</button>
															))}
														</div>

														<div className="d-flex">
															<button
																className="btn btn-sm me-2 d-flex align-items-center justify-content-center"
																style={{
																	width: '36px',
																	height: '36px',
																	backgroundColor: 'transparent',
																	color: '#4A5568',
																	border: '1px solid #E2E8F0',
																	borderRadius: '8px'
																}}
																type="button"
																data-bs-target="#howItWorksCarousel"
																data-bs-slide="prev"
																onClick={() => {
																	if (activeStep > 1) {
																		setActiveStep(activeStep - 1);
																	}
																}}
															>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
																	<path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
																</svg>
															</button>
															<button
																className="btn btn-sm d-flex align-items-center justify-content-center"
																style={{
																	width: '36px',
																	height: '36px',
																	backgroundColor: 'transparent',
																	color: '#4A5568',
																	border: '1px solid #E2E8F0',
																	borderRadius: '8px'
																}}
																type="button"
																data-bs-target="#howItWorksCarousel"
																data-bs-slide="next"
																onClick={() => {
																	if (activeStep < 3) {
																		setActiveStep(activeStep + 1);
																	}
																}}
															>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
																	<path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
																</svg>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="box-collapse-expand mt-4">
										<div className="group-collapse-expand" id="details">
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

														<div className="bg-light p-4 rounded mb-4">
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
																			<div className="text-uppercase text-muted small">MILEAGE</div>
																			<div className="fw-bold">46,042 km</div>
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
																			<div className="text-uppercase text-muted small">FIRST REGISTRATION</div>
																			<div className="fw-bold">12/2020</div>
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
																			<div className="text-uppercase text-muted small">POWER</div>
																			<div className="fw-bold">181 hp</div>
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
																			<div className="text-uppercase text-muted small">TRANSMISSION</div>
																			<div className="fw-bold">Automatic</div>
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
																			<div className="text-uppercase text-muted small">DRIVE TYPE</div>
																			<div className="fw-bold">4x2</div>
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
																			<div className="text-uppercase text-muted small">CONSUMPTION</div>
																			<div className="fw-bold">4 l/100km</div>
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
																			<div className="text-uppercase text-muted small">CO2 EMISSIONS</div>
																			<div className="fw-bold">92 g/km</div>
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
																			<div className="text-uppercase text-muted small">LOCATION</div>
																			<div className="fw-bold">Germany</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>

														<div className="electric-specs p-4 rounded mb-4" style={{ background: 'linear-gradient(to right, #f0f6ff, #ffffff)' }}>
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
																			<div className="text-uppercase text-muted small">BATTERY CAPACITY</div>
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
																			<div className="text-uppercase text-muted small">ELECTRIC MOTOR POWER ⓘ</div>
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
																			<div className="text-uppercase text-muted small">INTERNAL COMB. ENGINE POWER ⓘ</div>
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
																			<div className="text-uppercase text-muted small">SECONDARY FUEL ⓘ</div>
																			<div className="fw-bold">Petrol</div>
																		</div>
																	</div>
																</div>
															</div>

															<div className="row mt-4">
																<div className="col-md-4">
																	<div className="mb-3">
																		<div className="text-uppercase text-muted small">Battery type</div>
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

														<div className="general-engine-info">
															<div className="row">
																<div className="col-md-6">
																	<div className="card border-0 mb-4">
																		<div className="card-header bg-light">General</div>
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
																		<div className="card-header bg-light">Engine</div>
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

									<div id="price-history" className="mt-5 pt-3">
										<h3 className="mb-4">Price Map <span className="badge bg-light text-primary fs-6 ms-2">Market Analysis</span></h3>
										<div className="card border-0 rounded-4 overflow-hidden shadow-sm mb-4">
											<div className="card-body p-4">
												<div className="d-flex justify-content-between align-items-center mb-3">
													<h5 className="mb-0">Price vs Mileage Comparison</h5>
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
												<div className="card border-0 rounded-4 shadow-sm h-100">
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
												<div className="card border-0 rounded-4 shadow-sm h-100">
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
										<h3 className="mb-4">Comparison</h3>
										<div className="card border-0 rounded-4 overflow-hidden shadow-sm mb-4">
											<div className="card-body p-4">
												<div className="text-center mb-4">
													<p className="mb-2 fs-5">Compared with more than <span className="fw-bold text-primary">408 similar vehicles</span> offered in recent months.</p>
													<p className="mb-5">We take in account <span className="fw-bold">up to 70 vehicle characteristics</span>.</p>

													<div className="position-relative mt-5 pt-4">
														<div className="position-relative" style={{ maxWidth: '550px', margin: '0 auto' }}>
															<div className="text-white text-center p-3 rounded-3 mb-5 position-relative" style={{ width: '200px', margin: '0 auto', backgroundColor: '#F56565' }}>
																<div className="mb-1 fw-bold">THIS CAR</div>
																<div className="fs-2 fw-bold">€24,999</div>
																<div className="position-absolute start-50 translate-middle-x" style={{ bottom: '-12px' }}>
																	<div style={{ width: '0', height: '0', borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid #F56565' }}></div>
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
										<h3 className="mb-4">Financing</h3>
										<div className="card border-0 rounded-4 overflow-hidden shadow-sm mb-4">
											<div className="card-body p-4">
												<div className="d-flex justify-content-between align-items-center mb-3">
													<h5 className="mb-0">Financing options</h5>
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
									<div className="sidebar-banner mb-4">
										<div className="p-4 background-body border rounded-3">
											<div className="bg-light-green rounded-2 py-2 px-3 mb-3 d-flex align-items-center">
												<div className="me-2">
													<span className="d-inline-block me-1 rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#64E364" }}></span>
													<span className="d-inline-block me-1 rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#64E364" }}></span>
													<span className="d-inline-block me-1 rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#64E364" }}></span>
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

											<Link href="/checkout" className="btn w-100 rounded-3 py-3 mb-3 d-flex align-items-center justify-content-center" style={{ background: "#F56565", color: "white" }}>
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
													<path d="M7.5 21.75C8.32843 21.75 9 21.0784 9 20.25C9 19.4216 8.32843 18.75 7.5 18.75C6.67157 18.75 6 19.4216 6 20.25C6 21.0784 6.67157 21.75 7.5 21.75Z" fill="currentColor" />
													<path d="M17.25 21.75C18.0784 21.75 18.75 21.0784 18.75 20.25C18.75 19.4216 18.0784 18.75 17.25 18.75C16.4216 18.75 15.75 19.4216 15.75 20.25C15.75 21.0784 16.4216 21.75 17.25 21.75Z" fill="currentColor" />
													<path d="M3.96562 6.75H20.7844L18.3094 15.4125C18.2211 15.7269 18.032 16.0036 17.7711 16.2C17.5103 16.3965 17.1922 16.5019 16.8656 16.5H7.88437C7.55783 16.5019 7.2397 16.3965 6.97886 16.2C6.71803 16.0036 6.52893 15.7269 6.44062 15.4125L3.04688 3.54375C3.00203 3.38696 2.9073 3.24905 2.77704 3.15093C2.64677 3.05282 2.48808 2.99983 2.325 3H0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
												Buy
											</Link>

											<Link href="#" className="btn w-100 rounded-3 py-3 d-flex align-items-center justify-content-center mb-4" style={{ background: "#F0F0FF", color: "#F56565", border: "1px solid #E2E2E2" }}>
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
												<p className="text-md-medium m-0">CarAudit™</p>
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

									<div className="sidebar-banner mb-4">
										{/* <div className="p-4 background-body border rounded-3">
											<h5 className="fw-bold mb-4">Get Started</h5>
											<Link href="#" className="btn w-100 rounded-3 py-3 mb-3 d-flex align-items-center justify-content-center" style={{ background: "#64E364", color: "black" }}>
												Schedule Test Drive
												<svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2">
													<path d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
											<Link href="#" className="btn w-100 rounded-3 py-3 d-flex align-items-center justify-content-center" style={{ background: "#E2FBDA", color: "black" }}>
												Make An Offer Price
												<svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2">
													<path d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
										</div> */}
									</div>

									<div className="sidebar-banner mb-4">
										<div className="p-4 background-body border rounded-3">
											{/* <h5 className="fw-bold mb-4">Rent This Vehicle</h5>
											<div className="booking-form">
												<div className="content-booking-form">
													<div className="row">
														<div className="col-md-6">
															<div className="form-group">
																<input className="form-control" type="text" placeholder="Your name" />
															</div>
														</div>
														<div className="col-md-6">
															<div className="form-group">
																<input className="form-control" type="text" placeholder="Email address" />
															</div>
														</div>
														<div className="col-md-12">
															<div className="form-group">
																<textarea className="form-control" placeholder="Your comment" defaultValue={""} />
															</div>
														</div>
														<div className="col-md-12">
															<button className="btn btn-black-lg-square">Submit review
																<svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
																	<path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
																</svg>
															</button >
														</div>
													</div>
												</div>
											</div> */}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="background-100 pt-55 pb-55 mt-100">
							<div className="container">
								<Marquee direction='left' pauseOnHover={true} className="carouselTicker carouselTicker-left box-list-brand-car justify-content-center  wow fadeIn">
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
						</div>
					</section>
					<ModalVideo channel='youtube' isOpen={isOpen} videoId="JXMWOmuR1hU" onClose={() => setOpen(false)} />
				</div>

			</Layout>
		</>
	)
}