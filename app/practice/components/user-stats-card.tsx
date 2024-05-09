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

export default function PracticeTotalCard({
  sessions,
}: {
  sessions: Session[];
}) {
  function getPracticeTotal() {
    const totalInMs = Math.round(
      sessions.reduce((acc, session) => acc + session.session_duration, 0)
    );
    // convert to minutes
    return Math.round(totalInMs / (1000 * 60));
  }

  const totalPractice = getPracticeTotal();
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Total Practice Time</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">{totalPractice}</p>
      </CardContent>
      <CardFooter>
        <p>Minutes</p>
      </CardFooter>
    </Card>
  );
}
