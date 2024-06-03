import React from "react";

export default function FlashCardWrapper({
  isFlipped,
  setIsFlipped,
  children,
}: {
  isFlipped: boolean;
  setIsFlipped: (isFlipped: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`w-full h-72  rounded-xl  relative flex justify-center items-center shadow-lg   p-10 text-lg mx-auto from-zinc-100 to-zinc-300 ${isFlipped ? " bg-gradient-to-l" : "bg-gradient-to-r"}`}
      onClick={() => setIsFlipped(!isFlipped)}
    ></div>
  );
}
