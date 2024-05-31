import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function FragmentsReviewedChart() {
  const data = [
    { day: "Mon", amount: 10 },
    { day: "Tues", amount: 16 },
    { day: "Wed", amount: 4 },
    { day: "Thurs", amount: 0 },
    { day: "Fri", amount: 21 },
    { day: "Sat", amount: 17 },
    { day: "Sun", amount: 30 },
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart width={500} height={250} data={data}>
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        <XAxis dataKey="day" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
      </LineChart>
    </ResponsiveContainer>
  );
}
