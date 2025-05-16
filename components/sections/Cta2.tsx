'use client'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import Specs from '../calculator/Specs'
import CounterUp from '../elements/CounterUp'
import { useEffect, useState } from 'react';
import { Container, useColorModeValue } from '@chakra-ui/react';


export default function Cta2() {
	const [activeStep, setActiveStep] = useState(1);
	const bg = useColorModeValue('gray.50', '');
	useEffect(() => {
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
	}, []);
	return (
		<> <div className='background-100'>
			<Container maxWidth="container.xl" paddingInline={10} padding={10} >
				<section
					className="box-cta-2 background-100  overflow-hidden mx-6"
				><div id="how-it-works" className="mt-5 pt-3 w-full">
						<h3 className="mb-4 text-gray-900 dark:text-white">How it works</h3>
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
													<h4 className="text-gray-900 dark:text-white mb-3">Check the car first, decide later</h4>
													<p className="mb-4 text-gray-900 dark:text-gray-200">
														Before you commit, we'll arrange a thorough inspection and provide you with a detailed report on the car's technical condition.
													</p>
													<p className="text-gray-500 dark:text-gray-400">
														Only after reviewing the results do you decide if you want to proceed with the purchase.
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
														We're confident in the cars we sell, but for your peace of mind, every purchase comes with a 6-month warranty covering key components—engine, transmission, and differential—plus protection against hidden defects.
													</p>
													<p className="text-gray-500 dark:text-white">
														If you're not satisfied, you can return the car within 14 days of receiving it
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

													<h4 className="text-gray-900 dark:text-white mb-3">Fast Delivery </h4>
													<p className="mb-4 text-gray-900 dark:text-white">
														Most vehicles can be delivered within 20 business days after your order is confirmed and payment is received.
													</p>
													<p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-white">
														Please note: Delivery times may vary depending on the car's location and the administrative requirements in each country.
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
					</div></section>
			</Container>
		</div>
			<section className="box-cta-2 background-body overflow-hidden">
				<div className="bg-shape top-50 start-50 translate-middle" />
				<div className="bg-shape top-50 start-50 translate-middle" />
				<div className="container position-relative z-1">
					<div className="row ">
						<div className="col-lg-5 pe-lg-5 ">
							<h3 className="text-white wow fadeInDown">Want to Calculate Your Car Payment?</h3>
							<p className="text-lg-medium text-white wow fadeInUp">Match with up to 4 lenders to get the lowest
								rate available with no markups, no fees, and no obligations.</p>
						</div>
						<div className="col-lg-6 offset-lg-1">
							{/* <div className="mb-30 background-card p-md-5 p-4 rounded-3 mt-lg-0 mt-30 wow fadeIn">
								<h5 className="neutral-1000 mb-2">Car Loan Calculator</h5>
								<p className="text-sm-medium neutral-500 mb-25">Estimate your monthly auto loan payments with
									this calculator.</p>
								<div className="form-contact">
									<div className="row">
										<div className="col-lg-6">
											<div className="form-group">
												<label className="text-sm-medium neutral-1000">Price of vehicle</label>
												<input className="form-control" type="text" placeholder="$20,000" />
											</div>
										</div>
										<div className="col-lg-6">
											<div className="form-group">
												<label className="text-sm-medium neutral-1000">Interest rate</label>
												<input className="form-control" type="text" placeholder="5%" />
											</div>
										</div>
										<div className="col-lg-6">
											<div className="form-group">
												<label className="text-sm-medium neutral-1000">Terms</label>
												<input className="form-control" type="text" placeholder="12 months" />
											</div>
										</div>
										<div className="col-lg-6">
											<div className="form-group">
												<label className="text-sm-medium neutral-1000">Down payment</label>
												<input className="form-control" type="text" placeholder="$12,000" />
											</div>
										</div>
										<div className="row py-4">
											<div className="col-md-5 col-8 d-flex flex-column gap-1">
												<p className="text-sm-bold neutral-1000">Down payment ammout</p>
												<p className="text-sm-bold neutral-1000">Amount financed</p>
												<p className="text-sm-bold neutral-1000">Monthly payment</p>
											</div>
											<div className="col-md-7 col-4 d-flex flex-column gap-1 align-items-end align-items-md-start">
												<p className="text-sm-bold neutral-1000">$12,000</p>
												<p className="text-sm-bold neutral-1000">$800,00</p>
												<p className="text-sm-bold text-primary-dark">$480,00</p>
											</div>
										</div>
										<div className="col-lg-12">
											<button className="btn btn-book">
												Apply for a loan
												<svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div> */}
							<div className="ps-lg-4">
								<Specs
									onFinancingRequest={() => { }}
									onFullPayment={() => { }}
									onToggleSpecs={() => { }}
								/>
							</div>
						</div>
					</div>
					<div className="row align-items-center">
						{/* <div className="border-top py-3 mt-3" /> */}
						{/* <div className="col-lg-7 mb-20 wow fadeIn">
							<div className="row">
								<div className="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start">
									<div className="d-flex justify-content-center justify-content-md-start">
										<h3 className="count text-white"><CounterUp count={45} /></h3>
										<h3 className="text-white">+</h3>
									</div>
									<div className="position-relative">
										<p className="text-lg-bold text-white">Global</p>
										<p className="text-lg-bold text-white">Branches</p>
									</div>
								</div>
								<div className="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start">
									<div className="d-flex justify-content-center justify-content-md-start">
										<h3 className="count text-white"><CounterUp count={29} /></h3>
										<h3 className="text-white">K</h3>
									</div>
									<div className="position-relative">
										<p className="text-lg-bold text-white">Destinations</p>
										<p className="text-lg-bold text-white">Collaboration</p>
									</div>
								</div>
								<div className="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start">
									<div className="d-flex justify-content-center justify-content-md-start">
										<h3 className="count text-white"><CounterUp count={20} /></h3>
										<h3 className="text-white">+</h3>
									</div>
									<div className="position-relative">
										<p className="text-lg-bold text-white">Years</p>
										<p className="text-lg-bold text-white">Experience</p>
									</div>
								</div>
								<div className="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start">
									<div className="d-flex justify-content-center justify-content-md-start">
										<h3 className="count text-white"><CounterUp count={168} /></h3>
										<h3 className="text-white">K</h3>
									</div>
									<div className="position-relative">
										<p className="text-lg-bold text-white">Happy</p>
										<p className="text-lg-bold text-white">Customers</p>
									</div>
								</div>
							</div>
						</div> */}
						{/* <div className="col-lg-4 offset-lg-1 wow fadeIn">
							<div className="box-authors-partner background-body wow fadeInUp p-4">
								<div className="authors-partner-left">
									<img src="/assets/imgs/page/homepage5/author.png" alt="Fast4Car" /><img src="/assets/imgs/page/homepage5/author2.png" alt="Fast4Car" /><img src="/assets/imgs/page/homepage5/author3.png" alt="Fast4Car" />
									<span className="item-author">
										<svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect x="0.5" y="7.448" width={17} height="2.31818" fill="black" />
											<rect x="7.84082" y="17.1072" width={17} height="2.31818" transform="rotate(-90 7.84082 17.1072)" fill="black" />
										</svg>
									</span>
								</div>
								<div className="authors-partner-right">
									<p className="text-sm neutral-1000">1684 people used <strong>Fast4Car </strong>in the last
										<strong>24 hours</strong></p>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</section>
		</>
	)
}
