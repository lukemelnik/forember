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

export default function RecallPercentageCard({
  sessions,
}: {
  sessions: Session[];
}) {
  const recallAverage = getRecallAverage(sessions);
  // thinking about logging the recall time, but questionable whether its useful because the content of the cards is so different. And not usefull to create an average from the whole session length because its affected by the answers they got wrong
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Recall Percentage</CardTitle>
      </CardHeader>
      <CardContent>
        {/* this is all-time but would probably be better as 'your recall average this week, vs last week' */}
        <div className="flex gap-2 items-center">
          <h2 className="font-black text-4xl">{recallAverage}%</h2>
        </div>
      </CardContent>
      <CardFooter>
        <p>All-Time Average</p>
      </CardFooter>
    </Card>
  );
}
