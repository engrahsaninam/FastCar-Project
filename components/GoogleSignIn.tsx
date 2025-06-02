// components/GoogleSignIn.tsx
'use client'; // if using App Router

import { useEffect, useCallback } from 'react';
import { useGoogleSignUp } from '@/services/auth/useAuth';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                    }) => void;
                    renderButton: (
                        element: HTMLElement,
                        options: { theme: string; size: string }
                    ) => void;
                };
            };
        };
    }
}

const GoogleSignIn = () => {
    const router = useRouter();
    const toast = useToast();
    const googleSignUpMutation = useGoogleSignUp();

    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        try {
            await googleSignUpMutation.mutateAsync({ id_token: response.credential });
            toast({
                title: "Success",
                description: "Successfully signed in with Google",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            router.push('/');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.detail || "Failed to sign in with Google",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [googleSignUpMutation, toast, router]);

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: handleCredentialResponse,
            });

            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-btn')!,
                { theme: 'outline', size: 'large' }
            );
        };

        if (window.google) {
            initializeGoogleSignIn();
        } else {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script);
        }
    }, [handleCredentialResponse]);

    return <div id="google-signin-btn"></div>;
};

export default GoogleSignIn;
