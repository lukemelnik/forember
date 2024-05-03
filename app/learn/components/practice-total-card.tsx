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
  const currentDate = new Date();
  function getPracticeTotal() {
    return Math.round(
      sessions.reduce((acc, session) => acc + session.session_duration, 0) /
        1000
    );
  }
  const totalPractice = getPracticeTotal();
  return (
    <Card className="max-w-md">
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