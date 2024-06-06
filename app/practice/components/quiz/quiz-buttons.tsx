import { Button } from "@/components/ui/button";
import React from "react";
import {
  increaseInterval,
  resetInterval,
} from "../../actions/flashcard-actions";

export default function QuizButtons({
  fragment,
  handleFlip,
}: {
  fragment: any;
  handleFlip: () => void;
}) {
  return (
    <div className="absolute bottom-5 flex gap-5 text-black">
      <Button
        onClick={() => {
          increaseInterval(fragment);
          handleRightAnswer();
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
          handleWrongAnswer();
          handleClick();
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
