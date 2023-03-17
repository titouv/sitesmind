import { NavItem } from "@/types/nav";

export const BASE_URL = "http://" + process.env.NEXT_PUBLIC_VERCEL_URL;

export function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

interface SiteConfig {
  name: string;
  description: string;
  mainNav: NavItem[];
  links: {
    twitter: string;
    github: string;
    docs: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Sitesmind",
  description: "GPT-3 powered chatbot for your website.",
  mainNav: [
    //   title: "Home",
    // {
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
    {
      title: "Docs",
      href: "https://sitesmind.notion.site/Sitesmind-a88845c165fa45ce8d85fd431d3555e0",
    },
  ],
  links: {
    twitter: "https://twitter.com/titouanver",
    github: "https://github.com/titouv",
    docs: "https://sitesmind.notion.site/Sitesmind-a88845c165fa45ce8d85fd431d3555e0",
  },
};
