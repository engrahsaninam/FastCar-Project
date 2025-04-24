import { useColorModeValue } from '@chakra-ui/react';

/**
 * Common color values for checkout components to maintain consistency in light and dark modes
 */
export const useCheckoutColors = () => {
    return {
        // Background colors
        bgPrimary: useColorModeValue("white", "gray.800"),
        bgSecondary: useColorModeValue("gray.50", "gray.700"),
        bgTertiary: useColorModeValue("gray.100", "gray.600"),
        bgRedLight: useColorModeValue("red.50", "red.900"),
        bgGreenLight: useColorModeValue("green.50", "green.900"),
        bgBlueLight: useColorModeValue("blue.50", "blue.900"),

        // Text colors
        textPrimary: useColorModeValue("gray.900", "white"),
        textSecondary: useColorModeValue("gray.700", "gray.300"),
        textMuted: useColorModeValue("gray.600", "gray.400"),
        textLightMuted: useColorModeValue("gray.500", "gray.500"),

        // Brand colors
        brandPrimary: useColorModeValue("red.500", "red.400"),
        brandSecondary: useColorModeValue("red.600", "red.300"),

        // Border colors
        borderPrimary: useColorModeValue("gray.200", "gray.700"),
        borderSecondary: useColorModeValue("gray.100", "gray.600"),
        borderRedLight: useColorModeValue("red.100", "red.800"),
        borderGreenLight: useColorModeValue("green.100", "green.800"),

        // Interactive colors
        hoverBg: useColorModeValue("gray.50", "gray.700"),
        focusBorder: useColorModeValue("red.500", "red.400"),

        // Shadow effects
        boxShadowLight: useColorModeValue("sm", "none"),
        boxShadowMedium: useColorModeValue("md", "dark-lg"),

        // Status colors
        successColor: useColorModeValue("green.500", "green.400"),
        errorColor: useColorModeValue("red.500", "red.400"),
        warningColor: useColorModeValue("orange.500", "orange.400"),
        infoColor: useColorModeValue("blue.500", "blue.400"),
    };
};

/**
 * Generate a proper gradient string for light or dark mode
 */
export const useGradient = (direction: string, lightColors: string[], darkColors: string[]) => {
    const isLightMode = useColorModeValue(true, false);
    const colors = isLightMode ? lightColors : darkColors;

    return `linear(${direction}, ${colors.join(', ')})`;
};

export default useCheckoutColors; 