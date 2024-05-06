import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fragmentSchema = z.object({
  id: z.string(),
  question: z.string().min(5).max(250),
  answer: z.string().min(3).max(250),
  subject: z.string().min(3).max(50),
});

const fragmentArraySchema = z.array(fragmentSchema);

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const reqData = await req.json();
  const notes = reqData.notes;

  if (!notes) {
    return Response.json(
      { error: "Please enter notes before generating." },
      {
        status: 400,
      }
    );
  }
  // should probably add even more validation here so the input has to be above a certain length, since we're using tokens just to send the prompt

  // add a section to the prompt called 'issues' where the ai model can point out any factual errors in the notes. Will display them separately from the flashcard options.

  try {
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `You are a knowledgeable teacher with years of experience helping students learn complex topics by breaking them down into understanable pieces. Take the following notes (deliniated between '---') and do the following: \n
        1. identify the key concepts that the student should remember \n
        2. Break each concept into pieces that we'll call 'fragments'. Each fragment should be easy to remember Iand fit in a single sentence \n
        3. Create a question & answer pair for each fragment that the studen will use for flashcards in order to practice active recall. Ensure that the question and answer pair will help the student full grasp the material and make it as memorable as possible. \n
        4. give each question and answer pair a high-level subject \n
        5. return the information as a JSON string in the following shape: \n
        [
          {
            "question": "sample question that highlights a major concept",
            "answer": "succinct answer that helps the student remember the concept",
            "subject": "sample subject"
          },
          {
            "question": "sample question that highlights another major concept",
            "answer": "succinct answer that helps the student remember the concept",
            "subject": "sample subject"
          },
        ]
        \n
        If no concepts are identified, or they violate your policies, return an empty array. Here are the notes: \n
    ---
    ${notes}
    ---
    `,
        },
      ],
      max_tokens: 1000,
    });
    // have to parse the data from a JSON string to an array before you can check the contents with array methods.

    if (!openAIResponse.choices[0].message.content) {
      throw new Error(
        "No data returned from AI model, please ensure your notes have enough content to generate fragments."
      );
    }
    console.log(openAIResponse.choices[0].message.content);
    let parsedContent = JSON.parse(openAIResponse.choices[0].message.content);

    console.log(parsedContent);

    if (!Array.isArray(parsedContent)) {
      throw new Error("Returned data is not an array");
    }

    if (parsedContent.length === 0) {
      throw new Error(
        "No data returned from AI model, please ensure your notes have enough content to generate fragments."
      );
    }

    // generate temporary id for displaying on client
    for (let fragment of parsedContent) {
      fragment.id = Math.random().toString(36).substring(7);
    }
    // parse the array of generated fragments with Zod to make sure they are valid before sending back to client. There's a chance the llm doesn't format the generated data properly
    const parsedArray = fragmentArraySchema.safeParse(parsedContent);
    if (!parsedArray.success) {
      throw new Error("Invalid data returned from AI model");
    }

    return Response.json(parsedArray.data, {
      status: 200,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
