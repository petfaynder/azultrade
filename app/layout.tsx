"use client"
import type React from "react"
import { usePathname } from "next/navigation"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsent } from "@/components/ui/cookie-consent"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isAdminPage && <Header />}
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
        {!isAdminPage && <Footer />}
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  )
}
