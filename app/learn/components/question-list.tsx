import { createClient } from "@/utils/supabase/server";
import React from "react";

export default async function QuestionList() {
  const supabase = createClient();
  const { data: fragments, error } = await supabase
    .from("fragment")
    .select("*");

  if (!fragments) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
  }

  return (
    <div>
      <h1>Questions</h1>
      {fragments.length === 0 && <p>No questions yet</p>}
      {fragments.map((fragment) => {
        return <p key={fragment.id}>{fragment.question}</p>;
      })}
    </div>
  );
}
