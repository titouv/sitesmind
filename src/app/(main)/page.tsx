import { ChatbotWireframe } from "@/app/(main)/chatbot-wireframe";
import { LoginButton } from "@/components/login-button";
import { Link } from "@/components/ui/link";
import { createClient } from "@/supabase/utils/server";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function Home({
  searchParams,
}: {
  searchParams: { redirect: string };
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      {searchParams.redirect && (
        <div className="container my-2 w-full rounded-xl  bg-slate-100 py-3">
          <span>Please login before using</span>
        </div>
      )}
      <section className="container relative grid items-center gap-6 pt-6 pb-8 md:grid-cols-2 md:py-10">
        <div className="absolute inset-x-0 top-20 bottom-0 -z-10  w-1/2 rounded-full bg-blue-500/50 blur-[100px]" />
        <div className="z-10 mt-10 flex flex-col items-start gap-2 md:mt-20">
          <span className="mb-4 rounded-md border border-slate-600 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-2xl md:mb-8">
            This is an alpha version
          </span>
          <h1 className="animate-slide-from-bottom-1s  text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl ">
            Create an intelligent chatbot from your website, for your website
          </h1>
          <p className="mt-2 max-w-[700px]  animate-slide-from-bottom-3s text-lg text-slate-800   sm:text-lg md:mt-4 ">
            Custom chatbot powered by ChatGPT API based on your content.
            <br className="hidden sm:inline" /> Deploy it on your website in
            minutes.
          </p>
          <div className="gap-4 md:mt-8">
            {session ? (
              <Link size="lg" href="/create">
                Try it out
              </Link>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
        <div className="z-10 mt-10 flex flex-col items-start gap-2 md:mt-20">
          <ChatbotWireframe />
        </div>
      </section>
    </>
  );
}
