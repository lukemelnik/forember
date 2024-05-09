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
