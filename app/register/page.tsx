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
	useToast,
} from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";
import { useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
import Layout from "@/components/layout/Layout";
import { useRegister } from "@/services/auth/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function Register() {
	const bg = useColorModeValue("gray.50", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.800", "white");
	const subTextColor = useColorModeValue("gray.500", "gray.400");
	const btnBg = useColorModeValue("red.500", "red.400");
	const btnColor = useColorModeValue("white", "gray.900");
	const { colorMode, toggleColorMode } = useColorMode();
	const toast = useToast();
	const router = useRouter();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirm_password: "",
		terms: false,
	});

	const registerMutation = useRegister();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirm_password) {
			toast({
				title: "Error",
				description: "Passwords do not match",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (!formData.terms) {
			toast({
				title: "Error",
				description: "Please accept the terms and conditions",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			await registerMutation.mutateAsync(formData);
			toast({
				title: "Success",
				description: "Registration successful!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			router.push("/login");
		} catch (error: any) {
			console.log(error)
			toast({
				title: "Error",
				description: error.response?.data?.detail || "Registration failed",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

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
						<VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
							<Input
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								placeholder="Username"
								type="text"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
							/>
							<Input
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="Email"
								type="email"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
							/>
							<Input
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="Password"
								type="password"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
							/>
							<Input
								name="confirm_password"
								value={formData.confirm_password}
								onChange={handleInputChange}
								placeholder="Confirm Password"
								type="password"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
							/>
							<Flex align="center">
								<Checkbox
									name="terms"
									isChecked={formData.terms}
									onChange={handleInputChange}
									colorScheme=""
									color={subTextColor}
									mr={2}
									border='gray'
								>
									I agree to terms and conditions
								</Checkbox>
							</Flex>
							<Button
								colorScheme="red"
								bg={btnBg}
								color={btnColor}
								w="full"
								type="submit"
								isLoading={registerMutation.isPending}
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
							<GoogleSignIn />
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