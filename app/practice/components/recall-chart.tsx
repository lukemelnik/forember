import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export default function RecallChart() {
  const data = [
    { day: "Monday", recall: 45 },
    { day: "Tuesday", recall: 50 },
    { day: "Wednesday", recall: 60 },
    { day: "Thursday", recall: 70 },
    { day: "Friday", recall: 80 },
    { day: "Saturday", recall: 90 },
    { day: "Sunday", recall: 100 },
  ];
  return (
    <LineChart width={700} height={400} data={data}>
      <Line type="monotone" dataKey="recall" stroke="#8884d8" />
      <XAxis dataKey="day" />
      <YAxis />
      <CartesianGrid stroke="#ccc" />
    </LineChart>
  );
}
