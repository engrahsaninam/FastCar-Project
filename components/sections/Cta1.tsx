'use client'
import Link from "next/link"
import { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalBody, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export default function Cta1() {
	const [isOpen, setOpen] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useState(null);
	return (
		<>

			<section className="box-cta-1 background-100 py-96">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-6 pe-lg-5 wow fadeInUp">
							<div className="card-video">
								<div className="card-image">
									<a className="btn btn-play popup-youtube" onClick={() => setOpen(true)} />
									<img src="/check.jpg" alt="Fast4Car" />
								</div>
							</div>
						</div>
						<div className="col-lg-6 mt-lg-0 mt-4">
							<Link href="/how-it-works" className="btn btn-signin bg-white text-dark mb-4 wow fadeInUp">See how it works</Link>
							<h4 className="mb-4 neutral-1000 wow fadeInUp">How does Fast4Car Work?</h4>
							<p className="text-lg-medium neutral-500 mb-4 wow fadeInUp">Simply. Choose a car. We will arrange a detailed inspection. Based on that you can decide whether you want the car. We then buy it, arrange an extended warranty, register it and deliver it to you.</p>
							<div className="row">
								<div className="col-md-6">
									<ul className="list-ticks-green">
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.1s">Check the car first, decide later</li>
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.2s">Get Reasonable Price
										</li>
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.3s">We stand by the guarantee!
										</li>
									</ul>
								</div>
								<div className="col-md-6">
									<ul className="list-ticks-green wow fadeInUp">
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.1s">Choose a car
										</li>
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.2s">Order and pay
										</li>
										<li className="neutral-1000 wow fadeInUp" data-wow-delay="0.3s">We will provide a guarantee
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} size="3xl" isCentered>
				<ModalOverlay />
				<ModalContent bg="transparent" boxShadow="none" maxW="800px">
					<ModalBody p={0} position="relative">
						<IconButton
							icon={<CloseIcon />}
							aria-label="Close video"
							position="absolute"
							top={2}
							right={2}
							zIndex={2}
							onClick={() => setOpen(false)}
							bg="white"
							_hover={{ bg: 'gray.200' }}
							size="sm"
						/>
						<video
							src="/no_music.mp4"
							poster="/thumbnail.png"
							controls
							autoPlay
							style={{ width: '100%', borderRadius: '16px', background: 'black' }}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}
