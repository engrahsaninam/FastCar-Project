'use client'
import dynamic from 'next/dynamic'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link as ChakraLink, Text, Flex, HStack, useColorModeValue, useToken, Menu, MenuButton, MenuList, MenuItem, Box } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function Header2({ scroll, isMobileMenu, handleMobileMenu, handleOffcanvas, isOffcanvas }: any) {
	const pathname = usePathname();
	const isMainPage = pathname === '/';

	// Move all useColorModeValue hooks to the top level
	const lightTextColor = useColorModeValue('gray.900', 'gray.100');
	const lightTextColorHover = useColorModeValue('gray.700', 'gray.200');
	const lightBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const lightBgColor = useColorModeValue('white', 'gray.900');
	const lightBurgerIconClass = useColorModeValue('burger-icon-black', 'burger-icon-white');

	// Use the values conditionally
	const textColor = isMainPage ? 'gray.900' : lightTextColor;
	const textColorHover = isMainPage ? 'gray.700' : lightTextColorHover;
	const borderColor = lightBorderColor;
	const bgColor = lightBgColor;
	const burgerIconClass = isMainPage ? 'burger-icon-white' : lightBurgerIconClass;

	const [resolvedBgColor] = useToken('colors', [bgColor]);

	return (
		<>
			<div style={{ backgroundColor: resolvedBgColor }}>
				<header style={{ backgroundColor: resolvedBgColor }} className={`header sticky-bar ${isMainPage ? 'header-home-2' : ''} ${scroll ? 'stick' : ''}`}>
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
								<div className="d-flex align-items-center gap-0 md:gap-3">
									<Box display={{ base: "none", xl: "flex" }} px={["8px", "30px"]} borderRight="1px solid" borderColor={borderColor} alignItems="center">
										<Menu>
											<MenuButton
												as={Text}
												fontSize={["10px", "16px"]}
												fontWeight="medium"
												color={textColor}
												_hover={{ color: textColorHover }}
												cursor="pointer"
												display="flex"
												alignItems="center"
											>
												EN <ChevronDownIcon ml={1} />
											</MenuButton>
											<MenuList>
												<MenuItem as={Link} href="#">English</MenuItem>
												<MenuItem as={Link} href="#">French</MenuItem>
												<MenuItem as={Link} href="#">Chinese</MenuItem>
											</MenuList>
										</Menu>
									</Box>


									{/* Sign In */}
									<Box display="flex" px={["8px", "30px"]} borderRight="1px solid" borderColor={borderColor} alignItems="center">
										<Link href="/login" passHref>
											<Box as="a" display={{ base: "none", xl: "flex" }} alignItems="center" fontSize={["10px", "16px"]}
												fontWeight="medium" color={textColor} _hover={{ color: textColorHover }}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													style={{ marginRight: "8px" }}
												>
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
													<circle cx="12" cy="7" r="4"></circle>
												</svg>
												Sign In
											</Box>
										</Link>
									</Box>


									{/* Theme Switcher */}
									<div className="px-0 md:px-3">
										<div className={`top-button-mode ${!isMainPage ? 'theme-switch-dark' : ''}`}>
											<ThemeSwitch />
										</div>
									</div>
								</div>

								{/* Mobile Menu Icon */}
								<div className={`burger-icon ${burgerIconClass}`} onClick={handleMobileMenu} >
									<span className="burger-icon-top" />
									<span className="burger-icon-mid" />
									<span className="burger-icon-bottom" />
								</div>
							</div>
						</div>
					</div>
				</header>
			</div>
		</>
	)
}