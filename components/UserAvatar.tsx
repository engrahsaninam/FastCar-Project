'use client';

import { Avatar, AvatarProps, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

interface UserAvatarProps extends Omit<AvatarProps, 'name'> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const UserAvatar = ({ size = 'md', ...props }: UserAvatarProps) => {
    const { user } = useAuth();
    const bg = useColorModeValue('red.500', 'red.400');
    console.log("user", user)
    // If user or username is missing, show default avatar
    if (!user || !user.username) {
        return (
            <Avatar
                size={size}
                bg={bg}
                {...props}
            />
        );
    }

    // Get initials from username
    const initials = user.username
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <Avatar
            size={size}
            name={user.username}
            bg={bg}
            {...props}
        >
            {initials}
        </Avatar>
    );
}; 