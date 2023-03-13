import "server-only";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import SupabaseListener from "@/supabase/components/supabase-listener";
import SupabaseProvider from "@/supabase/components/supabase-provider";
import { createClient } from "@/supabase/utils/server";
import { Inter } from "next/font/google";

// do not cache this layout
export const revalidate = 0;

export const metadata = {
  title: "Sitesmind",
  description: "GPT-3 powered chatbot for your website.",
  openGraph: {
    title: "Sitesmind",
    description: "GPT-3 powered chatbot for your website.",
    url: "https://www.sitesmind.com",
    siteName: "Sitesmind",
    images: [
      {
        url: "https://www.sitesmind/og.jpg",
        width: 1200,
        height: 630,
        alt: "OG Sitesmind",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Sitesmind",
    description: "GPT-3 powered chatbot for your website.",
    card: "summary_large_image",
    creator: "@titouanver",
    images: ["https://www.sitesmind.com/og.jpg"],
  },
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider session={session}>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
