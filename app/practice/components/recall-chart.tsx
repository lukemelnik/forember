import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function RecallChart() {
  const data = [
    { day: "Mon", recall: 45 },
    { day: "Tues", recall: 50 },
    { day: "Wed", recall: 60 },
    { day: "Thurs", recall: 70 },
    { day: "Fri", recall: 80 },
    { day: "Sat", recall: 90 },
    { day: "Sun", recall: 100 },
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart width={500} height={250} data={data}>
        <Line type="monotone" dataKey="recall" stroke="#8884d8" />
        <XAxis dataKey="day" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
      </LineChart>
    </ResponsiveContainer>
  );
}
