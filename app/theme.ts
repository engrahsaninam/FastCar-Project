// src/theme.ts
'use client';

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    darkBg: "#1E2934FF",
    darkCard: "#22303f",
    darkInput: "#2d3b4a",
    darkBorder: "#374151",
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

export default theme;