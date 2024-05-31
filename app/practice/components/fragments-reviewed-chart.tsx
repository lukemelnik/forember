import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DailySession } from "./learning-dashboard";

export default function FragmentsReviewedChart({
  sessions,
}: {
  sessions: DailySession[];
}) {
  const lastSevenSessions = sessions.slice(-7).map((session) => {
    const recallPerecentage = Math.round(
      (session.total_right_answers / session.total_questions) * 100
    );

    return {
      ...session,
      session_date: session.session_date,
      recall: recallPerecentage,
      // need to fix this to compensate for time zone, right now its off by a day
      month_day: new Date(session.session_date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      }),
    };
  });
  return (
    <div className="w-full lg:w-1/2">
      <h2 className="text-xl ml-16 mb-3">Fragments Per Day</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          width={500}
          height={250}
          data={lastSevenSessions}
          className="-ml-4"
        >
          <Line type="monotone" dataKey="total_questions" stroke="#8884d8" />
          <XAxis dataKey="month_day" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
