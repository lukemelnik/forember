import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function HeroSection() {
  return (
    <section className="landscape:mt-16 flex flex-col items-center justify-center min-h-svh">
      <div>
        <div className="text-[40px] md:text-[75px] lg:text-[95px] flex flex-col items-center -space-y-3 md:-space-y-10 font-bold -rotate-1">
          <p className="opacity-90">Learn faster.</p>
          <p className="relative z-0 after:absolute after:bg-gradient-to-r after:from-pink-700 after:to-purple-500 md:after:h-20 lg:after:h-24 after:-z-10 md:after:top-5 lg:after:top-6 text-black bg-opacity-90 after:h-14 after:top-1 md:after:-left-6 md:after:-right-6 after:-right-3 after:-left-3">
            Remember more.
          </p>
        </div>
        <p className="max-w-[350px] text-md md:text-xl md:max-w-2xl text-center m-auto mt-4 md:mt-1">
          The world is moving at a blinding pace. Upskill quicker and enhance
          your creativity with the power of AI and spaced repetition.
        </p>
      </div>
      <Link href="/login">
        <Button className="text-lg md:text-2xl text-black bg-zinc-300 p-6 md:p-7 hover:bg-zinc-100 hover:scale-105 duration-300 transition-all mt-7 z-100">
          Start Now
        </Button>
      </Link>
    </section>
  );
}
