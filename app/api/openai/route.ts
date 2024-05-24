import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fragmentSchema = z.object({
  id: z.string(),
  question: z.string().min(5).max(500),
  answer: z.string().min(3).max(500),
  subject: z.string().min(3).max(100),
});

const fragmentArraySchema = z.array(fragmentSchema);

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // consider encrypting the user's email and including it as a 'user' parameter with the api reques to openai. That will allow you to monitor any abuse.

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
  const lqModel = "gpt-3.5-turbo-0125";
  const hqModel = "gpt-4o-2024-05-13";

  try {
    const openAIResponse = await openai.chat.completions.create({
      model: lqModel,
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable teacher with years of experience helping students learn complex topics by breaking them down into understanable pieces. A student gives your the following notes that they took while learning a new topic (deliniated between '---') and needs you to help with the following steps. Don't return anything until you've read all the instructions. \n
        Step 1 - Separate the notes into information chunks, so that each chunk covers a single fact, concept, or topic that the student should remember. \n

        Step 2 - Compare the chunks with the provided notes and ensure there are enough chunks to accurately represent ALL the information in the notes. The student will be tested on it later and penalized for any gaps in their knowledge. If any information is missing, add corresponding chunks. \n

        Step 3 - Create a question & answer pair for each chunk that the student will use for flashcards. Ensure that the question and answer pair will help the student fully grasp the material and make it as memorable as possible. Please try to use the student's own language & tone frome the notes. Also, please include a reference to the author, book, podcast, or general topic of the source material (not somethin generic like 'from the notes') at the beginning of every question. For example if the title of the notes is "From the Book 'Breath'" you could start the question like: 'in the book 'Breath', the author refers to this technique that can slow your heart rate'"\n

        Step 4 - Give each question and answer pair a descriptive subject \n

        Step 5 - Return the information as a JSON string in the following shape. If you feel you don't have sufficient information, return a JSON string with an empty array (ex. []): \n
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
        Step 6 - Double check the shape and validity of the returned JSON string. Make sure there are no unterminated strings or missing commas. ONLY RETURN THE JSON STRING OF QUESTIONS AND ANSWERS, NOTHING ELSE. You're output should be in the form of an API response. Do not include anything around the JSON string that indicates that it's code. If there are any issues, please correct them before returning the data. \n
        
      Here are the notes: \n
    ---
    ${notes}
    ---
    `,
        },
      ],
      max_tokens: 4096,
    });
    // have to parse the data from a JSON string to an array before you can check the contents with array methods.

    let response = openAIResponse.choices[0].message.content;
    console.log(response);

    if (!response) {
      throw new Error(
        "No data returned from AI model, please ensure your notes have enough content to generate fragments."
      );
    }

    let parsedContent;

    if (typeof response === "string") {
      parsedContent = JSON.parse(response);
    }

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
      throw new Error(
        "Invalid data returned from AI model, please generate again."
      );
    }

    return Response.json(parsedArray.data, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}
