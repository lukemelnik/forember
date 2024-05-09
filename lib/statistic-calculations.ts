import { Session } from "@/app/practice/components/learning-dashboard";

export function getRecallAverage(dailySessions: Session[]) {
  const totalRight = dailySessions.reduce(
    (acc, session) => acc + session.right_answers,
    0
  );
  const totalQuestions = dailySessions.reduce(
    (acc, session) => acc + session.total_questions,
    0
  );
  return Math.round((totalRight / totalQuestions) * 100);
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
  return Math.round(totalFragmentsReviewed / dailySessions.length);
}
