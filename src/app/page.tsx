import Image from "next/image"
import { Inter } from "next/font/google"
import TestComponent from "./test"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className={inter.className}>
      <h1>Hello World</h1>
      <TestComponent />
    </main>
  )
}
