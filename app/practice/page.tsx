import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LearningDashboard from "./components/dashboard/dashboard";
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
      <div className="space-y-10 p-1 md:px-16 md:pt-10">
        {user.email === "test@test.com" && <WelcomeMessage />}
        <LearningDashboard />
      </div>
    </>
  );
}
