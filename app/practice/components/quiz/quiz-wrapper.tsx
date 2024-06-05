import React from "react";
import { Fragment } from "./quiz";

export default function QuizWrapper({
  children,
  loading,
  fragments,
  questionNumber,
}: {
  children: React.ReactNode;
  loading: boolean;
  fragments: Fragment[];
  questionNumber: number;
}) {
  return (
    <div className="text-zinc-300">
      {loading && <p>Loading...</p>}
      {fragments.length === 0 && !loading && (
        <p>You're all done for the day!</p>
      )}
      {fragments.length > 0 && (
        <>
          <p className="mb-1 text-zinc-300">
            {questionNumber} of {fragments.length}
          </p>
          {children}
        </>
      )}
    </div>
  );
}
