// app/layout.tsx
import type { Metadata } from "next"
import "@/node_modules/react-modal-video/css/modal-video.css"
import "/public/assets/css/main.css"
import "/public/assets/css/globals.css"
import { Providers } from './providers'
import logo from "@/public/assets/imgs/template/logo-d.svg"
// import { appWithTranslation } from 'next-i18next'
import ReactQueryProvider from "@/services/ReactQueryProvider"
import { AuthProvider } from "@/context/AuthContext"
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Fast4Car - #1 Import Car Marketplace",
  description: "Fast4Car is the premier destination for import car buyers and sellers. Browse our extensive inventory of quality import vehicles, compare prices, and find your perfect car.",
  keywords: "import cars, car marketplace, buy cars online, foreign cars, luxury imports, Fast4Car, car dealership",
  openGraph: {
    title: "Fast4Car - #1 Import Car Marketplace",
    description: "Find and purchase quality import cars on Fast4Car, the leading online marketplace for import vehicles",
    url: "https://fast4car.com",
    siteName: "Fast4Car",
    images: [
      {
        url: logo.src,
        width: 1200,
        height: 630,
        alt: "Fast4Car Marketplace Logo"
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fast4Car - #1 Import Car Marketplace",
    description: "Find and purchase quality import cars on Fast4Car, the leading online marketplace for import vehicles",
    images: [logo.src],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  viewport: "width=device-width, initial-scale=1.0",
  category: "Automotive",
  alternates: {
    canonical: "https://fast4car.com",
  },
  authors: [{ name: "Fast4Car Team" }],
  creator: "Fast4Car",
  publisher: "Fast4Car",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://fast4car.com" />
      </head>
      <body className={`font-euclid ${inter.className}`}>
        <Providers>
          <ReactQueryProvider>
            <AuthProvider>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  )
}