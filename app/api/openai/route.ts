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

  const notes = await req.body;

  // if submitted directly from form:
  // const formData = await req.formData();
  // const notes = formData.get("notes");
  if (!notes) {
    return Response.json("No prompt provided", { status: 400 });
  }
  const openAIResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `You are a knowledgeable teacher with years of experience helping students learn complex topics by breaking them down into understanable pieces. Take the following notes (deliniated between '---') and turn them into a reasonable amount of matching questions and answers that the student can use for flashcards. Please only return your response as a valid json object without line breaks and add a relevant, one-word 'subject' key to each question and answer. Make the subject a higher level category - for example if the question is about a javascript method, the category would be 'programming'. Here are the notes: \n
    ---
    ${notes}
    ---
    `,
      },
    ],
    max_tokens: 1000,
  });

  // need to add a try/catch, pass on the error, as well as check that the response is valid JSON

  const flashCardJSONObject = JSON.parse(
    openAIResponse.choices[0].message.content
  );

  return Response.json(flashCardJSONObject, {
    status: 200,
  });
}
