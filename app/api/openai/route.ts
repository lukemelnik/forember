import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const reqData = await req.json();
  const notes = reqData.notes;

  if (!notes) {
    return Response.json("No prompt provided", { status: 400 });
  }

  const openAIResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `You are a knowledgeable teacher with years of experience helping students learn complex topics by breaking them down into understanable pieces. Take the following notes (deliniated between '---') and do the following: \n
        1. identify the key concepts that the student should remember \n
        2. Break each concept into pieces that we'll call 'fragments'. Each fragment should be easy to remember and fit in a single sentence \n
        3. Create a question & answer pair for each fragment that the studen will use for flashcards in order to practice active recall \n
        4. give each question and answer pair a high-level subject \n
        5. return all the data as a json object that looks like the following, with an object for each fragment: 
        [{"question": "sample question", "answer": "sample answer", "subject": "sample subject"}] \n
        Here are the notes: \n
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
