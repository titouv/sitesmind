import Image from "next/image"
import TestComponent from "./testComponent"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { LoggedIn } from "@/components/logged-in"
import { LoggedOut } from "@/components/logged-out"

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <h1 className="text-7xl">Hello World</h1>
      <TestComponent />
      <Link href="/account" className={buttonVariants({ size: "lg" })}>
        accountpage
      </Link>
      <LoggedOut />
      {/* @ts-expect-error Async Server Component */}
      <LoggedIn />
    </main>
  )
}
