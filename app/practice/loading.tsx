import React from "react";

export default function loading() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex h-72 w-72 animate-spin items-center justify-center rounded-full border-b-[15px] border-t-[15px] border-zinc-300"></div>
    </div>
  );
}
