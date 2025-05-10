'use client';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import {
	Box,
	Button,
	ChakraProvider,
	Divider,
	Flex,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	VStack,
	useColorModeValue,
	useDisclosure,
	useToken,
	Link as ChakraLink,
	useOutsideClick
} from '@chakra-ui/react';
import { ChevronDown, User, Bookmark, Clock, Heart, ShoppingCart } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import router from 'next/router';

const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
});

export function MenuItemLink({ label, Icon, href }: { label: string; Icon: any, href: string }) {
	const color = useColorModeValue('black', 'white');
	const hoverColor = useColorModeValue('white', 'black');
	const router = useRouter();
	return (
		<HStack
			as="a"
			href={href}
			spacing={3}
			height="48px"
			width="full"
			_hover={{ color: hoverColor }}
			color={color}
			transition="color 0.2s"
		>
			<Icon size={20} />
			<Text fontSize="15px" fontWeight="medium">
				{label}
			</Text>
		</HStack>
	);
}

export default function Header1({
	scroll,
	isMobileMenu,
	handleMobileMenu,
	handleOffcanvas,
	isOffcanvas,
}: any) {
	const pathname = usePathname();
	const isMainPage = pathname === '/';
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showSignupModal, setShowSignupModal] = useState(false);

	const lightTextColor = useColorModeValue('gray.900', 'gray.100');
	const lightTextColorHover = useColorModeValue('gray.700', 'gray.200');
	const lightBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const lightBgColor = useColorModeValue('white', 'gray.900');
	const lightBurgerIconClass = useColorModeValue('burger-icon-black', 'burger-icon-white');

	const textColor = isMainPage ? 'white' : lightTextColor;
	const textColorHover = isMainPage ? 'gray.300' : lightTextColorHover;
	const borderColor = lightBorderColor;
	const bgColor = isMainPage ? 'gray.900' : lightBgColor;
	const bgColor1 = lightBgColor;
	const burgerIconClass = isMainPage ? 'burger-icon-white' : lightBurgerIconClass;

	const [resolvedBgColor] = useToken('colors', [bgColor]);

	const dropdownRef = useRef<HTMLDivElement>(null);
	useOutsideClick({
		ref: dropdownRef,
		handler: () => {
			if (isOpen) onClose();
		},
	});

	return (
		<header
			style={{ backgroundColor: resolvedBgColor }}
			className={`header header-fixed sticky-bar ${scroll ? 'stick' : ''}`}
		>
			<div className="container-fluid">
				<div className="main-header">
					<div className="header-left">
						<Box className="header-logo" display={{ base: 'block', md: 'block' }}>
							<Link className="d-flex" href="/">
								<img className="light-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
								<img className="dark-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
							</Link>
						</Box>

						<div className="header-nav">
							<nav className="nav-main-menu">
								<ul className="main-menu">
									<li>
										<ChakraLink as={Link} href="/cars" fontSize="md" fontWeight="medium" color="white">
											Buy
										</ChakraLink>
									</li>
									<li>
										<ChakraLink
											as={Link}
											href="/deals"
											fontSize="md"
											fontWeight="medium"
											color="white"
											_hover={{ color: textColorHover, textDecoration: 'none' }}
										>
											Daily Deals
										</ChakraLink>
									</li>
									<li>
										<ChakraLink
											as={Link}
											href="/how-it-works"
											fontSize="md"
											fontWeight="medium"
											color="white"
											_hover={{ color: textColorHover, textDecoration: 'none' }}
										>
											How it Works
										</ChakraLink>
									</li>
									<li>
										<ChakraLink
											as={Link}
											href="/reviews"
											fontSize="md"
											fontWeight="medium"
											color="white"
											_hover={{ color: textColorHover, textDecoration: 'none' }}
										>
											Reviews
										</ChakraLink>
									</li>
									<li>
										<ChakraLink
											as={Link}
											href="/calculator"
											fontSize="md"
											fontWeight="medium"
											color="white"
											_hover={{ color: textColorHover, textDecoration: 'none' }}
										>
											Loan Calculator
										</ChakraLink>
									</li>
								</ul>
							</nav>
						</div>

						<div className="header-right" style={{ marginRight: '20px' }}>
							<Box display={{ base: 'flex', xl: 'flex' }} px={3} borderColor={borderColor} alignItems="center" whiteSpace="nowrap">
								<Menu>
									<MenuButton
										as={Text}
										fontSize={['10px', '16px']}
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
										<MenuItem as="a" href="#">
											English
										</MenuItem>
										<MenuItem as="a" href="#">
											French
										</MenuItem>
										<MenuItem as="a" href="#">
											Chinese
										</MenuItem>
									</MenuList>
								</Menu>
							</Box>

							{/* Login Dropdown */}
							<Box position="relative">
								<Button
									onClick={isOpen ? onClose : onOpen}
									variant="ghost"
									px={2}
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
										// left={-50}
										right={-10}
										bg={bgColor1}
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

										<Divider />

										<Box p={4}>
											<Link href="/login">

												<Button
													onClick={() => {
														onClose();
														router.push('/login');
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

							<div className="top-button-mode" style={{ marginRight: '25px' }}>
								<ThemeSwitch />
							</div>

							<div className={`burger-icon d-flex flex-col justify-content-center align-items-center ${burgerIconClass}`} onClick={handleMobileMenu}>
								<span className="burger-icon-top" />
								<span className="burger-icon-mid" />
								<span className="burger-icon-bottom" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
