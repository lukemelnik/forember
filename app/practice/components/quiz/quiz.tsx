"use client";
import FlashCard from "./flash-card";
import { Progress } from "@/components/ui/progress";
import QuizFinished from "./quiz-finished";
import { useFragmentsQuizState } from "@/app/custom-hooks/useFragmentsQuizState";
import { TestScore } from "@/app/custom-hooks/usePracticeDialog";
import QuizWrapper from "./quiz-wrapper";

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
  } = useFragmentsQuizState();

  // calulate progress for progress bar
  const progress = Math.round((questionNumber / fragments.length) * 100);

  if (quizOver) return <QuizFinished testScore={testScore} />;

  return (
    <QuizWrapper
      loading={loading}
      questionNumber={questionNumber}
      fragments={fragments}
    >
      <Progress value={progress} className="mb-5 bg-zinc-300" />
      <FlashCard
        fragment={fragments[questionNumber]}
        handleClick={nextQuestion}
        handleDelete={deleteFromQuiz}
        handleRightAnswer={handleRightAnswer}
        handleWrongAnswer={handleWrongAnswer}
      />
    </QuizWrapper>
  );
}
