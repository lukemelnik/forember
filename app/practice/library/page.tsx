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
    <div className="text-white md:p-20">
      <h1 className="mb-4">Your Knowledge Library:</h1>
      {data.map((fragment) => (
        <div key={fragment.id} className="mb-4">
          <p className="font-bold">Q: {fragment.question}</p>
          <p>A: {fragment.answer}</p>
        </div>
      ))}
    </div>
  );
}
