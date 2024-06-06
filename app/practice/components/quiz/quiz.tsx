"use client";
import FlashCard from "./flash-card";
import { Progress } from "@/components/ui/progress";
import QuizFinished from "./quiz-finished";
import QuizContainer from "./quiz-container";
import { useQuizContext } from "@/app/contexts/QuizContext";

export type Fragment = {
  id: string;
  question: string;
  answer: string;
  interval: number;
};

export default function Quiz() {
  // calulate progress for progress bar
  const {
    state: { fragments, questionNumber, quizOver, testScore },
  } = useQuizContext();

  // calculate progress for progress bar
  const progress = Math.round((questionNumber / fragments?.length) * 100);
  // calculate total questions so that confetti doesn't show if no questions have been completed.
  const totalQuestions = testScore.right + testScore.wrong;

  return (
    <>
      {quizOver && totalQuestions > 0 ? (
        <QuizFinished />
      ) : (
        <QuizContainer>
          <Progress value={progress} className="mb-5 bg-zinc-300" />
          <FlashCard />
        </QuizContainer>
      )}
    </>
  );
}
