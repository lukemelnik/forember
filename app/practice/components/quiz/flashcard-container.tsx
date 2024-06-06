import React from "react";

export default function FlashCardContainer({
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
      className={`relative mx-auto flex h-72 w-full items-center justify-center rounded-xl from-zinc-100 to-zinc-300 p-10 text-lg shadow-lg ${isFlipped ? "bg-gradient-to-l" : "bg-gradient-to-r"}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {children}
    </div>
  );
}
