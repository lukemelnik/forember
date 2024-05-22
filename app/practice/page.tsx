import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PracticeDialog from "./components/practice-dialog";
import LearningDashboard from "./components/learning-dashboard";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import resetTestAccount from "./actions/resetTestAccount";

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
        {user.email === "test@test.com" && (
          <div className="text-black bg-zinc-100  max-w-3xl p-5 rounded-lg">
            <h1>Welcome! You're signed in with the test account.</h1>
            <p className="mt-3">
              Clicking reset below will reinitialize the account data and
              pre-load a few javascript questions so you can try out the spaced
              repetition dialog below.
            </p>
            <p className="mt-3">
              You can also visit the 'Create With AI' page to add your own.
            </p>
            <form action={resetTestAccount}>
              <Button className="bg-black text-zinc-300 shadow-md mt-3 hover:bg-zinc-800">
                Reset Test Account
              </Button>
            </form>
          </div>
        )}
        <section className="flex flex-col gap-5">
          <PracticeDialog />
        </section>
        <section>
          <LearningDashboard />
        </section>
      </div>
    </>
  );
}
