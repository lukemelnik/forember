"use client";
import { useState } from "react";
import { Fragment } from "./question-list";

export default function FlashCard({ fragment }: { fragment: Fragment }) {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div
      className="w-96 h-48 bg-yellow-500 rounded-xl relative flex justify-center items-center"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {isFlipped ? fragment.question : fragment.answer}
    </div>
  );
}
