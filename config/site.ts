import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    docs: string
  }
}

export const siteConfig: SiteConfig = {
  name: "SnapFix",
  description:
    "The Fast and Easy Way to Enhance Your Photos",
  mainNav: [
    // {
    //   title: "Home",
    //   href: "/",
    // },
  ],
  links: {
    twitter: "https://twitter.com/deifosv",
    github: "https://github.com/deifos/snapfix",
    docs: "https://github.com/deifos/snapfix",
  },
}
