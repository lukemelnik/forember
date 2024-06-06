import React from "react";
import { createClient } from "@/utils/supabase/server";
import { isPast, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CurrentDate from "./current-date";
import QuizDialog from "../quiz/quiz-dialog";
import QuizContextProvider from "@/app/contexts/QuizContext";
import WeeklySummaryGreeting from "./weekly-summary-greeting";
import { getFragmentsServer } from "@/lib/get-fragments-server";

export default async function WeeklySummaryHeader() {
  const supabase = createClient();
  const { data: profile, error } = await supabase.from("profile").select("*");
  const { data: sessions, error: sessionError } = await supabase
    .from("practice_session")
    .select("*");

  let fragments = await getFragmentsServer();
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
            <Link href="/practice/create">
              <Button className="z-0 w-full bg-zinc-100 p-6 text-lg text-black transition-all duration-300 group-hover:scale-105">
                Add Fragments
              </Button>
            </Link>
            <div className="absolute inset-0 -z-10 scale-105 bg-pink-500/70 blur-lg duration-300 group-hover:scale-110 group-hover:bg-pink-500 group-hover:blur-xl"></div>
          </div>
        ) : (
          <QuizContextProvider>
            {" "}
            <QuizDialog />
          </QuizContextProvider>
        )}
      </div>
    </div>
  );
}
