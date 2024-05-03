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
import { isThisWeek } from "date-fns";

export default function PracticeWeeklyTotal({
  sessions,
}: {
  sessions: Session[];
}) {
  const currentDate = new Date();
  function getWeeklyPracticeTotal() {
    const weeklySessionTotal = sessions.filter((session) => {
      const sessionDate = new Date(session.created_at);
      return isThisWeek(sessionDate, { weekStartsOn: 1 });
    });
    return Math.round(
      weeklySessionTotal.reduce(
        (acc, session) => acc + session.session_duration,
        0
      ) / 1000
    );
  }

  const totalPractice = getWeeklyPracticeTotal();
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Practice Time This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">{totalPractice}</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}