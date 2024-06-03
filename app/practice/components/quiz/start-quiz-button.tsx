import { Button } from "@/components/ui/button";
import React from "react";

export default function StartQuizButton() {
  return (
    <div className="relative z-0 group max-w-[300px]">
      <Button className="w-full z-0 bg-zinc-100 text-black  group-hover:scale-105 duration-300 transition-all text-lg p-6">
        Start Daily Quiz
      </Button>
      <div className="absolute inset-0 bg-pink-500/70 -z-10  blur-lg scale-105 group-hover:bg-pink-500 group-hover:blur-xl duration-300 group-hover:scale-110"></div>
    </div>
  );
}
