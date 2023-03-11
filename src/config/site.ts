import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    // docs: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Chatbot GPT",
  description: "GPT-3 powered chatbot for your website.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Try",
      href: "/try",
    },
  ],
  links: {
    twitter: "https://twitter.com/titouanver",
    github: "https://github.com/titouv",
  },
}
