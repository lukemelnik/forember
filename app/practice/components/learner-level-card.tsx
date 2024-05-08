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
import { totalDaysOnPlatform } from "@/lib/date-calculations";

export default async function LearnerLevelCard({
  sessions,
}: {
  sessions: Session[];
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !sessions) {
    return <div>Loading...</div>;
  }

  function getPracticeTotal() {
    return Math.round(
      sessions.reduce((acc, session) => acc + session.session_duration, 0) /
        (1000 * 60)
    );
  }

  // to set the learning level, first calculating total practice time, then calculating the number of days since the user joined the platform and calculating the daily practice average
  const { totalDays } = totalDaysOnPlatform(user.created_at);
  const totalPratice = getPracticeTotal();
  const averagePractice = Math.round(totalPratice / totalDays);

  // calculate how many more minutes per day will take the user to the next level

  const levels = [
    { name: "Infant", threshold: 0, emoji: "👶" },
    { name: "Beginner", threshold: 5, emoji: "🔰" },
    { name: "Rookie", threshold: 10, emoji: "🎓" },
    { name: "Novice", threshold: 15, emoji: "🏫" },
    { name: "Apprentice", threshold: 20, emoji: "👨‍🎓" },
    { name: "Journeyman", threshold: 30, emoji: "👨‍🔧" },
    { name: "Adept", threshold: 50, emoji: "👨‍🔬" },
    { name: "Master", threshold: 80, emoji: "👨‍💼" },
    { name: "Grandmaster", threshold: 120, emoji: "👨‍🎤" },
    { name: "Memory God", threshold: 240, emoji: "🧠" },
    { name: "Beyond Classification", threshold: Infinity, emoji: "🌌" },
  ];

  function currentCharacterLevel(averagePractice: number) {
    for (let i = 0; i < levels.length; i++) {
      if (averagePractice < levels[i].threshold) {
        return levels[i - 1];
      }
    }
  }
  function nextCharacterLevel(averagePractice: number) {
    for (let i = 0; i < levels.length; i++) {
      if (averagePractice <= levels[i].threshold) {
        return levels[i];
      }
    }
  }
  const currentLevel = currentCharacterLevel(averagePractice);
  const nextLevel = nextCharacterLevel(averagePractice);
  const remainingMinutes = nextLevel!.threshold - averagePractice;

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Your Learning Level:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="">
          <p className="font-black text-4xl">
            {currentLevel?.emoji} {currentLevel?.name}
          </p>
          <p className="italic">(Avg: {averagePractice} min per day)</p>
        </div>
      </CardContent>
      <CardFooter>
        <p>
          Practice {remainingMinutes} more minutes per day to reach{" "}
          <span className="font-bold">{nextLevel?.name}</span>!
        </p>
      </CardFooter>
    </Card>
  );
}
