import { SiteHeader } from "@/components/site-header"
import SiteFooter from "./site-footer"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex">{children}</main>
      <SiteFooter />
    </>
  )
}
