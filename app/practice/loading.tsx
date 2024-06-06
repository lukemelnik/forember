import React from "react";

export default function loading() {
  return (
    <div className="relative flex min-h-svh items-center justify-center">
      <div className="z-10 flex h-60 w-60 animate-spin items-center justify-center rounded-full border-b-[15px] border-t-[15px] border-zinc-300"></div>
      <div className="absolute flex h-60 w-60 animate-spin items-center justify-center rounded-full border-b-[15px] border-t-[15px] border-pink-600 blur-lg"></div>
    </div>
  );
}
