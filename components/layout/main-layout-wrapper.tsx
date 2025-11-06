"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <>
      {!isAdminPage && <Header />}
      <PageTransitionWrapper>{children}</PageTransitionWrapper>
      {!isAdminPage && <Footer />}
    </>
  )
}
