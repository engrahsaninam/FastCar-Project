'use client'
import dynamic from 'next/dynamic'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link as ChakraLink, Text, Flex, HStack, useColorModeValue, useToken, Menu, MenuButton, MenuList, MenuItem, Box, useDisclosure, Button, Divider, VStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useRef } from 'react'
import { ShoppingCart, User, Heart } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { MenuItemLink } from './Header1';
import { useOutsideClick } from '@chakra-ui/react';

export default function Header2({ scroll, isMobileMenu, handleMobileMenu, handleOffcanvas, isOffcanvas }: any) {
	const pathname = usePathname();
	const isMainPage = pathname === '/';
	const { isOpen, onOpen, onClose } = useDisclosure();
	const dropdownRef = useRef(null);

	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showSignupModal, setShowSignupModal] = useState(false);
	// Move all useColorModeValue hooks to the top level
	const lightTextColor = useColorModeValue('gray.900', 'gray.100');
	const lightTextColorHover = useColorModeValue('gray.700', 'gray.200');
	const lightBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const lightBgColor = useColorModeValue('white', 'gray.700');
	const lightBurgerIconClass = useColorModeValue('burger-icon-black', 'burger-icon-white');

	// Use the values conditionally
	const textColor = isMainPage ? 'gray.900' : lightTextColor;
	const textColorHover = isMainPage ? 'gray.700' : lightTextColorHover;
	const borderColor = lightBorderColor;
	const bgColor = useColorModeValue('white', 'gray.800');
	const burgerIconClass = isMainPage ? 'burger-icon-white' : lightBurgerIconClass;

	const [resolvedBgColor] = useToken('colors', [bgColor]);

	useOutsideClick({
		ref: dropdownRef,
		handler: () => {
			if (isOpen) onClose();
		},
	});

	return (
		<>
			<div style={{ backgroundColor: resolvedBgColor }}>
				<header style={{ backgroundColor: resolvedBgColor }} className={`header sticky-bar ${isMainPage ? 'header-home-2' : ''} ${scroll ? 'stick' : ''}`}>
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
										<img className="light-mode" alt="Fast4Car" src="/assets/imgs/template/logo-d.svg" />
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
								<div className="header-left">
									<div className="header-left " style={{ marginRight: '20px' }}>
										<Box display={{ base: "none", xl: "flex" }} px={3} pb={1} borderColor={borderColor} alignItems="center" whiteSpace='nowrap'>
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
										<Box position="relative">
											<Button
												onClick={isOpen ? onClose : onOpen}
												variant="ghost"
												px={2}
												top="10px"
												marginRight={[10, 0, 0]}

												rightIcon={<ChevronDown size={16} />}
												leftIcon={<User size={20} />}
												_hover={{ color: textColorHover }}
												color={textColor}
												fontWeight="medium"
											>

											</Button>

											{isOpen && (
												<Box
													ref={dropdownRef}
													position="absolute"
													top="100%"
													mt={2}
													right={0}
													bg={bgColor}
													border="1px solid"
													borderColor={borderColor}
													borderRadius="md"
													boxShadow="md"
													zIndex={100}
													width="300px"
												>
													<VStack align="start" spacing={0} p={4}>
														{/* <MenuItemLink label="Saved searches" Icon={Bookmark} />
											<MenuItemLink label="Last searches" Icon={Clock} /> */}
														<MenuItemLink label="Favorite cars" Icon={Heart} href="/favourite-cars" />
														<MenuItemLink label="Orders in progress" Icon={ShoppingCart} href="/order-in-progress" />
													</VStack>
													<HStack display='flex' justifyContent='center' alignItems='center'>

														<Box display={{ base: 'flex', xl: 'none' }} px={3} alignItems="center" whiteSpace="nowrap">
															<Menu>
																<MenuButton
																	as={Text}
																	fontSize={['16px', '16px']}
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
																	<MenuItem as="a" >
																		English
																	</MenuItem>
																	<MenuItem as="a">
																		French
																	</MenuItem>
																	<MenuItem as="a">
																		Chinese
																	</MenuItem>
																</MenuList>
															</Menu>
														</Box>
														<Box display={{ base: 'flex', xl: 'none' }} px={3} alignItems="center" whiteSpace="nowrap">
															<div className="top-button-mode" style={{ marginRight: '25px' }}>
																<ThemeSwitch />
															</div>
														</Box>
													</HStack>
													<Divider />

													<Box p={4}>
														<Link href="/login">
															<Button
																onClick={() => {
																	onClose();
																	setShowLoginModal(true);
																}}
																bg="red.500"
																_hover={{ bg: 'red.600' }}
																color="white"
																width="full"
																leftIcon={<User size={20} />}
																fontSize="15px"
																fontWeight="medium"
															>
																Login
															</Button>
														</Link>
														<Text mt={3} fontSize="sm" color="gray.500" textAlign="center">
															Don't have an account?
															<Link href="/register">

																<Button
																	variant="link"
																	ml={2}
																	color="red.500"
																	fontWeight="medium"
																	onClick={() => {
																		onClose();
																		setShowSignupModal(true);
																	}}
																>
																	Register
																</Button>
															</Link>
														</Text>
													</Box>
												</Box>
											)}
										</Box>

										<Box display={{ base: 'none', xl: 'flex' }} >
											<div className="top-button-mode " style={{ marginTop: '10px' }}>
												<ThemeSwitch />
											</div>
										</Box>
									</div>
									<div className={`burger-icon ${burgerIconClass}`} style={{ top: '20px' }} onClick={handleMobileMenu}>
										<span className="burger-icon-top" />
										<span className="burger-icon-mid" />
										<span className="burger-icon-bottom" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</header>
			</div>
		</>
	)
}