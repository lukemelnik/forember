import { Session } from "@/app/practice/components/learning-dashboard";
import { isThisWeek } from "date-fns";

export function getRecallAverage(dailySessions: Session[]) {
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
  if (weeklySessions.length === 0) return "No review this week";
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
