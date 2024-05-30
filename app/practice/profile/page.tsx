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
import NewFragmentForm from "../components/new-fragment-form";
import UpdateProfileForm from "../components/update-profile-form";
import { Separator } from "@/components/ui/separator";

export type Profile = {
  first_name: string | null;
  last_name: string | null;
};

export default async function ProfilePage() {
  const supabase = createClient();

  async function getUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user) {
      return redirect("/login");
    }
    if (error) {
      return redirect("/login");
    }
    return user;
  }
  const user = await getUser();

  async function getProfile() {
    const { data: profile, error } = await supabase
      .from("profile")
      .select()
      .eq("user_id", user.id);
    if (error) {
      console.error(error);
    }
    if (!profile) {
      return redirect("/login");
    }
    return profile[0];
  }

  const profile: Profile = await getProfile();
  const joinedDate = new Date(user.created_at).toDateString();

  return (
    <div>
      <h1 className="mb-5">Profile</h1>
      <Separator className="bg-slate-300 max-w-2xl mb-5" />
      <p>First Name: {profile?.first_name}</p>
      <p>Last Name: {profile?.last_name}</p>
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
