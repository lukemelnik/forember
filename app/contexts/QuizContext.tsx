"use client";

import { createContext } from "react";
import { usePracticeDialog } from "../custom-hooks/usePracticeDialog";

export const QuizContext = createContext(null);

export default function QuizContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { testScore, addRightAnswer, addWrongAnswer, open, setOpen } =
    usePracticeDialog();
  return (
    <QuizContext.Provider
      value={{ testScore, addRightAnswer, addWrongAnswer, open, setOpen }}
    >
      {children}
    </QuizContext.Provider>
  );
}
