"use client";
import {
    Box,
    Flex,
    VStack,
    Input,
    Button,
    Text,
    Heading,
    useColorModeValue,
    IconButton,
    InputGroup,
    InputRightElement,
    Icon,
} from "@chakra-ui/react";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import { useColorMode } from "@chakra-ui/react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useResetPassword } from "@/services/auth/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get("token") || null;

    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const subTextColor = useColorModeValue("gray.500", "gray.400");
    const btnBg = useColorModeValue("red.500", "red.400");
    const btnColor = useColorModeValue("white", "gray.900");
    const { colorMode, toggleColorMode } = useColorMode();
    const resetPasswordMutation = useResetPassword();
    const toast = useToast();

    useEffect(() => {
        if (!token) {
            toast({
                title: "Error",
                description: "Invalid or missing reset token",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            router.push("/login");
        }
    }, [token, router, toast]);

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    }, [password, confirmPassword]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast({
                title: "Validation Error",
                description: "Please fill in all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Validation Error",
                description: "Passwords do not match",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!token) {
            toast({
                title: "Error",
                description: "Invalid reset token",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        resetPasswordMutation.mutate(
            { password, token },
            {
                onSuccess: () => {
                    toast({
                        title: "Success",
                        description: "Password has been reset successfully",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    router.push("/login");
                },
                onError: (error: any) => {
                    toast({
                        title: "Error",
                        description: error?.response?.data?.detail || "Failed to reset password",
                        status: "error",
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
                                Reset Password
                            </Text>
                            <Heading size="md" color={textColor}>
                                Create New Password
                            </Heading>
                        </Box>
                        <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit}>
                            <InputGroup>
                                <Input
                                    placeholder="New Password"
                                    type={showPassword ? "text" : "password"}
                                    variant="filled"
                                    bg={useColorModeValue("gray.100", "gray.700")}
                                    color={textColor}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        icon={showPassword ? <EyeOff /> : <Eye />}
                                        variant="ghost"
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                </InputRightElement>
                            </InputGroup>

                            <InputGroup>
                                <Input
                                    placeholder="Confirm New Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    variant="filled"
                                    bg={useColorModeValue("gray.100", "gray.700")}
                                    color={textColor}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    borderColor={passwordError ? "red.500" : undefined}
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        icon={showConfirmPassword ? <EyeOff /> : <Eye />}
                                        variant="ghost"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            {passwordError && (
                                <Text color="red.500" fontSize="sm">
                                    {passwordError}
                                </Text>
                            )}

                            <Button
                                colorScheme="red"
                                bg={btnBg}
                                color={btnColor}
                                w="full"
                                type="submit"
                                isLoading={resetPasswordMutation.isPending}
                                loadingText="Resetting password..."
                            >
                                Reset Password
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            </Flex>
        </Layout>
    );
}

