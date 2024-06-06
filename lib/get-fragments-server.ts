import { createClient } from "@/utils/supabase/server";
import { isPast, startOfDay } from "date-fns";

export async function getFragmentsServer() {
  console.log("FETCHING FRAGMENTS");
  const supabase = createClient();
  const { data: fragments, error } = await supabase
    .from("fragment")
    .select("*")
    .eq("is_complete", false);
  if (error) {
    console.log(error);
  }
  if (!fragments) return;

  // conditions for showing the fragment:
  // 1. if the fragment has never been shown
  // 2. if the fragment has been shown and the next show date is today
  // 3. if the fragment has been shown and the next show date is in the past (i.e. user missed a day)
  // this should actually be moved to the db query, but I'm doing it here for now
  const filteredFragments = fragments.filter((fragment) => {
    const fragmentNextShowDay = startOfDay(new Date(fragment.next_show_date));
    const today = startOfDay(new Date());
    return (
      fragmentNextShowDay.getTime() === today.getTime() ||
      fragment.last_shown_at === null ||
      isPast(fragmentNextShowDay)
    );
  });

  // Don't forget to set this to 'filteredFragments' after doing development testing
  return filteredFragments;
}
