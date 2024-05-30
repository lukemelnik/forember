import React from "react";
import PracticeTimeCard from "./practice-weekly-total";
import { createClient } from "@/utils/supabase/server";
import LearnerLevelCard from "./learner-level-card";
import TimeOnPlatformCard from "./time-on-platform-card";
import RecallPercentageCard from "./recall-percentage-card";
import FragmentsReviewedCard from "./fragments-reviewed-card";
import { redirect } from "next/navigation";
import WeeklySummaryCard from "./weekly-summary-card";

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

  return (
    <>
      <div className="flex gap-5 flex-wrap">
        <WeeklySummaryCard sessions={sessions} profile={profile} />
        <PracticeTimeCard sessions={sessions} />
        <RecallPercentageCard sessions={sessions} />
        {/* <LearnerLevelCard sessions={sessions} /> */}
        <FragmentsReviewedCard sessions={sessions} />
        <TimeOnPlatformCard />
      </div>
    </>
  );
}
