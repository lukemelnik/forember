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
import { calculateUserData } from "@/lib/statistic-calculations";

export default function RecallChart({
  sessions,
  timeframe,
}: {
  sessions: DailySession[];
  timeframe: number;
}) {
  const userData = calculateUserData(sessions, timeframe);
  return (
    <div className="w-full lg:w-1/2">
      <h2 className="text-xl ml-16 mb-3">Recall Percentage</h2>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart width={500} height={250} data={userData} className="-ml-4">
          <Area
            type="monotone"
            dataKey="recall"
            stroke="#8884d8"
            fill="#8884d8"
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
