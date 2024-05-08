import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewFragmentForm from "./components/new-fragment-form";
import NavHeader from "./components/nav-header";
import Quiz from "./components/quiz";
import NavLinks from "./components/nav-links";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import PracticeDialog from "./components/practice-dialog";
import LearningDashboard from "./components/learning-dashboard";

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
      <main className="p-1 md:p-10 space-y-10 max-w-screen">
        <section className="flex flex-col gap-5">
          <PracticeDialog />
        </section>
        <section>
          <LearningDashboard />
        </section>
      </main>
    </>
  );
}
