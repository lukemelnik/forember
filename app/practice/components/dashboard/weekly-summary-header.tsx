import React from "react";
import { createClient } from "@/utils/supabase/server";
import { isPast, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CurrentDate from "./current-date";
import QuizDialog from "../quiz/quiz-dialog";
import QuizContextProvider from "@/app/contexts/QuizContext";
import WeeklySummaryGreeting from "./weekly-summary-greeting";

export default async function WeeklySummaryHeader() {
  const supabase = createClient();
  const { data: profile, error } = await supabase.from("profile").select("*");
  const { data: sessions, error: sessionError } = await supabase
    .from("practice_session")
    .select("*");

  async function getFragments() {
    const { data: fragments, error } = await supabase
      .from("fragment")
      .select("*")
      .eq("is_complete", false);
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
      const fragmentNextShowDay = startOfDay(new Date(fragment.next_show_date));
      const today = startOfDay(new Date());
      return (
        fragmentNextShowDay.getTime() === today.getTime() ||
        fragment.last_shown_at === null ||
        isPast(fragmentNextShowDay)
      );
    });

    // Don't forget to set this to 'filteredFragments' after doing development testing
    return filteredFragments;
  }
  let fragments = await getFragments();
  if (!fragments) {
    fragments = [];
  }
  return (
    <div className="items-center justify-between sm:flex">
      <WeeklySummaryGreeting
        username={profile && profile.length > 0 ? profile[0].first_name : null}
        fragmentCount={fragments.length}
        sessionCheck={sessions && sessions.length > 0 ? true : false}
      />

      <div>
        <CurrentDate />
        {fragments?.length === 0 && sessions?.length === 0 ? (
          <div className="group relative z-0 max-w-[300px]">
            <Button className="z-0 w-full bg-zinc-100 p-6 text-lg text-black transition-all duration-300 group-hover:scale-105">
              <Link href="/practice/ai">Add Fragments</Link>
            </Button>
            <div className="absolute inset-0 -z-10 scale-105 bg-pink-500/70 blur-lg duration-300 group-hover:scale-110 group-hover:bg-pink-500 group-hover:blur-xl"></div>
          </div>
        ) : (
          <QuizContextProvider fragments={fragments}>
            {" "}
            <QuizDialog />
          </QuizContextProvider>
        )}
      </div>
    </div>
  );
}
