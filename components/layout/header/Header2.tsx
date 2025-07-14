'use client'
import dynamic from 'next/dynamic'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link as ChakraLink, Text, Flex, HStack, useColorModeValue, useToken, Menu, MenuButton, MenuList, MenuItem, Box, useDisclosure, Button, Divider, VStack } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect } from 'react'
import { ShoppingCart, User, Heart, LogOut } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { MenuItemLink } from './Header1';
import { useOutsideClick } from '@chakra-ui/react';
import { UserAvatar } from '@/components/UserAvatar'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/app/i18/useLanguage';

type LanguageCode = 'en' | 'es' | 'de';

type LanguageInfo = {
	code: LanguageCode;
	label: string;
	short: string;
};

type LanguageMap = {
	[key in LanguageCode]: LanguageInfo;
};

export default function Header2({ scroll, isMobileMenu, handleMobileMenu, handleOffcanvas, isOffcanvas }: any) {
	const pathname = usePathname();
	const isMainPage = pathname === '/';
	const { isOpen, onOpen, onClose } = useDisclosure();
	const dropdownRef = useRef(null);
	const { t, i18n } = useTranslation();
	const { currentLanguage, changeLanguage } = useLanguage();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const languageMap: LanguageMap = {
		en: { code: 'en', label: 'English', short: 'En' },
		es: { code: 'es', label: 'Spanish', short: 'Es' },
		de: { code: 'de', label: 'German', short: 'De' }
	};

	// Get current language safely
	const getCurrentLanguage = (): LanguageCode => {
		if (!mounted) return 'en';
		const lang = i18n.language || 'en';
		return (lang in languageMap ? lang : 'en') as LanguageCode;
	};

	const currentLang = getCurrentLanguage();
	const currentLanguageInfo = languageMap[currentLang];

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
	const router = useRouter()
	const { user } = useAuth()

	const handleLogout = () => {
		// Implement the logout logic here
		console.log('Logging out');
	};

	return (
		<>
			<div style={{ backgroundColor: resolvedBgColor }}>
				<header style={{ backgroundColor: resolvedBgColor }} className={`header sticky-bar ${isMainPage ? 'header-home-2' : ''} ${scroll ? 'stick' : ''}`}>
					<div className="container-fluid">
						<div className="main-header">
							<Flex className="header-left" align="center" justify="space-between" w="full" flexWrap="nowrap">
								<Flex align="center" flex="1" minW="0">
									<div className="header-logo" style={{ display: 'none' }}>
										<Link className="d-flex" href="/">
											<img className="light-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
											<img className="dark-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
										</Link>
									</div>
									<Box className="header-logo" display={{ base: 'block', md: 'block' }} flexShrink={0}>
										<Link className="d-flex" href="/">
											<img className="light-mode" alt="Fast4Car" src="/assets/imgs/template/logo-d.svg" />
											<img className="dark-mode" alt="Fast4Car" src="/assets/imgs/template/logo-w.svg" />
										</Link>
									</Box>
									<Box className="header-nav" flex="1" minW="0" ml={4}>
										<nav className="nav-main-menu">
											<Flex as="ul" className="main-menu" listStyleType="none" m={0} p={0} gap={6} flexWrap="nowrap" overflow="hidden">
												<Box as="li" flexShrink={0}>
													<ChakraLink as={Link} href="/cars" fontSize="md" fontWeight="medium" color="white" whiteSpace="nowrap">
														{t('common.buy')}
													</ChakraLink>
												</Box>
												<Box as="li" flexShrink={0}>
													<ChakraLink
														as={Link}
														href="/deals"
														fontSize="md"
														fontWeight="medium"
														color="white"
														whiteSpace="nowrap"
														_hover={{ color: textColorHover, textDecoration: 'none' }}
													>
														{t('common.dailyDeals')}
													</ChakraLink>
												</Box>
												<Box as="li" flexShrink={0}>
													<ChakraLink
														as={Link}
														href="/how-it-works"
														fontSize="md"
														fontWeight="medium"
														color="white"
														whiteSpace="nowrap"
														_hover={{ color: textColorHover, textDecoration: 'none' }}
													>
														{t('common.howItWorks')}
													</ChakraLink>
												</Box>
												<Box as="li" flexShrink={0}>
													<ChakraLink
														as={Link}
														href="/reviews"
														fontSize="md"
														fontWeight="medium"
														color="white"
														whiteSpace="nowrap"
														_hover={{ color: textColorHover, textDecoration: 'none' }}
													>
														{t('common.reviews')}
													</ChakraLink>
												</Box>
												<Box as="li" flexShrink={0}>
													<ChakraLink
														as={Link}
														href="/calculator"
														fontSize="md"
														fontWeight="medium"
														color="white"
														whiteSpace="nowrap"
														_hover={{ color: textColorHover, textDecoration: 'none' }}
													>
														{t('common.loanCalculator')}
													</ChakraLink>
												</Box>
											</Flex>
										</nav>
									</Box>
								</Flex>

								<div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									{/* Language Selector */}
									<Box display={{ base: 'none', xl: 'flex' }} alignItems="center">
										<Menu>
											<MenuButton
												as={Button}
												variant="ghost"
												fontSize="sm"
												fontWeight="medium"
												color={textColor}
												_hover={{ color: textColorHover }}
												cursor="pointer"
												display="flex"
												alignItems="center"
												h="40px"
											>
												{currentLanguageInfo.short} <ChevronDownIcon ml={1} />
											</MenuButton>
											<MenuList>
												{Object.values(languageMap).map((lang) => (
													<MenuItem
														key={lang.code}
														onClick={() => changeLanguage(lang.code)}
													>
														{lang.label}
													</MenuItem>
												))}
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
												bg={bgColor}
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
																{localStorage.getItem('i18nextLng') === 'en' ? 'En' : localStorage.getItem('i18nextLng') === '' ? 'Es' : 'De'} <ChevronDownIcon />
															</MenuButton>
															<MenuList>
																<MenuItem onClick={() => changeLanguage('en')}>{localStorage.getItem('i18nextLng') === 'en' ? 'English' : 'English'}</MenuItem>
																<MenuItem onClick={() => changeLanguage('fr')}>{localStorage.getItem('i18nextLng') === 'es' ? 'Spanish' : 'Spanish'}</MenuItem>
																<MenuItem onClick={() => changeLanguage('ch')}>{localStorage.getItem('i18nextLng') === 'de' ? 'German' : 'German'}</MenuItem>
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

									{/* Theme Switch */}
									<Box display={{ base: 'none', xl: 'flex' }} px={3} alignItems="center" whiteSpace="nowrap">
										<div className="top-button-mode" style={{ marginRight: '25px' }}>
											<ThemeSwitch />
										</div>
									</Box>

									{/* Mobile Menu Button */}
									<div className={`burger-icon ${burgerIconClass}`} onClick={handleMobileMenu}>
										<span className="burger-icon-top" />
										<span className="burger-icon-mid" />
										<span className="burger-icon-bottom" />
									</div>
								</div>
							</Flex>
						</div>
					</div>
				</header>
			</div>
		</>
	)
}