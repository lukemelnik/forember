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
import { differenceInDays, isThisWeek } from "date-fns";
import { createClient } from "@/utils/supabase/server";

export default async function LearnerLevelCard({
  sessions,
}: {
  sessions: Session[];
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No user found");
  }

  function getPracticeTotal() {
    return Math.round(
      sessions.reduce((acc, session) => acc + session.session_duration, 0) /
        (1000 * 60)
    );
  }

  // to set the learning level, first calculating total practice time, then calculating the number of days since the user joined the platform and calculating the daily practice average
  const currentDate = new Date();
  const joinedDate = new Date(user.created_at);
  const totalDays = differenceInDays(currentDate, joinedDate);
  const totalPratice = getPracticeTotal();
  const averagePractice = totalPratice / totalDays;

  // a function that assigns a character level based on average practice

  function assignCharacterLevel(averagePractice: number) {
    if (averagePractice <= 0) {
      return "Infant";
    } else if (averagePractice <= 15) {
      return "Beginner";
    } else if (averagePractice <= 30) {
      return "Rookie";
    } else if (averagePractice <= 60) {
      return "Novice";
    } else if (averagePractice <= 90) {
      return "Apprentice";
    } else if (averagePractice <= 120) {
      return "Journeyman";
    } else if (averagePractice <= 150) {
      return "Adept";
    } else if (averagePractice <= 180) {
      return "Master";
    } else if (averagePractice <= 210) {
      return "Grandmaster";
    } else if (averagePractice <= 240) {
      return "Memory God";
    } else {
      return "Beyond Classification";
    }
  }

  const learningCharacter = assignCharacterLevel(averagePractice);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Your Learning Level:</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">{learningCharacter}</p>
      </CardContent>
      <CardFooter>
        <p>Minutes</p>
      </CardFooter>
    </Card>
  );
}
