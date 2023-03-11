import { NavItem } from "@/types/nav"

import Image from "next/image"
import Link from "next/link"

export const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}.vercel.app`
  : "http://localhost:3000"

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
    {
      title: "Sites",
      href: "/sites",
    },
  ],
  links: {
    twitter: "https://twitter.com/titouanver",
    github: "https://github.com/titouv",
  },
}
