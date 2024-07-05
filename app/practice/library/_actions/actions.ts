'use server'

import { createClient } from "@/utils/supabase/server";
import { Fragment } from "../../components/quiz/quiz";
import { revalidatePath } from "next/cache";


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