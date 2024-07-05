'use server'

import { createClient } from "@/utils/supabase/server";
import { Fragment } from "../../components/quiz/quiz";
import { revalidatePath } from "next/cache";
import { createFragmentSchema } from "../../components/editable-fragment";


export async function deleteFragment(fragment: Fragment) {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("fragment")
      .delete()
      .eq("id", fragment.id);
      revalidatePath('/library')
  } catch (error) {
    console.log(error);
  }
}

export async function updateFragment(data: FormData) {

  const values = {
    id: data.get("id"),
    question: data.get("question"),
    answer: data.get("answer"),
  }

  const parsed = createFragmentSchema.safeParse(values); 

  if (!parsed.success) {
    return { message: "Invalid form data, please try again." };
  }

  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("fragment")
      .update({question: parsed.data.question, answer: parsed.data.answer})
      .eq("id", values.id);
      revalidatePath('/library')
      return { message: "Fragment updated successfully." };
  } catch (error) {
    console.log(error);
  }
}