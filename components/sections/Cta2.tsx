'use client'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import Specs from '../calculator/Specs'
import CounterUp from '../elements/CounterUp'
import { useEffect, useState } from 'react';
import { Container, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function Cta2() {
	const [activeStep, setActiveStep] = useState(1);
	const bg = useColorModeValue('gray.50', '');
	const { t } = useTranslation();
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
		<>
			<section className="box-cta-2 background-body overflow-hidden">
				<div className="bg-shape top-50 start-50 translate-middle" />
				<div className="bg-shape top-50 start-50 translate-middle" />
				<div className="container position-relative z-1">
					<div className="row ">
						<div className="col-lg-5 pe-lg-5 ">
							<h3 className="text-white wow fadeInDown">{t('cta2.wantToCalculate')}</h3>
							<p className="text-lg-medium text-white wow fadeInUp">{t('cta2.matchLenders')}</p>
						</div>
						<div className="col-lg-6 offset-lg-1">
							<div className="ps-lg-4">
								<Specs
									onFinancingRequest={() => { }}
									onFullPayment={() => { }}
									onToggleSpecs={() => { }}
								/>
							</div>
						</div>
					</div>
					{/* Carousel Section (uncomment and i18n if needed) */}
					{/*
					<div id="how-it-works" className="mt-5 pt-3 w-full">
						<h3 className="mb-4 text-gray-900 dark:text-white">{t('cta2.howItWorks')}</h3>
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
													<h4 className="text-gray-900 dark:text-white mb-3">{t('cta2.step1Title')}</h4>
													<p className="mb-4 text-gray-900 dark:text-gray-200">{t('cta2.step1Desc1')}</p>
													<p className="text-gray-500 dark:text-gray-400">{t('cta2.step1Desc2')}</p>
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
													<h4 className="text-gray-900 dark:text-white mb-3">{t('cta2.step2Title')}</h4>
													<p className="mb-4 text-gray-900 dark:text-white">{t('cta2.step2Desc1')}</p>
													<p className="text-gray-500 dark:text-white">{t('cta2.step2Desc2')}</p>
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
													<h4 className="text-gray-900 dark:text-white mb-3">{t('cta2.step3Title')}</h4>
													<p className="mb-4 text-gray-900 dark:text-white">{t('cta2.step3Desc1')}</p>
													<p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-white">{t('cta2.step3Desc2')}</p>
												</div>
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
												{activeStep} {t('cta2.of')} 3
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
					*/}
				</div>
			</section>
		</>
	)
}
