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
    heading: `var(--font-euclid)`,
    body: `var(--font-euclid)`,
  },
  styles: {
    global: {
      '*': {
        fontFamily: `var(--font-euclid)`,
      },
    },
  },
});

export default theme;