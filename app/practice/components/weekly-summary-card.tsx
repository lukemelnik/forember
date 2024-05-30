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
import { createClient } from "@/utils/supabase/client";
import { isPast, startOfDay } from "date-fns";
import { Fragment } from "./quiz";

export default function WeeklySummaryCard({
  profile,
  sessions,
}: {
  profile: Profile[];
  sessions: Session[];
}) {
  const [timeOfDay, setTimeOfDay] = React.useState("");
  const [fragments, setFragments] = React.useState<Fragment[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  useEffect(() => {
    async function getFragments() {
      setLoading(true);
      const supabase = createClient();
      const { data: fragments, error } = await supabase
        .from("fragment")
        .select("*")
        .eq("is_complete", false);
      if (error) {
        console.log(error);
      }
      if (!fragments) return;

      // conditions for showing the fragment:
      // 1. if the fragment has never been shown
      // 2. if the fragment has been shown and the next show date is today
      // 3. if the fragment has been shown and the next show date is in the past (i.e. user missed a day)
      // this should actually be moved to the db query, but I'm doing it here for now
      const filteredFragments = fragments.filter((fragment) => {
        const fragmentNextShowDay = startOfDay(
          new Date(fragment.next_show_date)
        );
        const today = startOfDay(new Date());
        return (
          fragmentNextShowDay.getTime() === today.getTime() ||
          fragment.last_shown_at === null ||
          isPast(fragmentNextShowDay)
        );
      });

      // Don't forget to set this to 'filteredFragments' after doing development testing
      setFragments(filteredFragments);
    }
    getFragments();
    setLoading(false);
  }, []);

  const date = new Date().toDateString();
  return (
    <Card className="h-96 w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <h1>
              Good{" "}
              {timeOfDay && profile && `${timeOfDay} ${profile[0].first_name}`}
            </h1>
            <p>{date}</p>
          </div>
          <p className="pt-2 font-thin">
            It's time to shred! You've got {fragments.length} fragments to
            review.
          </p>
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
