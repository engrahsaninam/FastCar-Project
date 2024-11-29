"use client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// Optional: Extend the theme to customize your app
const theme = extendTheme({
  // Add your theme customizations here
});

export function Providers({ children }) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  );
}