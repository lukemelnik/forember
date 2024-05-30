"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import { Profile, Session } from "./learning-dashboard";

export default function WeeklySummaryCard({
  profile,
  sessions,
}: {
  profile: Profile[];
  sessions: Session[];
}) {
  const [timeOfDay, setTimeOfDay] = React.useState("");

  useEffect(() => {
    function getCurrentTime() {
      const date = new Date();
      const hour = date.getHours();
      if (hour >= 12 && hour < 16) {
        setTimeOfDay("Afternoon");
      } else if (hour >= 18) {
        setTimeOfDay("Evening");
      }
    }
    getCurrentTime();
  });

  const date = new Date().toDateString();
  return (
    <Card className="h-96 w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <h1>
              {timeOfDay &&
                profile &&
                `Good ${timeOfDay} ${profile[0].first_name}`}
            </h1>
            <p>{date}</p>
          </div>
          <p className="pt-2">It's time to shred.</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">CONTENT</p>
      </CardContent>
      <CardFooter>
        <p>Footer</p>
      </CardFooter>
    </Card>
  );
}
