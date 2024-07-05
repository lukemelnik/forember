'use server'

import { createClient } from "@/utils/supabase/server";
import { Fragment } from "../../components/quiz/quiz";
import { revalidatePath } from "next/cache";
import {z} from 'zod'

// had to recreate this here for zod to access when running safeParse, when imported from the client side file it caused an error
const createFragmentSchema = z.object({
  question: z
    .string()
    .trim()
    .min(5, { message: "Question must be at least 5 characters long" })
    .max(500, {
      message: "Question must be at most 500 characters long",
    }),
  answer: z
    .string()
    .trim()
    .min(3, { message: "Answer must be at least 3 characters long" })
    .max(500, { message: "Answer must be at most 500 characters long" }),
});


export async function deleteFragment(fragment: Fragment) {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("fragment")
      .delete()
      .eq("id", fragment.id);
      revalidatePath('/library')
      return { success: true, message: "✅ Fragment deleted successfully." };
  } catch (error) {
    return { success: false, message: "🥲 An error occurred, please try again." };
  }
}

export async function updateFragment(data: FormData) {

  const values = {
    question: data.get("question"),
    answer: data.get("answer"),
  }
  const id = data.get("id")

  const parsed = createFragmentSchema.safeParse(values); 

  // returning a simple message because react hook form is already providing the error information client side. 
  if (!parsed.success) {
    return { success: false, message: "❌ Invalid form data, please try again." };
  }

  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("fragment")
      .update({question: parsed.data.question, answer: parsed.data.answer})
      .eq("id", id);
      revalidatePath('/library')
      return { success: true, message: "✅ Fragment updated successfully." };
  } catch (error) {
    return { success: false, message: "🥲 An error occurred, please try again." };
  }
}