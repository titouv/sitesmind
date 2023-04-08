"use client";

import { CheckCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
import { Title } from "@/components/title";
export const runtime = "edge";
export default function Page() {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <Title>Pricing</Title>
      </div>
      <div className="relative mx-auto mt-8 grid max-w-2xl gap-8 md:grid-cols-2 md:gap-16 ">
        <div className="absolute inset-x-0 top-20 bottom-0 z-0 mx-auto w-1/2 rounded-full bg-blue-500/50 blur-[100px]" />
        <div className="z-10 flex flex-col rounded-xl border border-slate-300 bg-white p-10">
          <h2>
            <span className="block pb-2 text-xl font-medium ">Free</span>
            <span className="text-2xl font-extrabold tabular-nums leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
              $0
            </span>
            <span className="text-sm">/month</span>
          </h2>
          <div className="my-3 h-0.5 bg-slate-200 md:my-6"></div>
          <ul className=" flex flex-col gap-3">
            <li className="flex gap-3 ">
              <CheckCircle className="h-6 w-6" />
              <span>1 site</span>
            </li>
            <li className="flex gap-3 ">
              <CheckCircle className="h-6 w-6" />
              <span>2000 characters</span>
            </li>
            <li className="flex gap-3 ">
              <CheckCircle className="h-6 w-6" />
              <span>5 embeds</span>
            </li>
          </ul>
          <Button className="mt-8">Get started</Button>
        </div>

        <div className="z-10 flex flex-col rounded-xl bg-slate-900 p-10 text-white">
          <h2>
            <span className="block pb-2 text-xl font-medium ">Premium</span>
            <span className="text-2xl font-extrabold tabular-nums leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
              $10
            </span>
            <span className="text-sm">/month</span>
          </h2>
          <div className="my-3 h-0.5 bg-slate-700 md:my-6"></div>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-3 ">
              <CheckCircle className="h-6 w-6" />
              <span>5 site</span>
            </li>
            <li className="flex gap-3 ">
              <CheckCircle className="h-6 w-6" />
              <span>5000 characters</span>
            </li>
            <li className="flex gap-3 ">
              <CheckCircle className="h-6 w-6" />
              <span>3 embeds</span>
            </li>
          </ul>
          <Button disabled variant="subtle" className="mt-8">
            Coming soon...
          </Button>
        </div>
      </div>
      {/* <div className="mx-auto mt-16 ">
        <h2 className="my-8 text-center text-3xl font-bold">Questions ?</h2>
        <Accordion
          type="multiple"
          className="w-96 rounded-xl border border-slate-300 px-8 py-4"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div> */}
    </section>
  );
}
