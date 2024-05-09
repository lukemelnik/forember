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
  differenceInDays,
  format,
  isSameDay,
  isThisWeek,
  startOfDay,
} from "date-fns";
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

  // user could have multiple sessions on a single day, so we need to aggreate the daily sessions into a single object. Should look into making this a db funciton in the future
  let dailySessions: Session[] = [];
  getDailySessions(sessions);
  console.log(dailySessions);

  function getDailySessions(sessions: Session[]) {
    // an object to accumulate the total session duration and total questions for a single day
    let dailyTotal = {
      session_duration: 0,
      created_at: "",
      total_questions: 0,
      right_answers: 0,
    };
    // check for edge cases of zero sessions or a single session
    if (sessions.length === 0) {
      return;
    }
    if (sessions.length === 1) {
      dailySessions.push(sessions[0]);
      return;
    }

    // loop through the array and accumulate values from the same day
    for (let i = 0; i < sessions.length; i++) {
      // if theres no next session, and there's no accumulated total, then push the session to daily sessions
      if (!sessions[i + 1] && dailyTotal.session_duration === 0) {
        dailySessions.push(sessions[i]);
        console.log("pushed from the first block");
        break;
      } else if (!sessions[i + 1] && dailyTotal.session_duration !== 0) {
        // i.e. if there is no next session, but there's an acculated total, then the current value must be from the same date as the previous session, so add it and push them to the daily sessions array
        dailyTotal = {
          session_duration:
            dailyTotal.session_duration + sessions[i].session_duration,
          created_at: sessions[i].created_at,
          total_questions:
            dailyTotal.total_questions + sessions[i].total_questions,
          right_answers: dailyTotal.right_answers + sessions[i].right_answers,
        };
        dailySessions.push(dailyTotal);
        console.log("pushed from the second block");
        break;
      }
      // if the next session is not on the same day, and there's no accumulated total, then push the session to daily sessions
      if (
        !isSameDay(
          new Date(sessions[i].created_at),
          new Date(sessions[i + 1].created_at)
        ) &&
        dailyTotal.session_duration === 0
      ) {
        dailySessions.push(sessions[i]);
        console.log("pushed total from the second last block");
      }

      //otherwise, if the next session is on the same day, then accumulate then add the metrics to the dailyTotal object
      if (
        isSameDay(
          new Date(sessions[i + 1].created_at),
          new Date(sessions[i].created_at)
        )
      ) {
        dailyTotal = {
          session_duration:
            dailyTotal.session_duration + sessions[i].session_duration,
          created_at: sessions[i].created_at,
          total_questions:
            dailyTotal.total_questions + sessions[i].total_questions,
          right_answers: dailyTotal.right_answers + sessions[i].right_answers,
        };
      } else {
        //if the next session is not on the same day, and there's an accumulated total, then add the current session metrics, push it to the daily sessions array, and reset the dailyTotal object
        dailyTotal = {
          session_duration:
            dailyTotal.session_duration + sessions[i].session_duration,
          created_at: sessions[i].created_at,
          total_questions:
            dailyTotal.total_questions + sessions[i].total_questions,
          right_answers: dailyTotal.right_answers + sessions[i].right_answers,
        };
        dailySessions.push(dailyTotal);
        console.log("pushed daily total from the last block!");
        console.log(
          "date of [i]",
          new Date(sessions[i].created_at).toLocaleDateString()
        );
        console.log(
          "date of [i+1]",
          new Date(sessions[i + 1].created_at).toLocaleDateString()
        );
        dailyTotal = {
          session_duration: 0,
          created_at: "",
          total_questions: 0,
          right_answers: 0,
        };
      }
    }
  }

  // then need an algorith to determine user's 'learning level' which should be a mix of the amount of questions they review per day, their recall accuracy, and the amount of time they spend practicing

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
        {dailySessions.map((session) => (
          <CardDescription key={session.created_at}>
            {new Date(session.created_at).toLocaleDateString()}
          </CardDescription>
        ))}
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
