"use client";
import { useState } from "react";
import { Fragment } from "./quiz";
import DeleteFragmentInQuiz from "./delete-fragment-in-quiz";
import FlashCardWrapper from "./flashcard-wrapper";
import FragmentQuestion from "./fragment-question";
import FragmentAnswer from "./fragment-answer";
import QuizActions from "./quiz-actions";

export default function FlashCard({
  fragment,
  handleClick,
  handleDelete,
  handleRightAnswer,
  handleWrongAnswer,
}: {
  fragment: Fragment;
  handleClick: () => void;
  handleDelete: (id: string) => void;
  handleRightAnswer: () => void;
  handleWrongAnswer: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <FlashCardWrapper setIsFlipped={setIsFlipped} isFlipped={isFlipped}>
      <DeleteFragmentInQuiz fragment={fragment} />
      {!isFlipped ? (
        <FragmentQuestion fragment={fragment} />
      ) : (
        <>
          <FragmentAnswer fragment={fragment} />
          <QuizActions
            handleClick={handleClick}
            handleRightAnswer={handleRightAnswer}
            handleWrongAnswer={handleWrongAnswer}
            fragment={fragment}
          />
        </>
      )}
    </FlashCardWrapper>
  );
}
