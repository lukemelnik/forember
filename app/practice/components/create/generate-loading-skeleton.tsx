import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function GenerateLoadingSkeleton() {
  return (
    <div className="relative">
      <h2 className="animate-pulse text-2xl font-bold text-zinc-300">
        Creating your fragments...
      </h2>
      <Skeleton className="absolute -left-12 top-28 h-8 w-8 rounded-full"></Skeleton>
      <Skeleton className="absolute -right-12 top-28 h-8 w-8 rounded-full"></Skeleton>
      <Skeleton className="mt-4 w-[350px] rounded-xl border-2 border-zinc-800 bg-black p-5 md:w-full">
        <Skeleton className="h-20"></Skeleton>
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-10 w-32"></Skeleton>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-20"></Skeleton>
            <Skeleton className="h-10 w-20"></Skeleton>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}
