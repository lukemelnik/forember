import { createClient } from "@/utils/supabase/server";
import React from "react";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from("fragment").select("*");
  if (error) {
    console.error(error);
    return <div>Error</div>;
  }
  console.log(data);
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="text-white">
      <h1>Your Knowledge Library:</h1>
      {data.map((fragment) => (
        <div key={fragment.id}>
          <p className="font-bold">{fragment.question}</p>
          <p>{fragment.answer}</p>
        </div>
      ))}
    </div>
  );
}
