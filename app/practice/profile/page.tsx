import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import UpdateProfileForm from "../components/update-profile-form";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  if (userError) {
    console.log(userError);
    return redirect("/login");
  }

  const { data: profile, error: dataError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", user.id);
  if (dataError) {
    console.error(dataError);
  }
  if (!profile) {
    return redirect("/login");
  }
  // returns an array so you have to select the first entry profile[0]

  const joinedDate = new Date(profile[0].created_at).toDateString();

  return (
    <div>
      <h1 className="mb-5">Profile</h1>
      <Separator className="bg-slate-300 max-w-2xl mb-5" />
      <p>First Name: {profile[0].first_name}</p>
      <p>Last Name: {profile[0].last_name}</p>
      <p>Joined On: {joinedDate}</p>
      <Dialog>
        <DialogTrigger className="bg-gray-300 rounded p-3 mt-10 text-zinc-900">
          Edit Profile
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <UpdateProfileForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
