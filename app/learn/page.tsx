import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewFragmentForm from "./components/new-fragment-form";
import NavHeader from "./components/nav-header";
import Quiz from "./components/quiz";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="grid grid-cols-4 w-full ">
      <nav className="col-span-1 p-10">
        <NavHeader />
      </nav>
      <section className="col-span-3 bg-gray-400 min-h-screen p-10 flex flex-col gap-5">
        <h1>LEARN</h1>
        <NewFragmentForm />
        <Quiz />
      </section>
    </div>
  );
}
