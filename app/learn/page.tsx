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
    <div className="">
      <h1>LEARN</h1>
      <NewFragmentForm />
      <QuestionList />
    </div>
  );
}
