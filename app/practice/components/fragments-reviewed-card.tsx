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
import {
  getAverageFragmentsReviewed,
  getRecallAverage,
} from "@/lib/statistic-calculations";
import { get } from "http";
import { getDailySessions } from "@/lib/dailySessions";

export default function FragmentsReviewedCard({
  sessions,
}: {
  sessions: Session[];
}) {
  const dailySessions = getDailySessions(sessions);
  const averageFragmentsReviewed = getAverageFragmentsReviewed(dailySessions);
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Daily Appetite</CardTitle>
      </CardHeader>
      <CardContent>
        {/* this is all-time but would probably be better as 'your recall average this week, vs last week' */}
        <div className="flex gap-2 items-center">
          <h2 className="font-black text-4xl">{averageFragmentsReviewed}</h2>
        </div>
      </CardContent>
      <CardFooter>
        <p>Fragments Per Day</p>
      </CardFooter>
    </Card>
  );
}
