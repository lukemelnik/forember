"use client";
import { useState } from "react";
import DeleteFragmentInQuiz from "./fragment-delete-dialog";
import FragmentQuestion from "./fragment-question";
import FragmentAnswer from "./fragment-answer";
import { useQuizContext } from "@/app/contexts/QuizContext";
import QuizButtons from "./flashcard-buttons";
import FlashCardContainer from "./flashcard-container";
import FragmentDeleteDialog from "./fragment-delete-dialog";

export default function FlashCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const {
    state: { fragments, questionNumber },
  } = useQuizContext();

  // handling flip state here to avoid every single component having to re-render
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
