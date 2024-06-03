import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PracticeDialog from "./components/quiz/quiz-dialog";
import LearningDashboard from "./components/dashboard/dashboard";
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
      <div className="p-1 md:pt-10 md:px-16 space-y-10">
        {user.email === "test@test.com" && <WelcomeMessage />}
        <LearningDashboard />
      </div>
    </>
  );
}
