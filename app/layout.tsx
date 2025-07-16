import type React from "react"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsent } from "@/components/ui/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Azul Global Trade - Turkish Export Excellence",
  description:
    "Leading Turkish export company connecting premium manufacturers with global markets. Quality agricultural equipment, industrial machinery, and specialty products to 50+ countries worldwide.",
  keywords: "turkish export, agricultural equipment, industrial machinery, global trade, turkish manufacturers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
        <Footer />
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  )
}
