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
    <div className="w-full lg:w-1/2">
      <h2 className="text-xl ml-16 mb-3">Recall Percentage</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart width={500} height={250} data={data} className="-ml-4">
          <Line type="monotone" dataKey="recall" stroke="#8884d8" />
          <XAxis dataKey="day" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
