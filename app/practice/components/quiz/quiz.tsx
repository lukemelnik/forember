"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import FlashCard from "./flash-card";
import { isPast, startOfDay } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { TestScore } from "./quiz-dialog";
import QuizFinished from "./quiz-finished";
import { useFragmentsQuiz } from "@/app/custom-hooks/fragments-quiz-hook";

export type Fragment = {
  id: string;
  question: string;
  answer: string;
  interval: number;
};

export default function Quiz({
  testScore,
  handleRightAnswer,
  handleWrongAnswer,
}: {
  testScore: TestScore;
  handleRightAnswer: () => void;
  handleWrongAnswer: () => void;
}) {
  // custom hook that fetchs fragments & manages quiz state
  const {
    fragments,
    loading,
    deleteFromQuiz,
    quizOver,
    questionNumber,
    nextQuestion,
  } = useFragmentsQuiz();

  // calulate progress for progress bar
  const progress = Math.round((questionNumber / fragments.length) * 100);

  if (quizOver) return <QuizFinished testScore={testScore} />;

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
          <Progress value={progress} className="mb-5 bg-zinc-300" />
          <FlashCard
            fragment={fragments[questionNumber]}
            handleClick={nextQuestion}
            handleDelete={deleteFromQuiz}
            handleRightAnswer={handleRightAnswer}
            handleWrongAnswer={handleWrongAnswer}
          />
        </>
      )}
    </div>
  );
}
