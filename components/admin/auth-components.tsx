import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Text,
    Container,
    Heading,
} from '@chakra-ui/react';

// Types
interface User {
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// JWT Token Manager
const TokenManager = {
    getAccessToken: () => localStorage.getItem('accessToken'),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },
    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },
    refreshAccessToken: async () => {
        try {
            const refreshToken = TokenManager.getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token');

            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) throw new Error('Token refresh failed');

            const { accessToken, newRefreshToken } = await response.json();
            TokenManager.setTokens(accessToken, newRefreshToken);
            return accessToken;
        } catch (error) {
            TokenManager.clearTokens();
            throw error;
        }
    }
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const accessToken = TokenManager.getAccessToken();
            if (!accessToken) {
                setLoading(false);
                return;
            }

            const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
            if (adminCredentials.email) {
                setUser({ email: adminCredentials.email, role: 'admin' });
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            TokenManager.clearTokens();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');

            if (email === adminCredentials.email && password === adminCredentials.password) {
                const accessToken = 'temp_access_token_' + Date.now();
                const refreshToken = 'temp_refresh_token_' + Date.now();

                TokenManager.setTokens(accessToken, refreshToken);
                setUser({ email: adminCredentials.email, role: 'admin' });
                router.push('/admin');
                return true;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            toast({
                title: 'Login Failed',
                description: 'Invalid email or password',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            throw error;
        }
    };

    const logout = () => {
        TokenManager.clearTokens();
        setUser(null);
        router.push('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook for using Auth Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

// Login Form Component
export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Container maxW="md" py={10}>
            <VStack spacing={8}>
                <Heading>Admin Login</Heading>
                <Box w="100%" as="form" onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            colorScheme="red"
                            width="100%"
                            mt={4}
                        >
                            Login
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);

    // if (loading) {
    //     return (
    //         <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
    //             {/* <Text>Loading...</Text> */}
    //         </Box>
    //     );
    // }

    return user ? <>{children}</> : null;
};

// API Client
export const apiClient = {
    fetch: async (url: string, options: RequestInit = {}) => {
        let accessToken = TokenManager.getAccessToken();

        if (accessToken) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${accessToken}`
            };
        }

        try {
            const response = await fetch(url, options);

            if (response.status === 401) {
                try {
                    accessToken = await TokenManager.refreshAccessToken();
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${accessToken}`
                    };
                    return fetch(url, options);
                } catch (error) {
                    TokenManager.clearTokens();
                    window.location.href = '/admin/login';
                    throw error;
                }
            }

            return response;
        } catch (error) {
            throw error;
        }
    }
}; 