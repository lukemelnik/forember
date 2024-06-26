import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function HeroSection() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center landscape:mt-16">
      <div>
        <div className="flex -rotate-1 flex-col items-center -space-y-3 text-[40px] font-bold md:-space-y-10 md:text-[75px] lg:text-[95px]">
          <p className="opacity-90">Learn faster.</p>
          <p className="relative z-0 bg-opacity-90 text-black after:absolute after:-left-3 after:-right-3 after:top-1 after:-z-10 after:h-14 after:bg-gradient-to-r after:from-pink-700 after:to-purple-500 md:after:-left-6 md:after:-right-6 md:after:top-5 md:after:h-20 lg:after:top-6 lg:after:h-24">
            Remember more.
          </p>
        </div>
        <p className="text-md m-auto mt-4 max-w-[350px] text-center md:mt-1 md:max-w-2xl md:text-xl">
          The world is moving at a blinding pace. Upskill quicker and enhance
          your creativity with the power of AI and spaced repetition.
        </p>
      </div>
      <Link href="/login">
        <Button className="z-100 mt-7 bg-zinc-300 p-6 text-lg text-black transition-all duration-300 hover:scale-105 hover:bg-zinc-100 md:p-7 md:text-2xl">
          Start Now
        </Button>
      </Link>
    </section>
  );
}
