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
import { isThisWeek } from "date-fns";
import { createClient } from "@/utils/supabase/server";

export default async function PracticeWeeklyTotal({
  sessions,
}: {
  sessions: DailySession[];
}) {
  const supabase = createClient();

  const { data: sessionsInMinutes, error } = await supabase
    .from("daily_user_sessions_last_seven_days")
    .select("total_session_duration_minutes");

  if (!sessionsInMinutes) {
    return <div>Loading...</div>;
  }

  const practiceTime = sessionsInMinutes.reduce((acc, session) => {
    return acc + session.total_session_duration_minutes;
  }, 0);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Weekly Practice 🏋️</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">{practiceTime}</p>
      </CardContent>
      <CardFooter>
        <p>Minutes</p>
      </CardFooter>
    </Card>
  );
}
