"use client";

import { getCurrentTime } from "@/lib/date-calculations";
import Link from "next/link";
import React from "react";

export default function WeeklySummaryGreeting({
  username,
  fragmentCount,
  sessionCheck,
}: {
  username: string | null;
  fragmentCount: number;
  sessionCheck: boolean;
}) {
  let timeOfDay = getCurrentTime();
  return (
    <div className="mb-5 flex flex-col sm:mb-0">
      {timeOfDay && username && (
        <h1>
          Good {timeOfDay} {username}
          <span className="ml-2">👋</span>
        </h1>
      )}
      {timeOfDay && !username && (
        <h1>
          Good {timeOfDay}
          <span className="ml-2">👋</span>
        </h1>
      )}
      {fragmentCount > 0 ? (
        <p className="pt-2 font-thin">
          It's time to shred! You've got {fragmentCount}{" "}
          {fragmentCount === 1 ? "fragment" : "fragments"} to review.
        </p>
      ) : // when you're done for the day
      sessionCheck ? (
        <p className="pt-2 font-thin">
          No fragments left to review, keep up the good work!
        </p>
      ) : (
        // for first time visitors
        <p className="pt-2 font-thin">
          No fragments to review yet -{" "}
          <Link href="/practice/ai">time to start adding some knowledge!</Link>{" "}
        </p>
      )}
    </div>
  );
}
