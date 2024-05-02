"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import FlashCard from "./flash-card";

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
      // filter for fragments that should be shown on this date. First get the current date w/o time so that user can access fragments at any time of day
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // filter the fragments where the next_show_date is today and the last_shown_at is not today (ie. if the user already practiced that fragment)
      const filteredFragments = fragments.filter((fragment) => {
        const fragmentNextShowDay = new Date(fragment.next_show_date);
        fragmentNextShowDay.setHours(0, 0, 0, 0);
        const fragmentLastShownDay = new Date(fragment.last_shown_at);
        fragmentLastShownDay.setHours(0, 0, 0, 0);
        return (
          fragmentLastShownDay === null ||
          (fragmentNextShowDay === currentDate &&
            fragmentLastShownDay !== currentDate)
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
      <div>
        <h1>Daily Practice Complete!</h1>
        <p>Great job! You're on your way to having an invicible memory.</p>
      </div>
    );

  return (
    <div>
      {fragments.length === 0 && <p>Loading...</p>}
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
