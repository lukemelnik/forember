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

  return (
    <div>
      <h1 className="mb-5">Profile</h1>
      <p>First Name: {profile?.first_name}</p>
      <p>Last Name: {profile?.last_name}</p>
      <Dialog>
        <DialogTrigger className="bg-gray-300 rounded p-3 mt-10">
          Edit Profile
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update your details here:</DialogTitle>
            <DialogDescription>
              <UpdateProfileForm />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
