import React from "react";

export default function CarouselContainer({
  fragmentCount,
  children,
}: {
  fragmentCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="text-zinc-300">
      <div className="flex items-center gap-5">
        <h2 className="text-2xl font-bold">
          {fragmentCount} fragments created
        </h2>
      </div>
      {children}
    </div>
  );
}
