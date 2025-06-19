'use client'

import { Provider } from 'react-redux'
import { store } from './i18/Store'
import i18n from './i18/i18'
import { I18nextProvider } from 'react-i18next'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './theme'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <ChakraProvider theme={theme}>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    {children}
                </ChakraProvider>
            </I18nextProvider>
        </Provider>
    )
} 