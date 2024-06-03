import React from "react";

export default function DashboardGreeting({
  timeOfDay,
  username,
  fragmentCount,
  sessionCheck,
}: {
  timeOfDay: string;
  username: string | null;
  fragmentCount: number;
  sessionCheck: boolean;
}) {
  return (
    <div className="flex flex-col mb-5 sm:mb-0">
      {timeOfDay && username && (
        <h1>
          Good {timeOfDay} {username}
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
          No fragments to review - time to start adding some knowledge!{" "}
        </p>
      )}
    </div>
  );
}
