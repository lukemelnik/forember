import { Session } from "@/app/practice/components/learning-dashboard";
import { uniqueSession } from "@/app/practice/components/streak-card";
import { isThisWeek, startOfDay } from "date-fns";
import { getDailySessions } from "./dailySessions";

export function getRecallAverage(sessions: Session[]) {
  const dailySessions = getDailySessions(sessions);
  const totalRight = dailySessions.reduce(
    (acc, session) => acc + session.right_answers,
    0
  );
  const totalQuestions = dailySessions.reduce(
    (acc, session) => acc + session.total_questions,
    0
  );
  if (totalQuestions === 0) return "";
  return Math.round((totalRight / totalQuestions) * 100);
}

export function getWeeklyRecallAverage(sessions: Session[]) {
  const weeklySessions = sessions.filter((session) => {
    const sessionDate = new Date(session.created_at);
    return isThisWeek(sessionDate, { weekStartsOn: 1 });
  });
  if (weeklySessions.length === 0) return 0;
  return getRecallAverage(weeklySessions);
}

export function lastSevenDaysRecall(sessions: Session[]) {
  const lastSevenDaysSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.created_at);
    return startOfDay(new Date()).getTime() - sessionDate.getTime() <= 7;
  });
  if (lastSevenDaysSessions.length === 0) return 0;
  return getRecallAverage(lastSevenDaysSessions);
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

export function getStreak(uniqueSessions: uniqueSession[]) {
  let streak = 0;
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  const lastSesssion = uniqueSessions[uniqueSessions.length - 1];
  if (uniqueSessions.length === 1 || uniqueSessions.length === 0) return streak;

  // dates are arriving in chronological order from the db so we can start from the end and work our way back.
  for (let i = uniqueSessions.length - 1; i >= 0; i--) {
    if (!uniqueSessions[i - 1]) return streak;
    let currentDate = new Date(uniqueSessions[i].created_date);
    console.log(currentDate);
    let dateMinusOne = new Date(uniqueSessions[i - 1].created_date);
    const dateDifference = currentDate.getTime() - dateMinusOne.getTime();
    console.log("Diff: ", dateDifference);
    console.log("Days Diff: ", dateDifference / MILLISECONDS_PER_DAY);
    if (dateDifference === MILLISECONDS_PER_DAY) {
      streak++;
    } else {
      return streak;
    }
  }
}
