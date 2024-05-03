import React from "react";
import PracticeTimeCard from "./practice-weekly-total";
import { createClient } from "@/utils/supabase/server";
import PracticeTotalCard from "./practice-total-card";

export type Session = {
  session_duration: number;
  created_at: string;
};

export default async function LearningDashboard() {
  const supabase = createClient();
  const { data: sessions, error } = await supabase
    .from("practice_session")
    .select("session_duration, created_at");

  if (!sessions) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="mb-3">Dashboard</h1>
      <div className="flex gap-5">
        <PracticeTimeCard sessions={sessions} />
        <PracticeTotalCard sessions={sessions} />
      </div>
    </>
  );
}
