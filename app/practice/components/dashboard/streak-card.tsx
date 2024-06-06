import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useContext } from "react";
import { Session } from "./dashboard";

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

  const { data, error } = await supabase
    .from("daily_user_sessions")
    .select("session_date")
    .eq("user_id", user.id);

  if (error) {
    console.log(error);
  }

  if (!data) {
    return "Loading...";
  }

  const streak = getStreak(data);

  return (
    <Card className="flex-col justify-center">
      <CardHeader>
        <CardTitle>Current Streak 🔥</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-black">{streak}</p>
      </CardContent>
      <CardFooter>
        <p>{streak === 1 ? "Day" : "Days"}</p>
      </CardFooter>
    </Card>
  );
}
