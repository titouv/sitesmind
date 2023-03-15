import { NavItem } from "@/types/nav";
export const BASE_URL = "http://" + process.env.NEXT_PUBLIC_VERCEL_URL;

interface SiteConfig {
  name: string;
  description: string;
  mainNav: NavItem[];
  links: {
    twitter: string;
    github: string;
    // docs: string
  };
}

export const siteConfig: SiteConfig = {
  name: "Sitesmind",
  description: "GPT-3 powered chatbot for your website.",
  mainNav: [
    // {
    //   title: "Home",
    //   href: "/",
    //   requireLogin: false,
    // },
    {
      title: "Create",
      href: "/create",
      requireLogin: true,
    },
    {
      title: "Bots",
      href: "/bots",
      requireLogin: true,
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
  ],
  links: {
    twitter: "https://twitter.com/titouanver",
    github: "https://github.com/titouv",
  },
};
