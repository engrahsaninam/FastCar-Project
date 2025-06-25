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
import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/app/i18/useLanguage';

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
	const router = useRouter();
	const isMainPage = pathname === '/';
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user } = useAuth();

	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showSignupModal, setShowSignupModal] = useState(false);

	const lightTextColor = useColorModeValue('#171923', '#F7FAFC');
	const lightTextColorHover = useColorModeValue('#2D3748', '#EDF2F7');
	const lightBorderColor = useColorModeValue('#EDF2F7', 'whiteAlpha.300');
	const lightBgColor = useColorModeValue('white', '#F7FAFC');
	const lightBurgerIconClass = useColorModeValue('burger-icon-black', 'burger-icon-white');

	const textColor = lightTextColor;
	const textColorHover = lightTextColorHover;
	const borderColor = lightBorderColor;
	const bgColor = useColorModeValue('white', 'black');
	const bgColor1 = useColorModeValue('white', '#171923');
	const burgerIconClass = lightBurgerIconClass;

	const [resolvedBgColor] = useToken('colors', [bgColor]);

	const dropdownRef = useRef<HTMLDivElement>(null);
	useOutsideClick({
		ref: dropdownRef,
		handler: () => {
			if (isOpen) onClose();
		},
	});
	const { t } = useTranslation();
	const { currentLanguage, changeLanguage } = useLanguage();
	return (
		<>
			{/* <Box display={{ base: 'none', md: 'block' }}> */}
			<header
				style={{ backgroundColor: bgColor }}
				className={`header header-fixed sticky-bar ${scroll ? 'stick' : ''}`}
			>
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

							<div className="header-nav whitespace-nowrap">
								<nav className="nav-main-menu">
									<ul className="main-menu">
										<li>
											<ChakraLink as={Link} href="/cars" fontSize="md" fontWeight="medium" color="white">
												{t('common.buy')}
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
												{t('common.dailyDeals')}
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
												{t('common.howItWorks')}
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
												{t('common.reviews')}
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
												{t('common.loanCalculator')}
											</ChakraLink>
										</li>
									</ul>
								</nav>
							</div>

							<div className="header-right" style={{ marginRight: '20px' }}>
								<Box display={{ base: 'none', xl: 'flex' }} px={3} alignItems="center" whiteSpace="nowrap">
									<Menu>
										<MenuButton
											as={Button}
											variant="ghost"
											fontSize={['10px', '16px']}
											fontWeight="medium"
											color={textColor}
											_hover={{ color: textColorHover }}
											cursor="pointer"
											display="flex"
											alignItems="center"
										>
											{localStorage.getItem('i18nextLng') === 'en' ? 'En' : localStorage.getItem('i18nextLng') === 'sp' ? 'Sp' : 'Gr'} <ChevronDownIcon ml={1} />
										</MenuButton>
										<MenuList>
											<MenuItem onClick={() => changeLanguage('en')}>
												{localStorage.getItem('i18nextLng') === 'en' ? 'English' : 'English'}
											</MenuItem>
											<MenuItem onClick={() => changeLanguage('sp')}>
												{localStorage.getItem('i18nextLng') === 'sp' ? 'Spanish' : 'Spanish'}
											</MenuItem>
											<MenuItem onClick={() => changeLanguage('gr')}>
												{localStorage.getItem('i18nextLng') === 'gr' ? 'German' : 'German'}
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
										// display={{ base: 'none', xl: 'flex' }}
										marginRight={[10, 0, 0]}
										fontWeight="medium"
									/>

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
											{user && (
												<HStack w="full" mb={2} spacing={3} padding={2}>
													<UserAvatar size="sm" />
													<VStack align="start" spacing={0}>
														<HStack w="full" mb={2} spacing={3} display='flex' justifyContent='space-between'>
															<Text fontWeight="bold" fontSize="md">{user.username}</Text>
															<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
														</HStack>


														<Text color="gray.500" fontSize="xs" noOfLines={1}>{user.email}</Text>
													</VStack>
												</HStack>
											)}
											<VStack align="start" spacing={0} p={4}>
												<MenuItemLink label={t('common.favoriteCars')} Icon={Heart} href="/favourite-cars" />
												<MenuItemLink label={t('common.ordersInProgress')} Icon={ShoppingCart} href="/order-in-progress" />
											</VStack>
											<HStack justify="center" align="center" p={0} m={0} spacing={1}>
												<Box display={{ base: 'block', xl: 'none' }} alignItems="center" whiteSpace="nowrap" p={0} m={0}>
													<Menu>
														<MenuButton
															as={Button}
															variant="ghost"
															fontSize="16px"
															fontWeight="medium"
															color={textColor}
															_hover={{ color: textColorHover }}
															cursor="pointer"
															display="flex"
															alignItems="center"
														>
															{localStorage.getItem('i18nextLng') === 'en' ? 'En' : localStorage.getItem('i18nextLng') === 'sp' ? 'Sp' : 'Gr'} <ChevronDownIcon />
														</MenuButton>
														<MenuList>
															<MenuItem onClick={() => changeLanguage('en')}>{localStorage.getItem('i18nextLng') === 'en' ? 'English' : 'English'}</MenuItem>
															<MenuItem onClick={() => changeLanguage('sp')}>{localStorage.getItem('i18nextLng') === 'sp' ? 'Spanish' : 'Spanish'}</MenuItem>
															<MenuItem onClick={() => changeLanguage('gr')}>{localStorage.getItem('i18nextLng') === 'gr' ? 'German' : 'German'}</MenuItem>
														</MenuList>
													</Menu>
												</Box>
												<Box display={{ base: 'block', xl: 'none' }} alignItems="center" whiteSpace="nowrap" p={0} m={0} ml={1}>
													<Box className="top-button-mode">
														<ThemeSwitch />
													</Box>
												</Box>
											</HStack>

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
														// leftIcon={<UserAvatar size="sm" />}
														fontSize="15px"
														fontWeight="medium"
													>
														Login
													</Button>
												</Link>
												<Text mt={3} fontSize="sm" color="gray.500" textAlign="center">
													{t('auth.noAccount')}
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
															{t('auth.register')}
														</Button>
													</Link>
												</Text>
											</Box>
										</Box>
									)}
								</Box>
								<Box display={{ base: 'none', xl: 'flex' }} px={3} alignItems="center" whiteSpace="nowrap">
									<div className="top-button-mode" style={{ marginRight: '25px' }}>
										<ThemeSwitch />
									</div>
								</Box>
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
			{/* </Box>
			<Box display={{ base: 'block', md: 'none' }}>
				<header
					style={{ backgroundColor: bgColor }}
					className={`header header-fixed sticky-bar ${scroll ? 'stick' : ''}`}
				>
					<div className="container-fluid">
						<Box className="main-header" display={{ base: 'flex', md: 'flex' }} alignItems="center" justifyContent="space-between">
							<div className={` ${burgerIconClass}`} onClick={handleMobileMenu}>
								<span className="burger-icon-top" />
								<span className="burger-icon-mid" />
								<span className="burger-icon-bottom" />
							</div>
							<Box display={{ base: 'flex', md: 'flex' }} alignItems="center" justifyContent="center">
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
							</Box>
							<Box display={{ base: 'flex', md: 'flex' }} alignItems="flex-end" justifyContent="flex-end">
									<div className="top-button-mode" style={{ marginRight: '25px' }}>
										<ThemeSwitch />
									</div>
							</Box>

						</Box>
					</div>
				</header>
			</Box> */}
		</>
	);
}
