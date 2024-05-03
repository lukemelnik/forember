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

export default async function PracticePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <section className="col-span-3 min-h-screen p-10 flex flex-col gap-5">
      <PracticeDialog />
    </section>
  );
}
