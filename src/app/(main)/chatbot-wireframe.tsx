"use client";
import SmallChabotPreview from "@/app/(main)/small-chabot-preview";
import { useState } from "react";

export function ChatbotWireframe() {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="relative flex aspect-[9/16] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-right-12 duration-1000 sm:aspect-video">
      <div className="text-center  text-2xl font-semibold italic text-slate-900">
        Your
        <span className="relative ml-2 inline-block before:absolute before:-inset-1  before:block before:-skew-y-3 before:bg-blue-500">
          <span className="relative text-white">website</span>
        </span>
      </div>
      <div
        className="absolute bottom-4 right-4 z-50"
        onClick={(e) => {
          setClicked(true);
        }}
      >
        <SmallChabotPreview params={{ id: "2" }} />
      </div>
      {!clicked && (
        <div className="pointer-events-none absolute bottom-8 right-8 z-10   border-black fill-black text-black">
          <span className="absolute top-10 font-bold">Try this out</span>
          <Arrow />
        </div>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 89.42578125 51.49455935068181"
      className="w-32"
    >
      <rect
        x="0"
        y="0"
        width="89.42578125"
        height="51.49455935068181"
        fill="transparent"
      ></rect>
      <g stroke-linecap="round">
        <g transform="translate(10 10.010184350681811) rotate(0 34.712890625 15.737095324659094)">
          <path
            d="M0 0 C7.41 0.59, 32.89 -1.7, 44.46 3.54 C56.03 8.79, 65.26 26.83, 69.43 31.48 M0 0 C7.41 0.59, 32.89 -1.7, 44.46 3.54 C56.03 8.79, 65.26 26.83, 69.43 31.48"
            stroke="#000000"
            stroke-width="4"
            fill="none"
          ></path>
        </g>
        <g transform="translate(10 10.010184350681811) rotate(0 34.712890625 15.737095324659094)">
          <path
            d="M54.01 20.84 C58.72 24.09, 63.43 27.35, 69.43 31.48 M54.01 20.84 C59.34 24.52, 64.67 28.2, 69.43 31.48"
            stroke="#000000"
            stroke-width="4"
            fill="none"
          ></path>
        </g>
        <g transform="translate(10 10.010184350681811) rotate(0 34.712890625 15.737095324659094)">
          <path
            d="M64.45 13.42 C65.97 18.94, 67.49 24.46, 69.43 31.48 M64.45 13.42 C66.17 19.66, 67.89 25.91, 69.43 31.48"
            stroke="#000000"
            stroke-width="4"
            fill="none"
          ></path>
        </g>
      </g>
      <mask></mask>
    </svg>
  );
}
