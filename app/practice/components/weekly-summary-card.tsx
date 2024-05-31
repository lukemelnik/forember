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
import RecallChart from "./recall-chart";
import { Separator } from "@/components/ui/separator";
import PracticeDialog from "./practice-dialog";
import FragmentsReviewedChart from "./fragments-reviewed-chart";

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
    <Card className=" md:col-span-3">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1>
                Good{" "}
                {timeOfDay &&
                  profile &&
                  `${timeOfDay} ${profile[0].first_name}`}
              </h1>
              {fragments.length > 0 ? (
                <p className="pt-2 font-thin">
                  It's time to shred! You've got {fragments.length} fragments to
                  review.
                </p>
              ) : // when you're done for the day
              sessions.length > 0 ? (
                <p className="pt-2 font-thin">
                  No fragments left to review, keep up the good work!
                </p>
              ) : (
                // for first time visitors
                <p className="pt-2 font-thin">
                  No fragments to review - time to start adding some knowledge!{" "}
                </p>
              )}
            </div>
            <div>
              <p className="mb-5">{date}</p>
              <PracticeDialog />
            </div>
          </div>

          <Separator className="bg-zinc-300 mt-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="lg:flex">
          <RecallChart />
          <FragmentsReviewedChart />
        </div>
      </CardContent>
      <CardFooter>
        <p>Footer</p>
      </CardFooter>
    </Card>
  );
}
