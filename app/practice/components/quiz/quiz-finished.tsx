import React from "react";
import ReactDOM from "react-dom";
import Confetti from "./confetti";
import { TestScore } from "./quiz-dialog";

export default function QuizFinished({ testScore }: { testScore: TestScore }) {
  return (
    <>
      {ReactDOM.createPortal(
        <div className="fixed z-50 top-0 inset-0 h-screen">
          <Confetti />
        </div>,
        document.body
      )}
      <div className="text-zinc-300">
        <h1 className="mb-5">All done! Here's your score:</h1>
        <p>
          You answered {testScore.right} out of{" "}
          {testScore.right + testScore.wrong} correctly. That's an average of{" "}
          {Math.round(
            (testScore.right / (testScore.right + testScore.wrong)) * 100
          )}
          %.{" "}
          <p className="font-bold text-lg">
            {testScore.right > testScore.wrong
              ? "Great job!"
              : "Keep practicing!"}
            {/* in the future could add links to resources for improving */}
          </p>
        </p>
      </div>
    </>
  );
}
