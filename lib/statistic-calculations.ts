import {
  DailySession,
  Session,
} from "@/app/practice/components/dashboard/dashboard";
import { uniqueSession } from "@/app/practice/components/dashboard/streak-card";
import { format, isThisWeek, isYesterday, startOfDay, differenceInDays } from "date-fns";

export function getRecallAverage(sessions: DailySession[]) {
  const totalRight = sessions.reduce(
    (acc, session) => acc + session.total_right_answers,
    0,
  );
  const totalQuestions = sessions.reduce(
    (acc, session) => acc + session.total_questions,
    0,
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
    sessions.reduce((acc, session) => acc + session.session_duration, 0),
  );
  // convert to minutes
  return Math.round(totalInMs / (1000 * 60));
}

export function getAverageFragmentsReviewed(dailySessions: Session[]) {
  const totalFragmentsReviewed = dailySessions.reduce(
    (acc, session) => acc + session.total_questions,
    0,
  );
  if (totalFragmentsReviewed === 0) return 0;
  return Math.round(totalFragmentsReviewed / dailySessions.length);
}

export function getStreak(sessionDates: { session_date: string }[]) {
  if (sessionDates.length === 0) return 0;
  const DAY_IN_MS = 24 * 60 * 60 * 1000;

  const today = startOfDay(new Date());
  let streak = 0;
  let previousDate = today;

  for (const { session_date } of sessionDates) {
    const currentDate = startOfDay(new Date(session_date));
    const dayDifference = previousDate.getTime() - currentDate.getTime();
    console.log(dayDifference);

    // if latest session is today, dayDifference will be 0, otherwise = DAY_IN_MS
    if (dayDifference <= DAY_IN_MS) {
      streak++;
      previousDate = currentDate;
    } else {
      break;
    }
  }

  return streak;
}

export function addRecallPercentage(sessions: DailySession[], timeframe: number) {
  // -timeframe selects sessions from the most recent backwards
  // this function just calculates the recall percentage for each session and passes back an array to be displayed in the dashboard. 
  const userData = sessions.slice(-timeframe).map((session) => {
    const recallPerecentage = Math.round(
      (session.total_right_answers / session.total_questions) * 100,
    );
    return {
      ...session,
      recall: recallPerecentage,
    };
  });
  return userData;
}