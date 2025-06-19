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
import { useState, useRef } from 'react'
import { ShoppingCart, User, Heart, LogOut } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { MenuItemLink } from './Header1';
import { useOutsideClick } from '@chakra-ui/react';
import { UserAvatar } from '@/components/UserAvatar'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/app/i18/useLanguage';

export default function Header2({ scroll, isMobileMenu, handleMobileMenu, handleOffcanvas, isOffcanvas }: any) {
	const pathname = usePathname();
	const isMainPage = pathname === '/';
	const { isOpen, onOpen, onClose } = useDisclosure();
	const dropdownRef = useRef(null);
	const { t, i18n } = useTranslation();
	const { currentLanguage, changeLanguage } = useLanguage();

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
												{i18n.language === 'en' ? 'En' : i18n.language === 'fr' ? 'Fr' : 'Ch'} <ChevronDownIcon ml={1} />
											</MenuButton>
											<MenuList>
												<MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
												<MenuItem onClick={() => changeLanguage('fr')}>Français</MenuItem>
												<MenuItem onClick={() => changeLanguage('ch')}>Chinese</MenuItem>
											</MenuList>
										</Menu>
									</Box>

									{/* Login Dropdown */}
									<Box position="relative">
										<Button
											onClick={isOpen ? onClose : onOpen}
											variant="ghost"
											rightIcon={<ChevronDown size={16} />}
											leftIcon={<User size={20} />}
											_hover={{ color: textColorHover }}
											color={textColor}
											fontWeight="medium"
											h="40px"
										/>

										{isOpen && (
											<Box
												position="absolute"
												zIndex={2}
												top="100%"
												mt={2}
												right={0}
												bg={bgColor}
												borderRadius="lg"
												boxShadow="lg"
												border="1px solid"
												borderColor={borderColor}
												width="280px"
												overflow="hidden"
											>
												{user ? (
													<>
														<HStack w="full" p={3} spacing={3}>
															<UserAvatar size="sm" />
															<VStack align="start" spacing={0} flex={1}>
																<Text fontWeight="bold" fontSize="md" isTruncated maxW="200px">
																	{user.username}
																</Text>
															</VStack>
															<Box cursor="pointer" onClick={handleLogout}>
																<LogOut size={20} />
															</Box>
														</HStack>
													</>
												) : (
													<VStack p={3} spacing={2}>
														<Link href="/login" style={{ width: '100%' }}>
															<Button
																colorScheme="blue"
																width="full"
																fontSize="sm"
																fontWeight="medium"
															>
																{t('common.login')}
															</Button>
														</Link>
													</VStack>
												)}
											</Box>
										)}
									</Box>

									{/* Theme Switch */}
									<Box display={{ base: 'none', xl: 'flex' }} alignItems="center">
										<div className="top-button-mode">
											<ThemeSwitch />
										</div>
									</Box>

									{/* Mobile Menu Button */}
									<Box display={{ base: 'block', xl: 'none' }} ml={2}>
										<div
											className={`burger-icon ${burgerIconClass}`}
											onClick={handleMobileMenu}
											style={{ display: 'flex', alignItems: 'center', height: '40px' }}
										>
											<span className="burger-icon-top" />
											<span className="burger-icon-mid" />
											<span className="burger-icon-bottom" />
										</div>
									</Box>
								</div>
							</Flex>
						</div>
					</div>
				</header>
			</div>
		</>
	)
}