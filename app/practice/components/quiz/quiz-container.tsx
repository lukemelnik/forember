import React from "react";
import { Fragment } from "./quiz";
import { useQuizContext } from "@/app/contexts/QuizContext";

export default function QuizContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    state: { fragments, questionNumber },
  } = useQuizContext();
  return (
    <div className="text-zinc-300">
      {fragments.length === 0 ? (
        <p>You're all done for the day!</p>
      ) : (
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
