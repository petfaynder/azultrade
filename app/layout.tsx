import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsent } from "@/components/ui/cookie-consent"
import { CompareProvider } from "@/contexts/CompareContext"
import JsonLd from "@/components/seo/JsonLd"
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

import { Viewport } from "next"

export const metadata: Metadata = {
  title: {
    default: "Azul Global Trade - Connecting Global Markets",
    template: "%s | Azul Global Trade",
  },
  description: "Discover premium industrial equipment, machinery, and products from trusted manufacturers worldwide. Your gateway to international trade and business growth.",
  metadataBase: new URL("https://www.azultrade.com"), 
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Azul Global Trade - Connecting Global Markets",
    description: "Your gateway to international trade and business growth.",
    url: "https://www.azultrade.com", 
    siteName: "Azul Global Trade",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className={inter.className}>
        <CompareProvider>
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
          <Toaster />
          <CookieConsent />
        </CompareProvider>
      </body>
    </html>
  )
}
