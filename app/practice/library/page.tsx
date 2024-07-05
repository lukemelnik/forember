import { createClient } from "@/utils/supabase/server";
import React from "react";
import FragmentCard from "./_components/fragment-card";

export default async function LibraryPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from("fragment").select("*");
  if (error) {
    console.error(error);
    return <div>Error</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-3xl text-white md:p-20">
      <h1 className="mb-4">Your Knowledge Library:</h1>
      {data.map((fragment) => (
        <FragmentCard fragment={fragment} />
      ))}
    </div>
  );
}
