import { SiteHeader } from "@/components/site-header";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <SiteHeader />
        <main>{children}</main>
        <Toaster />
      </body>
    </>
  );
}
