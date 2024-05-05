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
  const prompt = formData.get("notes");
  if (!prompt) {
    return Response.json("No prompt provided", { status: 400 });
  }
  const openAIResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
  });

  return Response.json(openAIResponse.choices[0].message.content, {
    status: 200,
  });
}
