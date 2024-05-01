import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewFragmentForm from "./components/new-fragment-form";
import QuestionList from "./components/question-list";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="grid grid-cols-4 w-full">
      <nav className="col-span-1">SOME NAV STUFF</nav>
      <section className="col-span-3 bg-gray-400 min-h-screen">
        <h1>LEARN</h1>
        <NewFragmentForm />
        <QuestionList />
      </section>
    </div>
  );
}
