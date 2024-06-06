"use server";

import { createClient } from "@/utils/supabase/server";
import { addDays } from "date-fns";
import { Fragment } from "../components/quiz/quiz";
import { toast } from "sonner";

export async function increaseInterval(fragment: Fragment) {
  const increasedInterval = fragment.interval + 1;
  let is_complete = false;
  // once a fragment has made it to an interval of two weeks, it is considered complete and won't be shown again in the quiz
  // this will become a user adjustable setting in the future (set it in the profile)
  if (increasedInterval > 14) {
    is_complete = true;
  }
  const next_show_date = addDays(new Date(), increasedInterval);
  const supabase = createClient();
  const { error } = await supabase
    .from("fragment")
    .update({
      interval: fragment.interval + 1,
      next_show_date,
      last_shown_at: new Date(),
      is_complete,
    })
    .eq("id", fragment.id);
  if (error) {
    console.log(error);
  }
}

export async function resetInterval(id: string) {
  const date = addDays(new Date(), 1);
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("fragment")
      .update({
        interval: 1,
        next_show_date: date,
        last_shown_at: new Date(),
      })
      .eq("id", id);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFragment(fragment: Fragment) {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("fragment")
      .delete()
      .eq("id", fragment.id);
    toast("Fragment deleted 🗑️", { duration: 2000 });
  } catch (error) {
    console.log(error);
  }
}
