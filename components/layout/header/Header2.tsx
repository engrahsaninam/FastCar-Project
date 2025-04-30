'use client'
import dynamic from 'next/dynamic'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link as ChakraLink, Text, Flex, HStack, useColorModeValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export default function Header2({ scroll, isMobileMenu, handleMobileMenu, handleOffcanvas, isOffcanvas }: any) {
	const pathname = usePathname();
	const isMainPage = pathname === '/';

	// Define colors based on page and scroll state
	const textColor = isMainPage ? 'text-white' : 'text-gray-900';
	const textColorHover = isMainPage ? 'hover:text-gray-200' : 'hover:text-gray-700';
	const borderColor = isMainPage ? 'border-white/20' : 'border-gray-200';

	return (
		<>
			<header className={`header sticky-bar ${isMainPage ? 'header-home-2' : ''} ${scroll ? 'stick' : ''}`}>
				<div className="main-header">
					<div className="header-left">
						<div className="header-logo">
							<Link className="d-flex" href="/">
								<img className="light-mode" alt="Fast4Car" src="/assets/imgs/template/logo-d.svg" />
								<img className="dark-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
							</Link>
						</div>
						<div className="header-nav">
							<nav className="nav-main-menu">
								<ul className="main-menu">
									<li className="me-4">
										<Link href="/cars" className={`${textColor} ${textColorHover} transition-colors`}>Buy</Link>
									</li>
									<li className="me-4">
										<Link href="/deals" className={`${textColor} ${textColorHover} transition-colors`}>Daily Deals  🔥</Link>
									</li>
									<li className="me-4">
										<Link href="/how-it-works" className={`${textColor} ${textColorHover} transition-colors`}>How it Works</Link>
									</li>
									<li className="me-4">
										<Link href="/reviews" className={`${textColor} ${textColorHover} transition-colors`}>Reviews</Link>
									</li>
									<li className="me-4">
										<Link href="/calculator" className={`${textColor} ${textColorHover} transition-colors`}>Loan Calculator</Link>
									</li>
								</ul>
							</nav>
						</div>
						<div className="header-right main-menu">
							<div className="d-flex align-items-center gap-3">
								{/* Language Selector */}
								<div className={`d-none d-xl-inline-block px-3 border-end ${borderColor}`}>
									<Dropdown className="box-dropdown-cart align-middle head-lang">
										<Dropdown.Toggle as="span" className={`text-14-medium icon-list icon-account icon-lang ${textColor} ${textColorHover}`}>
											<p className={`text-14-medium arrow-down ${textColor} ${textColorHover}`}>EN</p>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-account" style={{ visibility: 'visible' }}>
											<ul>
												<li><Link className="text-sm-medium" href="#">English</Link></li>
												<li><Link className="text-sm-medium" href="#">French</Link></li>
												<li><Link className="text-sm-medium" href="#">Chinese</Link></li>
											</ul>
										</Dropdown.Menu>
									</Dropdown>
								</div>

								{/* Sign In */}
								<div className={`d-none d-xl-inline-flex px-3 border-end ${borderColor}`}>
									<Link
										href="/login"
										className={`align-items-center text-14-medium d-flex ${textColor} ${textColorHover} transition-colors`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="me-2"
										>
											<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
											<circle cx="12" cy="7" r="4"></circle>
										</svg>
										Sign In
									</Link>
								</div>

								{/* Theme Switcher */}
								<div className="px-3">
									<div className={`top-button-mode ${!isMainPage ? 'theme-switch-dark' : ''}`}>
										<ThemeSwitch />
									</div>
								</div>
							</div>

							{/* Mobile Menu Icon */}
							<div className={`burger-icon ${isMainPage ? 'burger-icon-white' : ''}`} onClick={handleMobileMenu}>
								<span className="burger-icon-top" />
								<span className="burger-icon-mid" />
								<span className="burger-icon-bottom" />
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}