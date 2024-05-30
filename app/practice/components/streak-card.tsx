import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Session } from "./learning-dashboard";

import { getStreak } from "@/lib/statistic-calculations";
import { createClient } from "@/utils/supabase/server";

export type uniqueSession = Session & {
  user_id: string;
  session_score: number;
  created_date: string;
  session_id: string;
};

export default async function StreakCard({
  sessions,
}: {
  sessions: Session[];
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "Loading...";
  }
  // created a view in supabase that selects the distinct user sessions, i.e. one per day so that they don't have to be filtered here. Had to use the DATE function in postgres to ensure they were compared on the same day.
  const { data, error } = await supabase
    .from("distinct_user_sessions")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.log(error);
  }

  if (!data) {
    return "Loading...";
  }

  const streak = getStreak(data);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Current Streak 🔥</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">{streak}</p>
      </CardContent>
      <CardFooter>
        <p>Days</p>
      </CardFooter>
    </Card>
  );
}
