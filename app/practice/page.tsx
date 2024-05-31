import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PracticeDialog from "./components/practice-dialog";
import LearningDashboard from "./components/learning-dashboard";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import resetTestAccount from "./actions/resetTestAccount";
import WelcomeMessage from "./components/welcome-message";

export default async function PracticePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <div className="p-1 md:p-10 space-y-10">
        {user.email === "test@test.com" && <WelcomeMessage />}
        <section className="flex flex-col gap-5"></section>
        <section>
          <LearningDashboard />
        </section>
      </div>
    </>
  );
}
