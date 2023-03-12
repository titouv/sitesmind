"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Pricing
        </h1>
      </div>
      <div className="relative mx-auto mt-8 grid max-w-2xl gap-8 md:grid-cols-2 md:gap-16 ">
        <div className="absolute inset-x-0 top-20 bottom-0 z-0 mx-auto w-1/2 rounded-full bg-blue-500/50 blur-[100px]" />
        <div className="z-10 flex flex-col rounded-xl border border-slate-300 bg-white p-10">
          <h2>
            <span className="text-xl font-medium ">Free</span>
            <span className="block text-2xl font-extrabold tabular-nums leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
              $0
            </span>
          </h2>
          <div className="my-3 h-0.5 bg-slate-200"></div>
          <ul className=" flex flex-col gap-3">
            <li className="flex gap-3 ">
              <Icons.checkCircle />
              <span>1 site</span>
            </li>
            <li className="flex gap-3 ">
              <Icons.checkCircle />
              <span>2000 characters</span>
            </li>
            <li className="flex gap-3 ">
              <Icons.checkCircle />
              <span>5 embeds</span>
            </li>
          </ul>
          <Button className="mt-8">Get started</Button>
        </div>

        <div className="z-10 flex flex-col rounded-xl bg-slate-900 p-10 text-white">
          <h2>
            <span className="text-xl font-medium ">Pro</span>
            <span className="block  text-2xl font-extrabold tabular-nums leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
              $10
            </span>
          </h2>
          <div className="my-3 h-0.5 bg-slate-700"></div>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-3 ">
              <Icons.checkCircle />
              <span>5 site</span>
            </li>
            <li className="flex gap-3 ">
              <Icons.checkCircle />
              <span>5000 characters</span>
            </li>
            <li className="flex gap-3 ">
              <Icons.checkCircle />
              <span>3 embeds</span>
            </li>
          </ul>
          <Button variant="subtle" className="mt-8">
            Get started
          </Button>
        </div>
      </div>
    </section>
  );
}
