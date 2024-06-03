import {
  DailySession,
  Session,
} from "@/app/practice/components/dashboard/dashboard";
import { uniqueSession } from "@/app/practice/components/dashboard/streak-card";
import { format, isThisWeek, isYesterday, startOfDay } from "date-fns";

export function getRecallAverage(sessions: DailySession[]) {
  const totalRight = sessions.reduce(
    (acc, session) => acc + session.total_right_answers,
    0
  );
  const totalQuestions = sessions.reduce(
    (acc, session) => acc + session.total_questions,
    0
  );
  if (totalQuestions === 0) return "";
  return Math.round((totalRight / totalQuestions) * 100);
}

export function getWeeklyRecallAverage(sessions: DailySession[]) {
  const weeklySessions = sessions.filter((session) => {
    const sessionDate = new Date(session.session_date);
    return isThisWeek(sessionDate, { weekStartsOn: 1 });
  });
  if (weeklySessions.length === 0) return 0;
  return getRecallAverage(weeklySessions);
}

export function getPracticeTotal(sessions: Session[]) {
  const totalInMs = Math.round(
    sessions.reduce((acc, session) => acc + session.session_duration, 0)
  );
  // convert to minutes
  return Math.round(totalInMs / (1000 * 60));
}

export function getAverageFragmentsReviewed(dailySessions: Session[]) {
  const totalFragmentsReviewed = dailySessions.reduce(
    (acc, session) => acc + session.total_questions,
    0
  );
  if (totalFragmentsReviewed === 0) return 0;
  return Math.round(totalFragmentsReviewed / dailySessions.length);
}

export function getStreak(sessionDates: { session_date: string }[]) {
  let streak = 0;
  // calculate number of milliseconds in a day
  const MILLISECONDS_PER_DAY = 86400000;
  // if there are no sessions the streak is 0
  if (sessionDates.length === 0) return streak;
  // get today's date with no timezone & time
  const today = format(new Date(), "yyyy-MM-dd");
  let todayWithTime = new Date(today);
  const mostRecentSession = new Date(sessionDates[0].session_date);
  // if the user did a session today their streak is 1
  // MUST CONVERT FROM AN OBJECT TO A STRING or they won't be equivalent
  if (mostRecentSession.getTime() === todayWithTime.getTime()) {
    streak = 1;
    console.log("did a session today, streak is 1");
  }

  for (let i = 0; i < sessionDates.length - 1; i++) {
    if (!sessionDates[i + 1]) return streak;
    let currentDate = new Date(sessionDates[i].session_date);
    let datePlusOne = new Date(sessionDates[i + 1].session_date);
    const dateDifference = currentDate.getTime() - datePlusOne.getTime();
    if (dateDifference === MILLISECONDS_PER_DAY) {
      streak++;
    } else {
      console.log("Date difference: ", dateDifference, "Streak: ", streak);
      return streak;
    }
  }
}

export function calculateUserData(sessions: DailySession[], timeframe: number) {
  const userData = sessions.slice(-timeframe).map((session) => {
    const recallPerecentage = Math.round(
      (session.total_right_answers / session.total_questions) * 100
    );
    return {
      ...session,
      recall: recallPerecentage,
    };
  });
  return userData;
}
