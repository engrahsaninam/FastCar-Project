'use client'
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link as ChakraLink, Text, Flex, HStack, Menu, MenuButton, MenuList, MenuItem, Box, useColorModeValue, useToken } from '@chakra-ui/react';
import dynamic from 'next/dynamic'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import Dropdown from 'react-bootstrap/Dropdown'
export default function Header1({ scroll, isMobileMenu, handleMobileMenu, handleOffcanvas, isOffcanvas }: any) {
	const pathname = usePathname();
	const isMainPage = pathname === '/';

	// Move all useColorModeValue hooks to the top level
	const lightTextColor = useColorModeValue('gray.900', 'gray.100');
	const lightTextColorHover = useColorModeValue('gray.700', 'gray.200');
	const lightBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const lightBgColor = useColorModeValue('white', 'gray.900');
	const lightBurgerIconClass = useColorModeValue('burger-icon-black', 'burger-icon-white');

	// Use the values conditionally
	const textColor = isMainPage ? 'gray.100' : lightTextColor;
	const textColorHover = isMainPage ? 'gray.300' : lightTextColorHover;
	const borderColor = lightBorderColor;
	const bgColor = isMainPage ? 'gray.900' : lightBgColor;
	const burgerIconClass = isMainPage ? 'burger-icon-white' : lightBurgerIconClass;

	const [resolvedBgColor] = useToken('colors', [bgColor]);

	return (
		<>
			<header style={{ backgroundColor: resolvedBgColor }} className={`header header-fixed sticky-bar ${scroll ? 'stick' : ''}`}>
				<div className="container-fluid">
					<div className="main-header">
						<div className="header-left">
							<div className="header-logo" style={{ display: 'none' }}>
								<Link className="d-flex" href="/">
									<img className="light-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
									<img className="dark-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
								</Link>
							</div>
							<Box className="header-logo" display={{ base: 'block', md: 'block' }}>
								<Link className="d-flex" href="/">
									<img className="light-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
									<img className="dark-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
								</Link>
							</Box>
							<div className="header-nav">
								<nav className="nav-main-menu">
									<ul className="main-menu">
										
										<li><ChakraLink as={Link} href="/cars" fontSize="md" fontWeight="medium" color={textColor} _hover={{ color: textColorHover, textDecoration: 'none' }}>Buy</ChakraLink></li>
										<li><ChakraLink as={Link} href="/deals" fontSize="md" fontWeight="medium" color={textColor} _hover={{ color: textColorHover, textDecoration: 'none' }}>Daily Deals</ChakraLink></li>
										<li><ChakraLink as={Link} href="/how-it-works" fontSize="md" fontWeight="medium" color={textColor} _hover={{ color: textColorHover, textDecoration: 'none' }}>How it Works</ChakraLink></li>
										<li><ChakraLink as={Link} href="/reviews" fontSize="md" fontWeight="medium" color={textColor} _hover={{ color: textColorHover, textDecoration: 'none' }}>Reviews</ChakraLink></li>
										<li><ChakraLink as={Link} href="/calculator" fontSize="md" fontWeight="medium" color={textColor} _hover={{ color: textColorHover, textDecoration: 'none' }}>Loan Calculator</ChakraLink></li>
									</ul>
								</nav>
							</div>
							<div className="header-right">
								<div className="header-right " style={{ marginRight: '20px' }}>
									<Box display={{ base: "flex", xl: "flex" }} px={3} borderRight="1px solid" borderColor={borderColor} alignItems="center" whiteSpace='nowrap'>
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
									<Box display="flex" px={["10px", "30px"]} borderRight="1px solid" borderColor={borderColor} alignItems="center" whiteSpace='nowrap'>
										<Link href="/login" passHref>
											<Box as="a" display={{ base: "flex", xl: "flex" }} alignItems="center" fontSize={["10px", "16px"]}
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


									<div className="top-button-mode">
										<ThemeSwitch />
									</div>
								</div>
								<div className={`burger-icon ${burgerIconClass}`} onClick={handleMobileMenu}>
									<span className="burger-icon-top" />
									<span className="burger-icon-mid" />
									<span className="burger-icon-bottom" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

		</>
	)
}
