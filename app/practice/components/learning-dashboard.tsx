import React from "react";
import PracticeTimeCard from "./practice-weekly-total";
import { createClient } from "@/utils/supabase/server";
import LearnerLevelCard from "./learner-level-card";
import TimeOnPlatformCard from "./time-on-platform-card";
import RecallPercentageCard from "./recall-percentage-card";
import FragmentsReviewedCard from "./fragments-reviewed-card";

export type Session = {
  session_duration: number;
  created_at: string;
  total_questions: number;
  right_answers: number;
};

export default async function LearningDashboard() {
  const supabase = createClient();
  const { data: sessions, error } = await supabase
    .from("practice_session")
    .select("*");
  // could filter for the user's own but I think RLS is already taking care of that

  if (!sessions) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="mb-3">Dashboard</h1>
      <div className="flex gap-5 flex-wrap">
        <PracticeTimeCard sessions={sessions} />
        <RecallPercentageCard sessions={sessions} />
        {/* <LearnerLevelCard sessions={sessions} /> */}
        <FragmentsReviewedCard sessions={sessions} />
        <TimeOnPlatformCard />
      </div>
    </>
  );
}
