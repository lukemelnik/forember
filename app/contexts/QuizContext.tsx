"use client";

import { createContext, useContext } from "react";
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

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuizContext must be used within a QuizContextProvider");
  }
  return context;
}
