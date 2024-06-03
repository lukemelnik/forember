import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import React from "react";

export default async function HomepageLogin() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return (
    <div className="mr-4 flex gap-3 items-center">
      {user && <p className="hidden md:block">Logged in as {user.email}</p>}
      {user ? (
        <Link href="/practice" className="hidden md:block ">
          <Button className="text-xl text-black bg-zinc-300 p-5">
            Practice
          </Button>
        </Link>
      ) : (
        <Link href="/login" className="hidden md:block ">
          <Button className="text-xl text-black bg-zinc-300 p-5">Login</Button>
        </Link>
      )}
    </div>
  );
}
