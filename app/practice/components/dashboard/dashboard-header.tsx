import React from "react";
import DashboardGreeting from "./dashboard-greeting";
import PracticeDialog from "../quiz/quiz-dialog";
import { createClient } from "@/utils/supabase/server";
import { isPast, startOfDay } from "date-fns";

export default async function DashboardHeader() {
  const supabase = createClient();
  const { data: profile, error } = await supabase.from("profile").select("*");
  const { data: sessions, error: sessionError } = await supabase
    .from("practice_session")
    .select("*");

  function getCurrentTime() {
    const date = new Date();
    let timeOfDay = "Morning";
    const hour = date.getHours();
    if (hour >= 0 && hour < 12) {
      timeOfDay = "Morning";
    } else if (hour >= 12 && hour < 16) {
      timeOfDay = "Afternoon";
    } else if (hour >= 16) {
      timeOfDay = "Evening";
    }
    return timeOfDay;
  }
  let timeOfDay = getCurrentTime();

  async function getFragments() {
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
      const fragmentNextShowDay = startOfDay(new Date(fragment.next_show_date));
      const today = startOfDay(new Date());
      return (
        fragmentNextShowDay.getTime() === today.getTime() ||
        fragment.last_shown_at === null ||
        isPast(fragmentNextShowDay)
      );
    });

    // Don't forget to set this to 'filteredFragments' after doing development testing
    return filteredFragments;
  }
  let fragments = await getFragments();
  if (!fragments) {
    fragments = [];
  }
  return (
    <div className="sm:flex justify-between items-center">
      <DashboardGreeting
        timeOfDay={timeOfDay}
        username={profile && profile.length > 0 ? profile[0].first_name : null}
        fragmentCount={fragments.length}
        sessionCheck={!!sessions}
      />
      <div>
        <p className="mb-5 hidden sm:block">{new Date().toDateString()}</p>
        <PracticeDialog />
      </div>
    </div>
  );
}
