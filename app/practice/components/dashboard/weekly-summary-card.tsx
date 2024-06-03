"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useContext, useEffect } from "react";
import { DailySession, Profile, Session } from "./learning-dashboard";
import { createClient } from "@/utils/supabase/client";
import { isPast, startOfDay } from "date-fns";
import { Fragment } from "../quiz/quiz";
import RecallChart from "./recall-chart";
import { Separator } from "@/components/ui/separator";
import PracticeDialog from "../quiz/quiz-dialog";
import FragmentsReviewedChart from "./fragments-reviewed-chart";
import DashboardGreeting from "./dashboard-greeting";

export default function WeeklySummaryCard({
  profile,
  sessions,
}: {
  profile: Profile[];
  sessions: DailySession[];
}) {
  const [timeOfDay, setTimeOfDay] = React.useState("");
  const [fragments, setFragments] = React.useState<Fragment[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    function getCurrentTime() {
      const date = new Date();
      const hour = date.getHours();
      if (hour >= 0 && hour < 12) {
        setTimeOfDay("Morning");
      } else if (hour >= 12 && hour < 16) {
        setTimeOfDay("Afternoon");
      } else if (hour >= 16) {
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
          <div className="sm:flex justify-between items-center">
            <DashboardGreeting
              timeOfDay={timeOfDay}
              username={profile[0].first_name}
              sessionCheck={!!sessions}
              fragmentCount={fragments.length}
            />
            <div>
              <p className="mb-5 hidden sm:block">{date}</p>
              <PracticeDialog />
            </div>
          </div>

          <Separator className="bg-zinc-300 mt-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="lg:flex mb-10">
            <RecallChart sessions={sessions} />
            <FragmentsReviewedChart sessions={sessions} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
