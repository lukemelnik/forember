import { createClient } from "@/utils/supabase/server";
import React from "react";
import FlashCard from "./flash-card";

export type Fragment = {
  id: string;
  question: string;
  answer: string;
};

export default async function QuestionList() {
  const supabase = createClient();
  const { data: fragments, error } = await supabase
    .from("fragment")
    .select("id, question, answer");

  if (!fragments) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
  }

  return (
    <div>
      <h1>Questions</h1>
      <FlashCard fragment={fragments[0]} />
      {fragments.length === 0 && <p>No questions yet</p>}
      {fragments.map((fragment) => (
        <div key={fragment.id}>
          <p>{fragment.question}</p>
          <p className="text-green-700">{fragment.answer}</p>
        </div>
      ))}
    </div>
  );
}
