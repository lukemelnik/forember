"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import FlashCard from "./flash-card";
import { addDays, isPast, startOfDay } from "date-fns";
import Confetti from "./confetti";
import ReactDOM from "react-dom";
import { Progress } from "@/components/ui/progress";
import { TestScore } from "./practice-dialog";

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

  // calulate progress for progress bar
  const progress = Math.round((questionNumber / fragments.length) * 100);

  useEffect(() => {
    async function getFragments() {
      const supabase = createClient();
      const { data: fragments, error } = await supabase
        .from("fragment")
        .select("*");
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
        console.log(fragmentNextShowDay.getTime(), today.getTime());
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

  if (quizOver)
    return (
      <>
        {ReactDOM.createPortal(
          <div className="fixed z-50 top-0 inset-0 h-screen">
            <Confetti />
          </div>,
          document.body
        )}
        <div>
          <h1 className="mb-5">All done! Here's your score:</h1>
          <p>
            You answered {testScore.right} out of{" "}
            {testScore.right + testScore.wrong} correctly. That's an average of{" "}
            {Math.round(
              (testScore.right / (testScore.right + testScore.wrong)) * 100
            )}
            %.{" "}
            <p className="font-bold text-lg">
              {testScore.right > testScore.wrong
                ? "Great job!"
                : "Keep practicing!"}
              {/* in the future could add links to resources for improving */}
            </p>
          </p>
        </div>
      </>
    );

  return (
    <div>
      {fragments.length === 0 && <p>You're all done for the day!</p>}
      {fragments.length > 0 && (
        <>
          <p className="mb-1">
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
