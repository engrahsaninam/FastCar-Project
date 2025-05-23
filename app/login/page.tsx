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
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";
import { useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
import Layout from "@/components/layout/Layout";
// import { useLogin } from "@/services/auth/useAuth";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useLogin, useForgotPassword } from "@/services/auth/useAuth";
import { useRouter } from "next/navigation";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const router = useRouter()
	const { isOpen, onOpen, onClose } = useDisclosure();
	const bg = useColorModeValue("gray.50", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.800", "white");
	const subTextColor = useColorModeValue("gray.500", "gray.400");
	const btnBg = useColorModeValue("red.500", "red.400");
	const btnColor = useColorModeValue("white", "gray.900");
	const { colorMode, toggleColorMode } = useColorMode();
	const { mutate, isPending } = useLogin();
	const forgotPasswordMutation = useForgotPassword();
	const toast = useToast();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			toast({
				title: 'Validation Error',
				description: 'Please fill in all fields',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		mutate(
			{ email, password },
			{
				onSuccess: (data) => {
					// console.log("sucess login",)
					if (rememberMe) {
						localStorage.setItem('rememberMe', 'true');
					}
					console.log(data)
					localStorage.setItem('token', data.access_token);

					toast({
						title: 'Login successful',
						status: 'success',
						duration: 3000,
						isClosable: true,
					});
					// You might want to add navigation here
					router.push('/');
				},
				onError: (error: any) => {
					console.log(error)
					toast({
						title: 'Login failed',
						description: error?.response?.data?.detail || 'An error occurred.',
						status: 'error',
						duration: 3000,
						isClosable: true,
					});
				},
			}
		);
	};

	const handleForgotPassword = (e: React.FormEvent) => {
		e.preventDefault();
		if (!forgotEmail) {
			toast({
				title: 'Validation Error',
				description: 'Please enter your email address',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		forgotPasswordMutation.mutate(
			{ email: forgotEmail },
			{
				onSuccess: (data) => {
					console.log(data)
					toast({
						title: 'Success',
						description: data?.message || 'Password reset instructions have been sent to your email',
						status: 'success',
						duration: 3000,
						isClosable: true,
					});
					onClose();
					setForgotEmail('');
				},
				onError: (error: any) => {
					toast({
						title: 'Error',
						description: error?.response?.data?.detail || 'Failed to send reset instructions',
						status: 'error',
						duration: 3000,
						isClosable: true,
					});
				},
			}
		);
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
								Sign in
							</Text>
							<Heading size="md" color={textColor}>
								Welcome back
							</Heading>
						</Box>
						<VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
							<Input
								placeholder="Email / Username"
								type="text"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<Input
								placeholder="****************"
								type="password"
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<Flex justify="space-between" align="center">
								<Checkbox
									colorScheme="red"
									color={subTextColor}
									border='gray'
									isChecked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
								>
									Remember me
								</Checkbox>
								<ChakraLink
									onClick={onOpen}
									color={subTextColor}
									fontSize="sm"
									cursor="pointer"
								>
									Forgot password?
								</ChakraLink>
							</Flex>
							<Button
								colorScheme="red"
								bg={btnBg}
								color={btnColor}
								w="full"
								type="submit"
								isLoading={isPending}
								loadingText="Signing in..."
								rightIcon={
									<svg width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								}
							>
								Sign in
							</Button>
						</VStack>

						<Text color={subTextColor} fontSize="sm" textAlign="center" mt={8}>
							Don't have an account?{" "}
							<ChakraLink as={NextLink} href="/register" color={textColor}>
								Register Here!
							</ChakraLink>
						</Text>
					</VStack>
				</Box>
			</Flex>

			{/* Forgot Password Modal */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg={cardBg}>
					<ModalHeader color={textColor}>Forgot Password</ModalHeader>
					<ModalCloseButton color={textColor} />
					<form onSubmit={handleForgotPassword}>
						<ModalBody>
							<Text color={subTextColor} mb={4}>
								Enter your email address and we'll send you instructions to reset your password.
							</Text>
							<Input
								placeholder="Enter your email"
								type="email"
								value={forgotEmail}
								onChange={(e) => setForgotEmail(e.target.value)}
								variant="filled"
								bg={useColorModeValue("gray.100", "gray.700")}
								color={textColor}
								required
							/>
						</ModalBody>

						<ModalFooter>
							<Button variant="ghost" mr={3} onClick={onClose}>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								bg={btnBg}
								color={btnColor}
								type="submit"
								isLoading={forgotPasswordMutation.isPending}
							>
								Send Reset Link
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</Layout>
	);
}