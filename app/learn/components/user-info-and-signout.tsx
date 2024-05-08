import { Button } from "@/components/ui/button";
import React from "react";
import signOut from "../actions/signOut";
import { createClient } from "@/utils/supabase/server";

export default async function UserInfoAndSignOut() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <div className="flex items-center mt-5 ml-5 gap-4 text-lg">
      <form action={signOut}>
        <Button variant="outline" className="text-gray-950 text-lg p-5 py-6">
          Sign Out
        </Button>
      </form>
      <p className="">Signed in as {user?.email}</p>
    </div>
  );
}
