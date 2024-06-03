"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import FlashCard from "./flash-card";
import { addDays, isPast, set, startOfDay } from "date-fns";
import Confetti from "./confetti";
import ReactDOM from "react-dom";
import { Progress } from "@/components/ui/progress";
import { TestScore } from "./quiz-dialog";
import QuizFinished from "./quiz-finished";

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
  const [questionNumber, setQuestionNumber] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [loading, setLoading] = useState(false);

  // calulate progress for progress bar
  const progress = Math.round((questionNumber / fragments.length) * 100);

  useEffect(() => {
    async function getFragments() {
      setLoading(true);
      const supabase = createClient();
      const { data: fragments, error } = await supabase
        .from("fragment")
        .select("*")
        .eq("is_complete", false);
      if (error) {
        console.log(error);
      }
      if (!fragments) return;

      // conditions for showing the fragment:
      // 1. if the fragment has never been shown
      // 2. if the fragment has been shown and the next show date is today
      // 3. if the fragment has been shown and the next show date is in the past (i.e. user missed a day)
      // this should actually be moved to the db query, but I'm doing it here for now
      const filteredFragments = fragments.filter((fragment) => {
        const fragmentNextShowDay = startOfDay(
          new Date(fragment.next_show_date)
        );
        const today = startOfDay(new Date());
        return (
          fragmentNextShowDay.getTime() === today.getTime() ||
          fragment.last_shown_at === null ||
          isPast(fragmentNextShowDay)
        );
      });

      // Don't forget to set this to 'filteredFragments' after doing development testing
      setFragments(filteredFragments);
    }
    getFragments();
    setLoading(false);
  }, []);

  function nextQuestion() {
    if (questionNumber === fragments.length - 1) {
      setQuizOver(true);
      return;
    }
    setQuestionNumber(questionNumber + 1);
  }
  // separate function for deleting fragment from client view
  // without it the UI doesn't update, only updates db
  function deleteFromQuiz(id: string) {
    const newFragments = fragments.filter((fragment) => fragment.id !== id);
    setFragments(newFragments);
  }

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
