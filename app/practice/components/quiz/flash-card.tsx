"use client";
import { useState } from "react";
import DeleteFragmentInQuiz from "./fragment-delete-dialog";
import FragmentQuestion from "./fragment-question";
import FragmentAnswer from "./fragment-answer";
import { useQuizContext } from "@/app/contexts/QuizContext";
import QuizButtons from "./quiz-buttons";
import FlashCardContainer from "./flashcard-container";
import FragmentDeleteDialog from "./fragment-delete-dialog";

export default function FlashCard({ children }: { children: React.ReactNode }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { fragments, questionNumber } = useQuizContext();

  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  // grab the current question:
  const fragment = fragments[questionNumber];

  return (
    <FlashCardContainer setIsFlipped={setIsFlipped} isFlipped={isFlipped}>
      <FragmentDeleteDialog fragment={fragment} setIsFlipped={setIsFlipped} />
      {!isFlipped ? (
        <FragmentQuestion fragment={fragment} />
      ) : (
        <>
          <FragmentAnswer fragment={fragment} />
          <QuizButtons handleFlip={handleFlip} fragment={fragment} />
        </>
      )}
    </FlashCardContainer>
  );
}
