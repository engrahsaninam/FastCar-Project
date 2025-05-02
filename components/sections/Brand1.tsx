"use client";
import { useColorModeValue } from "@chakra-ui/react";
import Link from "next/link"
import Marquee from 'react-fast-marquee'

export default function Brand1() {
	const textColor = useColorModeValue("gray.700", "gray.300");

	return (
		<>
			<div className="background-100 pb-70 pt-70">
				<div className="container">
					<div className="box-search-category d-flex flex-column align-items-center justify-content-center">
						<h4 className={`heading-3 neutral-1000 text-center wow fadeInUp ${textColor}`}>Offical Partner</h4>
						<div className="d-flex flex-column align-items-center justify-content-center">
							<p className="text-lg-medium neutral-500 text-center wow fadeInUp mb-0">Exclusive partner of AutoScout24</p>
						</div>

						<div className="d-flex justify-content-center align-items-center mt-3 light-mode">
							<img
								src="/logoauto.png"
								alt="Auto Logo"
								style={{
									width: 'auto',
									height: 'auto',
									maxWidth: '300px',
									maxHeight: '150px',
									objectFit: 'contain',
									margin: '0 auto',
									// display: 'block'
								}}
							/>
						</div>
						<div className="d-flex justify-content-center align-items-center mt-3 dark-mode">
							<img
								src="/logoautodark.png"
								alt="Auto Logo"
								style={{
									width: 'auto',
									height: 'auto',
									maxWidth: '300px',
									maxHeight: '150px',
									objectFit: 'contain',
									margin: '0 auto',
									// display: 'block'
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
