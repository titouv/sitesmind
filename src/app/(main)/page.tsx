import { Auth } from "@/app/(main)/auth"
import { ProfilePicture } from "@/app/(main)/profile-picture"
import { Link } from "@/components/ui/link"
import { siteConfig } from "@/config/site"

import type { Metadata } from "next"
import { redirect } from "next/dist/server/api-utils"

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
}

export default function Home({
  searchParams,
}: {
  searchParams: { redirect: string }
}) {
  return (
    <>
      {searchParams.redirect && (
        <div className="container w-full  py-3 bg-slate-100">
          <span>Please login before using</span>
        </div>
      )}
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Make your own Chatbot <br className="hidden sm:inline" />
            from your website
          </h1>
          <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Custom chatbot powered by ChatGPT API based on your content. Deploy
            it on your website in minutes.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/try">Try it out</Link>
          {/* <Link
            variant="subtle"
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
          >
            GitHub
          </Link> */}
        </div>
      </section>
    </>
  )
}
