import React from "react";
import PracticeTimeCard from "./practice-weekly-total-card";
import { createClient } from "@/utils/supabase/server";

import RecallPercentageCard from "./recall-percentage-card";

import { redirect } from "next/navigation";
import WeeklySummaryCard from "./weekly-summary-card";
import StreakCard from "./streak-card";

export type Session = {
  session_duration: number;
  created_at: string;
  total_questions: number;
  right_answers: number;
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
  const { data: sessions, error: sessionsError } = await supabase
    .from("practice_session")
    .select("*")
    .eq("user_id", user.id);

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

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4">
        <WeeklySummaryCard sessions={sessions} profile={profile} />
        <PracticeTimeCard sessions={sessions} />
        <RecallPercentageCard sessions={sessions} />
        <StreakCard sessions={sessions} />
      </div>
    </>
  );
}
