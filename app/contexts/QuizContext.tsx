"use client";

import { createContext, useContext, useReducer } from "react";
import { usePracticeDialog } from "../custom-hooks/usePracticeDialog";
import { useFragmentsQuizState } from "../custom-hooks/useFragmentsQuizState";
import { Fragment } from "../practice/components/quiz/quiz";

export const QuizContext = createContext(null);
const initialState = {
  open: false,
  testScore: { right: 0, wrong: 0 },
  fragments: [],
  startTime: null,
  questionNumber: 0,
  quizOver: false,
};
const reducer (state, action) => {
  switch (action.type) {
    case 'open dialog': 
      return { ...state, open: true, startTime: new Date() };
    case 'close dialog': 
      return { ...state, open: false, testScore: {right: 0, wrong: 0} };
     case 'delete fragment': 
      return { ...state, fragments: state.fragments.filter((fragment: Fragment) => fragment.id !== action.payload.id) };
  }

}

export default function QuizContextProvider({
  children,
  fragments,
}: {
  children: React.ReactNode;
  fragments: Fragment[];
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <QuizContext.Provider value={{state, dispatch}}>{children}</QuizContext.Provider>;
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuizContext must be used within a QuizContextProvider");
  }
  return context;
}
