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
import { getRecallAverage } from "@/lib/statistic-calculations";

export default function PracticeTotalCard({
  sessions,
}: {
  sessions: Session[];
}) {
  const recallAverage = getRecallAverage(sessions);
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Learning Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {/* this is all-time but would probably be better as 'your recall average this week, vs last week' */}
        <h2>Recall Average: {recallAverage}%</h2>
      </CardContent>
      <CardFooter>
        <p>Minutes</p>
      </CardFooter>
    </Card>
  );
}
