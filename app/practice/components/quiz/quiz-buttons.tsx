import { Button } from "@/components/ui/button";
import React from "react";
import {
  increaseInterval,
  resetInterval,
} from "../../actions/flashcard-actions";

export default function QuizActions({
  fragment,
  handleClick,
  handleRightAnswer,
  handleWrongAnswer,
}: {
  fragment: any;
  handleClick: () => void;
  handleRightAnswer: () => void;
  handleWrongAnswer: () => void;
}) {
  return (
    <div className="absolute bottom-5 flex gap-5 text-black">
      <Button
        onClick={() => {
          increaseInterval(fragment);
          handleRightAnswer();
          handleClick();
        }}
        className="bg-green-500 hover:bg-green-400 group shadow-md hover:scale-105 duration-300 transition-all"
      >
        I got it{" "}
        <span className="ml-2 text-lg group-hover:rotate-12 duration-300">
          😁
        </span>
      </Button>
      <Button
        onClick={() => {
          resetInterval(fragment.id);
          handleWrongAnswer();
          handleClick();
        }}
        className="bg-red-500 hover:bg-red-400 group shadow-md hover:scale-105 duration-300 transition-all"
      >
        I forgot{" "}
        <span className="ml-2 text-lg group-hover:rotate-12 duration-300">
          😭
        </span>
      </Button>
    </div>
  );
}
