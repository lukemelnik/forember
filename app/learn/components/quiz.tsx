"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import FlashCard from "./flash-card";

export type Fragment = {
  id: string;
  question: string;
  answer: string;
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
        .select("id, question, answer");

      if (error) {
        console.log(error);
      }
      if (!fragments) return;

      setFragments(fragments);
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
