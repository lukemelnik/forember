import React from "react";
import PracticeTimeCard from "./practice-weekly-total-card";
import { createClient } from "@/utils/supabase/server";

import RecallPercentageCard from "./recall-percentage-card";

import { redirect } from "next/navigation";
import WeeklySummaryCard from "./weekly-summary-card";
import StreakCard from "./streak-card";

export const dynamic = "force-dynamic";

export type Session = {
  session_duration: number;
  created_at: string;
  total_questions: number;
  right_answers: number;
};

export type DailySession = {
  user_id: string;
  session_date: string;
  month_and_day: string;
  session_count: number;
  total_session_duration: number;
  total_questions: number;
  total_right_answers: number;
};

export type Profile = {
  user_id: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

export default async function LearningDashboard() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  // created a custom view that aggregates the daily session data. Have to order by the date
  const { data: sessions, error: sessionsError } = await supabase
    .from("daily_user_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("session_date", { ascending: true });

  console.log("SESSIONS: ", sessions);

  if (!sessions) {
    return <div>No sessions available.</div>;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", user.id);

  if (!profile) {
    redirect("/login");
  }

  const timeframe = 7;

  return (
    <>
      <section className="grid md:grid-cols-3 gap-4">
        <WeeklySummaryCard
          sessions={sessions}
          profile={profile}
          timeframe={timeframe}
        />
        <PracticeTimeCard sessions={sessions} timeframe={timeframe} />
        <RecallPercentageCard sessions={sessions} timeframe={timeframe} />
        <StreakCard sessions={sessions} />
      </section>
    </>
  );
}
