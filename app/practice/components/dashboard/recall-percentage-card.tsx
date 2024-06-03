import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { DailySession, Session } from "./dashboard";
import {
  getRecallAverage,
  getWeeklyRecallAverage,
} from "@/lib/statistic-calculations";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RecallPercentageCard({
  sessions,
}: {
  sessions: DailySession[];
}) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: sessionsLastSevenDays, error } = await supabase
    .from("daily_user_sessions_last_seven_days")
    .select("total_questions, total_right_answers")
    .eq("user_id", user.id);

  if (!sessions || !sessionsLastSevenDays) {
    return <div>Loading...</div>;
  }

  const recallAverage = getRecallAverage(sessions);
  const lastSevenRecallAverage = Math.round(
    sessionsLastSevenDays.reduce((acc, session) => {
      return (
        acc +
        ((session.total_right_answers / session.total_questions) * 100) /
          sessionsLastSevenDays.length
      );
    }, 0)
  );

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Weekly Recall 🧠</CardTitle>
      </CardHeader>
      <CardContent>
        {/* currently showing all time recall average but needs to be updated with a more useful metric */}
        <div className="flex gap-2 items-center">
          <h2 className="font-black text-4xl">{lastSevenRecallAverage}</h2>
        </div>
      </CardContent>
      <CardFooter>
        <p>All-Time: {recallAverage}%</p>
      </CardFooter>
    </Card>
  );
}
