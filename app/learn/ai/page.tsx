"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { set } from "date-fns";
import React, { useState } from "react";

export default function AIPage() {
  const [questions, setQuestions] = useState([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const notes = formData.get("notes") as string;
    const response = await fetch("/api/openai", {
      method: "POST",
      body: JSON.stringify({ notes }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setQuestions(data.questions);
    console.log(data.questions);
  }
  return (
    <div>
      <h1>Create Fragments using OpenAI</h1>
      <form
        onSubmit={handleSubmit}
        className="min-w-2xl rounded flex flex-col items-left gap-2 max-w-2xl text-zinc-950 mt-10"
      >
        <Label className="text-zinc-300" htmlFor="notes">
          Enter Your Notes
        </Label>
        <Textarea className="bg-black text-zinc-300" id="notes" name="notes" />
        <Button className="bg-zinc-300 mt-5" type="submit">
          Create Fragments
        </Button>
      </form>
      {questions.length > 0 &&
        questions.map((question) => (
          <div key={question} className="mt-5">
            <h2>{question.subject}</h2>
          </div>
        ))}
    </div>
  );
}
