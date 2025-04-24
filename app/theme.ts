// src/theme.ts
'use client';

import { background, extendTheme } from '@chakra-ui/react';

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
    heading: `var(--urbanist)`,
    body: `var(--urbanist)`,
    inter: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      '*': {
        fontFamily: `var(--urbanist)`,
      },
      body: {
        bg: "gray.100",
      }
    },
  },
});

export default theme;

