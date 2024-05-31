import { Session } from "@/app/practice/components/learning-dashboard";
import { isSameDay } from "date-fns";

// Function aggregates sessions for each day in case the user has multiple sessions in a day. This could benefit from a specific db view I think

export function getDailySessions(sessions: Session[]) {
  console.log("Sessions: ", sessions);
  let dailySessions: Session[] = [];
  // an object to accumulate the total session duration and total questions for a single day
  let dailyTotal = {
    session_duration: 0,
    created_at: "",
    total_questions: 0,
    right_answers: 0,
  };
  // check for edge cases of zero sessions or a single session
  if (sessions.length === 0) {
    return dailySessions;
  }
  if (sessions.length === 1) {
    dailySessions.push(sessions[0]);
    return dailySessions;
  }

  // loop through the array and accumulate values from the same day
  for (let i = 0; i < sessions.length; i++) {
    // if theres no next session, and there's no accumulated total, then push the session to daily sessions
    if (!sessions[i + 1] && dailyTotal.session_duration === 0) {
      dailySessions.push(sessions[i]);
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
      dailyTotal = {
        session_duration: 0,
        created_at: "",
        total_questions: 0,
        right_answers: 0,
      };
    }
  }
  console.log("Daily Sessions: ", dailySessions);
  return dailySessions;
}
