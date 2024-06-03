import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { DailySession, Session } from "./learning-dashboard";
import { isThisWeek } from "date-fns";

export default function PracticeWeeklyTotal({
  sessions,
}: {
  sessions: DailySession[];
}) {
  const currentDate = new Date();
  function getWeeklyPracticeTotal() {
    const weeklySessionTotal = sessions.filter((session) => {
      const sessionDate = new Date(session.session_date);
      return isThisWeek(sessionDate, { weekStartsOn: 1 });
    });
    return Math.round(
      weeklySessionTotal.reduce(
        (acc, session) => acc + session.total_session_duration,
        0
      ) /
        (1000 * 60)
    );
  }

  const totalWeeklyPractice = getWeeklyPracticeTotal();
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Weekly Practice 🏋️</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">{totalWeeklyPractice}</p>
      </CardContent>
      <CardFooter>
        <p>Minutes</p>
      </CardFooter>
    </Card>
  );
}
