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
import {
  getRecallAverage,
  getWeeklyRecallAverage,
} from "@/lib/statistic-calculations";
import { getDailySessions } from "@/lib/dailySessions";

export default function RecallPercentageCard({
  sessions,
}: {
  sessions: DailySession[];
}) {
  const recallAverage = getRecallAverage(sessions);
  const weeklyRecallAverage = getWeeklyRecallAverage(sessions);
  // thinking about logging the recall time, but questionable whether its useful because the content of the cards is so different. And not usefull to create an average from the whole session length because its affected by the answers they got wrong
  // this could be more valuable as a graph that shows recall for each category, ie. programming vs math vs history
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Weekly Recall 🧠</CardTitle>
      </CardHeader>
      <CardContent>
        {/* currently showing all time recall average but needs to be updated with a more useful metric */}
        <div className="flex gap-2 items-center">
          <h2 className="font-black text-4xl">
            {weeklyRecallAverage ? `${weeklyRecallAverage}%` : "No data"}
          </h2>
        </div>
      </CardContent>
      <CardFooter>
        <p>All-Time: {recallAverage}%</p>
      </CardFooter>
    </Card>
  );
}
