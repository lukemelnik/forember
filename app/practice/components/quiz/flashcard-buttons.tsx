import { Button } from "@/components/ui/button";
import React from "react";
import {
  increaseInterval,
  resetInterval,
} from "../../actions/flashcard-actions";
import { useQuizContext } from "@/app/contexts/QuizContext";

export default function QuizButtons({
  fragment,
  handleFlip,
}: {
  fragment: any;
  handleFlip: () => void;
}) {
  const { dispatch } = useQuizContext();
  return (
    <div className="absolute bottom-5 flex gap-5 text-black">
      <Button
        onClick={() => {
          increaseInterval(fragment);
          dispatch({ type: "right answer", payload: fragment.id });
          handleFlip();
        }}
        className="group bg-green-500 shadow-md transition-all duration-300 hover:scale-105 hover:bg-green-400"
      >
        I got it{" "}
        <span className="ml-2 text-lg duration-300 group-hover:rotate-12">
          😁
        </span>
      </Button>
      <Button
        onClick={() => {
          resetInterval(fragment.id);
          dispatch({ type: "wrong answer", payload: fragment.id });
          handleFlip();
        }}
        className="group bg-red-500 shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-400"
      >
        I forgot{" "}
        <span className="ml-2 text-lg duration-300 group-hover:rotate-12">
          😭
        </span>
      </Button>
    </div>
  );
}
