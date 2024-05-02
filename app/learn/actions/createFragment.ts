"use server";

import { createClient } from "@/utils/supabase/server";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createFragmentSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Question must be at least 5 characters long" })
    .max(250, {
      message: "Question must be at most 250 characters long",
    }),
  answer: z
    .string()
    .min(3, { message: "Answer must be at least 3 characters long" })
    .max(250, { message: "Answer must be at most 250 characters long" }),
});

interface CreateFragmentFormState {
  errors: {
    question?: string[];
    answer?: string[];
    _form?: string[];
  };
}

export async function createFragment(
  formState: CreateFragmentFormState,
  Formdata: FormData
): Promise<CreateFragmentFormState> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // NEED TO VALIDATE SIGNED IN USER
  if (!user) {
    return {
      errors: { _form: ["You must be signed in to create a fragment"] },
    };
  }

  const result = createFragmentSchema.safeParse({
    question: Formdata.get("question"),
    answer: Formdata.get("answer"),
  });

  // validation errors
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // try/catch for writing to the db in order to catch errors and add them to the same form

  try {
    // set the next_show_date to tomorrow
    const currentDate = new Date();
    const tomorrow = addDays(currentDate, 1);

    const { error } = await supabase.from("fragment").insert({
      question: result.data.question,
      answer: result.data.answer,
      user_id: user.id,
      next_show_date: tomorrow,
    });
    if (error) {
      throw new Error("Could not create fragment");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } };
    } else {
      return { errors: { _form: ["Uh oh, something went wrong"] } };
    }
  }
  revalidatePath("/learn");
  // return an empty error object to keep everyone happy
  return { errors: {} };
}
