"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { Fragment } from "../practice/components/quiz/quiz";
import { logSession } from "../practice/actions/add-session";
import revalidatePracticePage from "../practice/actions/revalidate-practice-page";
import { getFragmentsClient } from "@/lib/get-fragments-client";

// function for logging the session and revalidating the practice page
async function practiceDialogChange(startTime: Date, testScore: TestScore) {
  await logSession(startTime, testScore);
  revalidatePracticePage();
}

type TestScore = {
  right: number;
  wrong: number;
};

type QuizState = {
  open: boolean;
  loading: boolean;
  testScore: TestScore;
  fragments: Fragment[];
  startTime: Date | null;
  questionNumber: number;
  quizOver: boolean;
};

type ReducerAction = {
  type: string;
  payload?: any;
};

const initialState: QuizState = {
  open: false,
  loading: true,
  testScore: { right: 0, wrong: 0 },
  fragments: [],
  startTime: null,
  questionNumber: 0,
  quizOver: false,
};
const reducer = (state: QuizState, action: ReducerAction): QuizState => {
  switch (action.type) {
    case "data loaded":
      return {
        ...state,
        fragments: action.payload,
        loading: false,
      };
    case "open dialog":
      // starts data fetch via useEffect. Will trigger 'data loaded' when finished and allow the quiz to render
      return {
        ...state,
        open: true,
        startTime: new Date(),
      };
    case "close dialog":
      if (state.startTime) {
        practiceDialogChange(state.startTime, state.testScore);
      }
      return {
        ...state,
        open: false,
        testScore: { right: 0, wrong: 0 },
        quizOver: false,
        questionNumber: 0,
      };
    case "delete fragment":
      if (state.questionNumber === state.fragments.length - 1) {
        return {
          ...state,
          fragments: state.fragments.filter(
            (fragment) => fragment.id !== action.payload,
          ),
          quizOver: true,
        };
      }
      return {
        ...state,
        fragments: state.fragments.filter(
          (fragment) => fragment.id !== action.payload,
        ),
      };
    case "right answer":
      // first check if you're at the end of the quiz
      if (state.questionNumber === state.fragments.length - 1) {
        return {
          ...state,
          fragments: state.fragments.filter(
            (fragment) => fragment.id !== action.payload,
          ),
          quizOver: true,
          testScore: { ...state.testScore, right: state.testScore.right + 1 },
        };
      }
      return {
        ...state,
        questionNumber: state.questionNumber + 1,
        testScore: { ...state.testScore, right: state.testScore.right + 1 },
      };
    case "wrong answer":
      // first check if you're at the end of the quiz
      if (state.questionNumber === state.fragments.length - 1) {
        return {
          ...state,
          fragments: state.fragments.filter(
            (fragment) => fragment.id !== action.payload,
          ),
          quizOver: true,
          testScore: { ...state.testScore, wrong: state.testScore.wrong + 1 },
        };
      }
      return {
        ...state,
        questionNumber: state.questionNumber + 1,
        testScore: { ...state.testScore, wrong: state.testScore.wrong + 1 },
      };
    default:
      throw new Error("Invalid action type");
  }
};

export const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<ReducerAction>;
}>({ state: initialState, dispatch: () => undefined });

export default function QuizContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
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
