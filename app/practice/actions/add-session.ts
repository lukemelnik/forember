"use server";

import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";

export async function logSession(
  startTime: Date,
  testScore: { right: number; wrong: number },
) {
  const endTime = new Date();

  const total_questions = testScore.right + testScore.wrong;
  if (total_questions === 0) {
    return;
  }
  const session_score = Math.round(
    (testScore.right / (testScore.right + testScore.wrong)) * 100,
  );

  const session_duration = endTime.getTime() - startTime.getTime();
  if (session_duration < 1500) {
    return;
  }
  const supabase = createClient();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No user found");
    }

    const { error: dbError } = await supabase.from("practice_session").insert([
      {
        session_duration,
        user_id: user.id,
        session_score,
        right_answers: testScore.right,
        total_questions,
        created_at: format(new Date(), "yyyy-MM-dd"),
      },
    ]);
  } catch (error) {
    console.error(error);
  }
}
