"use client";
import { useState } from "react";
import DeleteFragmentInQuiz from "./fragment-delete-dialog";
import FragmentQuestion from "./fragment-question";
import FragmentAnswer from "./fragment-answer";
import { useQuizContext } from "@/app/contexts/QuizContext";
import QuizButtons from "./flashcard-buttons";
import FlashCardContainer from "./flashcard-container";
import FragmentDeleteDialog from "./fragment-delete-dialog";
import FragmentEditForm from "../../library/_components/fragment-edit-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function FlashCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    state: { fragments, questionNumber },
  } = useQuizContext();

  // handling flip state here to avoid every single component having to re-render
  function handleFlip() {
    setIsFlipped(!isFlipped);
  }
  function handleEdit() {
    setIsEditing(!isEditing);
  }

  // grab the current question:
  const fragment = fragments[questionNumber];

  return (
    <>
      {!isEditing ? (
        <div className="relative">
          <FlashCardContainer setIsFlipped={setIsFlipped} isFlipped={isFlipped}>
            {!isFlipped ? (
              <FragmentQuestion fragment={fragment} />
            ) : (
              <>
                <FragmentAnswer fragment={fragment} />
                <QuizButtons handleFlip={handleFlip} fragment={fragment} />
              </>
            )}
          </FlashCardContainer>
          <FragmentDeleteDialog
            fragment={fragment}
            setIsFlipped={setIsFlipped}
          />
          <Button
            className="absolute left-3 top-5 z-50 mx-0 my-0 h-min px-0 py-0 text-black"
            onClick={() => setIsEditing(true)}
          >
            <Pencil />
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-zinc-300 p-4">
          <FragmentEditForm fragment={fragment} handleEdit={handleEdit} />
        </div>
      )}
    </>
  );
}
