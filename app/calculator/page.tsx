'use client'
import FinancingCard from "@/components/calculator/Financing"
import Specs from "@/components/calculator/Specs"
import FinancingSpecs from "@/components/checkout/PaymentMethod/FinancingSpecs"
import Layout from "@/components/layout/Layout"
import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react"
import Link from "next/link"
import { useState } from 'react'
import FinancingWorkflow from "@/components/calculator/FinancingWorkflow"
import { useTranslation } from 'react-i18next'

export default function Calculator() {
	const { t } = useTranslation();
	const [isAccordion, setIsAccordion] = useState(1)
	const textColor = useColorModeValue("gray.900", "gray.100");
	const handleAccordion = (key: any) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	const bgColor = useColorModeValue("#F7FAFC", "#171923")
	return (
		<>

			<Layout footerStyle={1}>
				<div style={{ backgroundColor: bgColor }}>
					{/* <section className="section-cta-11 background-body pt-85 pb-85">
						<div className="container">
							<div className="row">
								<div className="col-lg-5">
									<h4 className="mb-10 neutral-1000" style={{ fontFamily: "satoshi", fontWeight: 900 }}>
										Get a competitive loan offer.
										Apply with us today.
									</h4>
									<p className="text-lg-medium mt-2 neutral-1000">Unlock the best rates and terms for your car loan with our easy application process.</p>
								</div>
								<div className="col-lg-7 mt-lg-0 mt-4">
									<div className="d-flex flex-md-row flex-column align-items-center justify-content-center gap-3 mb-30">
										<div>
											<img className="rounded-12" src="/assets/imgs/cta/cta-11/img-1.png" alt="Fast4Car" />
										</div>
										<div>
											<img className="rounded-12" src="/assets/imgs/cta/cta-11/img-2.png" alt="Fast4Car" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</section> */}


					{/* cta 12*/}
					<section className="section-cta-12  py-96">
						<div className="box-cta-6">
							<div className="container">
								<Box mb={10} textAlign="center">
									<Heading
										as="h1"
										fontSize={{ base: "3xl", md: "5xl" }}
										color={textColor}
										fontWeight={900}
										lineHeight="1.2"
										fontFamily='satoshi'
										marginTop={['20px', '0px', '0px']}
									>
										{t('calculator.financingThroughFast4Car')}
									</Heading>
									<Text
										fontSize={{ base: "lg", md: "xl" }}
										color={textColor}
										mb={8}
										p={6}
										lineHeight="1.6"
									>
										{t('calculator.favourableFinancingDesc')}
									</Text>
								</Box>
								<div className="row align-items-start justify-content-between">
									<div className="col-lg-6">
										<div className="card-image d-inline-block position-relative mb-4 mt-30">
											<div className="m-w-fit m-h-fit">
												<img
													className="rounded-12 img-fluid"
													src="/assets/imgs/cta/cta-11/img-3.png"
													alt="Fast4Car"
													style={{ width: '100%', height: 'auto' }}
												/>
												{/* <img
													className="position-absolute  start-100 translate-middle d-md-block"
													src="/assets/imgs/cta/cta-11/img-car.png"
													alt="Fast4Car" */}
												{/* /> */}
											</div>
											{/* Info section below car image */}
											<Box mt={['20px', '0px', '200px']} mb={4} display="flex" flexDirection={{ base: 'row', md: 'row' }} justifyContent="center" alignItems={{ base: 'center', md: 'center' }} gap={{ base: 6, md: 16 }}>
												<Box textAlign={{ base: 'center', md: 'center' }}>
													<Text fontSize="sm" color={textColor} mt={1}>{t('calculator.averageInterestRate')}</Text>

													<Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="bold" color="red">8.99 %</Text>
												</Box>
												<Box textAlign={{ base: 'center', md: 'center' }}>
													<Text fontSize="sm" color={textColor} mt={1}>{t('calculator.approvalTime')}</Text>
													<Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="bold" color="red">24 {t('calculator.hours')}</Text>

												</Box>
											</Box>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="ps-lg-4 mt-20 md:mt-0" >
											<Specs
												onFinancingRequest={() => { }}
												onFullPayment={() => { }}
												onToggleSpecs={() => { }}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="bg-overlay position-absolute bottom-0 end-0 h-75 background-brand-2 opacity-25 z-0 rounded-start-pill" />
						</div>
					</section>
					<FinancingWorkflow />

					<div className="container">
						<FinancingCard />
					</div>

					{/* <section className="py-5">
						<div className="container">
							<div className="row justify-content-between align-items-center">
								<div className="col-lg-6">
									<FinancingSpecs
										onFinancingRequest={() => { }}
										onFullPayment={() => { }}
										onToggleSpecs={() => { }}
									/>
								</div>
								<div className="col-lg-6 d-flex align-items-center justify-content-center">
									<div className="card-image position-relative">
										<img
											src="/carfi.png"
											alt="Car Financing"
											className="img-fluid rounded-3"
											style={{
												maxHeight: '500px',
												width: '100%',
												objectFit: 'cover'
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</section> */}
					{/* banners 3 */}
					<section className="section-box-banner-3 banner-2 background-body">
						<div className="container pt-110 pb-110 position-relative z-1">
							<div className="row justify-content-center">
								<div className="col-auto text-center wow fadeInUp justify-content-center d-flex flex-column align-items-center">
									<h2 className="text-white">{t('calculator.bestCarRentDeals')}</h2>
									<h6 className="text-white">
										{t('calculator.save15OrMore')}
									</h6>
									<Link className="btn btn-primary rounded-pill btn-lg mt-20" href="#">
										{t('calculator.findEarly2025Deals')}
										<svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none">
											<path d="M12.5 19L19.5 12L12.5 5M19.5 12L5.5 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</Link>
								</div>
							</div>
						</div>
					</section>

					{/* FAQs 2 */}
					<section className="section-faqs-2 pt-80 pb-80 border-bottom background-body position-relative">
						<div className="container position-relative z-2">
							<div className="text-center mb-40 ">
								<h3 className="my-3 neutral-1000 text-start">{t('calculator.faqTitle')}</h3>
								<p className="text-xl-medium neutral-500 d-none">{t('calculator.faqSubtitle')}</p>
							</div>
							<div className="row">
								<div className="col-lg-6">
									<div className="accordion">
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(1)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ1')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapse01" className={`collapse ${isAccordion == 1 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA1')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(2)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ2')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapse02" className={`collapse ${isAccordion == 2 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA2')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(3)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ3')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapse03" className={`collapse ${isAccordion == 3 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA3')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(4)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ4')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapse04" className={`collapse ${isAccordion == 4 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA4')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(5)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ5')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapse05" className={`collapse ${isAccordion == 5 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA5')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(6)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ6')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapse6" className={`collapse ${isAccordion == 6 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA6')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(7)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ7')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapse7" className={`collapse ${isAccordion == 7 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA7')}</p>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-6 mt-lg-0 mt-2">
									<div className="accordion">
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(8)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ8')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapseSevent" className={`collapse ${isAccordion == 8 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA8')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(9)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ9')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapseEight" className={`collapse ${isAccordion == 9 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA9')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(10)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ10')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapseNine" className={`collapse ${isAccordion == 10 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA10')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(11)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ11')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapseTen" className={`collapse ${isAccordion == 11 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA11')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(12)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ12')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapseEleven" className={`collapse ${isAccordion == 12 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA12')}</p>
											</div>
										</div>
										<div className="mb-2 card border">
											<div className="px-0 card-header border-0 bg-gradient-1 background-card">
												<a className="collapsed px-3 py-2 text-900 fw-bold d-flex align-items-center" onClick={() => handleAccordion(13)} >
													<p className="text-lg-bold neutral-1000 pe-4">{t('calculator.faqQ13')}</p>
													<span className="ms-auto arrow me-2">
														<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
															<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</span>
												</a>
											</div>
											<div id="collapseTwelve" className={`collapse ${isAccordion == 13 ? 'show' : ''} `} data-bs-parent=".accordion">
												<p className="pt-0 pb-4 card-body background-body">{t('calculator.faqA13')}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-12 wow fadeInUp mt-4">
									<div className="d-flex justify-content-center gap-2">
										<Link className="btn btn-gray2" href="#">
											{t('calculator.contactUs')}
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
										<Link className="btn btn-primary rounded-3" href="#">
											{t('calculator.submitTicket')}
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>

			</Layout>
		</>
	)
}