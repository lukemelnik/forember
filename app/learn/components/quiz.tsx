"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import FlashCard from "./flash-card";
import { addDays, startOfDay } from "date-fns";
import Confetti from "./confetti";
import ReactDOM from "react-dom";

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

      // only show the user the fragments with next_show_date of today, or if it's the first time (last-shown-at is null)
      const filteredFragments = fragments.filter((fragment) => {
        const fragmentNextShowDay = startOfDay(fragment.next_show_date);
        const today = startOfDay(new Date());

        return (
          fragmentNextShowDay.getTime() === today.getTime() ||
          fragment.last_shown_at === null
        );
      });

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
          <p>Great job! You're on your way to having an invicible memory.</p>
        </div>
      </>
    );

  return (
    <div>
      {fragments.length === 0 && <p>You're all done for the day!</p>}
      {fragments.length > 0 && (
        <FlashCard
          fragment={fragments[questionNumber]}
          handleClick={nextQuestion}
          handleDelete={deleteFromQuiz}
        />
      )}
    </div>
  );
}
