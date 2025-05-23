'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentUser } from '@/services/auth/useAuth';

interface User {
    id: string;
    username: string;
    email: string;
    // Add other user properties as needed
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: any;
    refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: false,
    error: null,
    refetchUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
    const { data:useri, isLoading, error, refetch } = useCurrentUser();
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState<User | null>(null);

console.log(useri)
    useEffect(() => {
        if (useri) {
            // Ensure data matches User interface
            const userData = useri as unknown as User;
            setUser(userData);
        }
    }, [useri]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            refetch().finally(() => {
                setIsInitialized(true);
            });
        } else {
            setIsInitialized(true);
        }
    }, [refetch]);

    const value: AuthContextType = {
        user,
        isLoading: isLoading || !isInitialized,
        error,
        refetchUser: async () => {
            await refetch();
        },
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 