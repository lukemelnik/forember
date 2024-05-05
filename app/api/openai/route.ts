import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const formData = await req.formData();
  const notes = formData.get("notes");
  if (!notes) {
    return Response.json("No prompt provided", { status: 400 });
  }
  const openAIResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `You are a knowledgeable teacher with years of experience helping students learn complex topics by breaking them down into understanable pieces. Take the following notes (deliniated between '---') and turn them into a reasonable amount of matching questions and answers that the student can use for flashcards to gain a deep understanding. Please only return your response in json format and add a relevant 'subject' key to each question and answer. Here are the notes: \n
    ---
    ${notes}
    ---
    `,
      },
    ],
    max_tokens: 100,
  });

  return Response.json(openAIResponse.choices[0].message.content, {
    status: 200,
  });
}
