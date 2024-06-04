"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Fragment } from "../practice/components/quiz/quiz";
import { isPast, startOfDay } from "date-fns";

export function useFragmentsQuizState() {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getFragments() {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      const { data: fragments, error } = await supabase
        .from("fragment")
        .select("*")
        .eq("is_complete", false)
        .eq("user_id", user.id);
      if (error) {
        console.log(error);
      }
      if (!fragments) return;

      // conditions for showing the fragment:
      // 1. if the fragment has never been shown
      // 2. if the fragment has been shown and the next show date is today
      // 3. if the fragment has been shown and the next show date is in the past (i.e. user missed a day)
      // this should actually be moved to the db query, but I'm doing it here for now
      const filteredFragments = fragments.filter((fragment) => {
        const fragmentNextShowDay = startOfDay(
          new Date(fragment.next_show_date)
        );
        const today = startOfDay(new Date());
        return (
          fragmentNextShowDay.getTime() === today.getTime() ||
          fragment.last_shown_at === null ||
          isPast(fragmentNextShowDay)
        );
      });
      setFragments(filteredFragments);
    }
    getFragments();
    setLoading(false);
  }, []);

  function nextQuestion() {
    if (questionNumber === fragments.length - 1) {
      setQuizOver(true);
      return;
    }
    setQuestionNumber(questionNumber + 1);
  }
  // separate function for deleting fragment from client view
  // without it the UI doesn't update, only updates db
  function deleteFromQuiz(id: string) {
    const newFragments = fragments.filter((fragment) => fragment.id !== id);
    setFragments(newFragments);
  }

  return {
    fragments,
    loading,
    deleteFromQuiz,
    quizOver,
    questionNumber,
    nextQuestion,
  };
}
