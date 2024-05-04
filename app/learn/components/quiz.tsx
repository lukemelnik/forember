"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import FlashCard from "./flash-card";
import { addDays, isPast, startOfDay } from "date-fns";
import Confetti from "./confetti";
import ReactDOM from "react-dom";
import { Progress } from "@/components/ui/progress";

export type Fragment = {
  id: string;
  question: string;
  answer: string;
  interval: number;
};

export default function Quiz() {
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
          <h1>All done!</h1>
          <p>Great job, you're on your way to having an invicible memory.</p>
        </div>
      </>
    );

  return (
    <div>
      {fragments.length === 0 && <p>You're all done for the day!</p>}
      {fragments.length > 0 && (
        <>
          <Progress value={progress} className="mb-5 bg-zinc-300" />
          <FlashCard
            fragment={fragments[questionNumber]}
            handleClick={nextQuestion}
            handleDelete={deleteFromQuiz}
          />
        </>
      )}
    </div>
  );
}
