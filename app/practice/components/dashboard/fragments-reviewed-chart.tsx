"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DailySession } from "./dashboard";
import { addRecallPercentage } from "@/lib/statistic-calculations";

export default function FragmentsReviewedChart({
  sessions,
  timeframe,
}: {
  sessions: DailySession[];
  timeframe: number;
}) {
  const userData = addRecallPercentage(sessions, timeframe);

  return (
    <div className="w-full lg:w-1/2">
      <h2 className="mb-3 ml-12 text-xl">Fragments Per Day</h2>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart width={500} height={250} data={userData} className="-ml-4">
          <Area
            type="monotone"
            dataKey="total_questions"
            stroke="#db2777 "
            fill="#db2777 "
          />

          <XAxis dataKey="month_and_day" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
