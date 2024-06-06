"use client";
import FlashCard from "./flash-card";
import { Progress } from "@/components/ui/progress";
import QuizFinished from "./quiz-finished";
import { useFragmentsQuizState } from "@/app/custom-hooks/useFragmentsQuizState";
import QuizContainer from "./quiz-container";

export type Fragment = {
  id: string;
  question: string;
  answer: string;
  interval: number;
};

export default function Quiz() {
  // calulate progress for progress bar
  const { fragments, questionNumber, quizOver, testScore } =
    useFragmentsQuizState();
  const progress = Math.round((questionNumber / fragments.length) * 100);

  return (
    <>
      {quizOver ? (
        <QuizFinished testScore={testScore} />
      ) : (
        <QuizContainer>
          <Progress value={progress} className="mb-5 bg-zinc-300" />
          <FlashCard />
        </QuizContainer>
      )}
    </>
  );
}
