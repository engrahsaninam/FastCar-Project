"use client";
import {
	Box,
	Flex,
	VStack,
	Input,
	Button,
	Checkbox,
	Text,
	Heading,
	useColorModeValue,
	Link as ChakraLink,
	IconButton,
	HStack,
} from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";
import { useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
import Layout from "@/components/layout/Layout";

export default function Register() {
	const bg = useColorModeValue("gray.50", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.800", "white");
	const subTextColor = useColorModeValue("gray.500", "gray.400");
	const btnBg = useColorModeValue("red.500", "red.400");
	const btnColor = useColorModeValue("white", "gray.900");
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Layout footerStyle={1}>
			<Flex minH="100vh" align="center" justify="center" bg={bg}>
				<Box position="absolute" top={4} right={4}>
					<IconButton
						aria-label="Toggle color mode"
						icon={colorMode === "light" ? <Moon /> : <Sun />}
						onClick={toggleColorMode}
						variant="ghost"
					/>
				</Box>
				<Box
					bg={cardBg}
					borderRadius="lg"
					boxShadow="lg"
					borderWidth="1px"
					borderColor={borderColor}
					px={{ base: 4, md: 10 }}
					py={10}
					w="full"
					maxW="md"
				>
					<VStack spacing={6} align="stretch">
						<Box textAlign="center">
							<Text
								color={textColor}
								bg={useColorModeValue("gray.100", "gray.700")}
								px={4}
								py={2}
								fontWeight="bold"
								borderRadius="md"
								display="inline-block"
								fontSize="sm"
								mb={2}
							>
								Register
							</Text>
							<Heading size="md" color={textColor}>
								Create an Account
							</Heading>
						</Box>
						<VStack as="form" spacing={4} align="stretch">
							<Input
								placeholder="Email / Username"
								type="text"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
							/>
							<Input
								placeholder="Email"
								type="email"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
							/>
							<Input
								placeholder="Password"
								type="password"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
							/>
							<Input
								placeholder="Confirm Password"
								type="password"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
							/>
							<Flex align="center">
								<Checkbox colorScheme="" color={subTextColor} mr={2} border='gray'>
									I agree to terms and conditions
								</Checkbox>
							</Flex>
							<Button
								colorScheme="red"
								bg={btnBg}
								color={btnColor}
								w="full"
								type="submit"
								rightIcon={
									<svg width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path
											d="M8 15L15 8L8 1M15 8L1 8"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								}
							>
								Sign up
							</Button>
						</VStack>
						<Text color={subTextColor} fontSize="md" textAlign="center">
							Or connect with your social account
						</Text>
						<HStack spacing={4} justify="center">
							<Button
								leftIcon={
									<img
										src="/assets/imgs/template/popup/google.svg"
										alt="Google"
										width={20}
									/>
								}
								variant="outline"
								colorScheme="gray"
								as={NextLink}
								href="#"
							>
								Sign up with Google
							</Button>
							<Button
								variant="outline"
								colorScheme="gray"
								as={NextLink}
								href="#"
								p={2}
							>
								<img
									src="/assets/imgs/template/popup/facebook.svg"
									alt="Facebook"
									width={20}
								/>
							</Button>
							<Button
								variant="outline"
								colorScheme="gray"
								as={NextLink}
								href="#"
								p={2}
							>
								<img
									src="/assets/imgs/template/popup/apple.svg"
									alt="Apple"
									width={20}
								/>
							</Button>
						</HStack>
						<Text color={subTextColor} fontSize="sm" textAlign="center" mt={8}>
							Already have an account?{" "}
							<ChakraLink as={NextLink} href="/login" color={textColor}>
								Login Here!
							</ChakraLink>
						</Text>
					</VStack>
				</Box>
			</Flex>
		</Layout>
	);
}