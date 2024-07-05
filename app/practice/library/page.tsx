"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import FragmentCard from "./_components/fragment-card";
import { createClient } from "@/utils/supabase/client";
import { set } from "date-fns";
import { Fragment } from "../components/quiz/quiz";

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Fragment[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setIsSearching] = useState(false);

  // useEffect to debounce the search and only send a db query after the user stops typing
  useEffect(() => {
    setIsSearching(true);
    const supabase = createClient();
    async function searchDB() {
      try {
        const searchTerms = search.split(" ").join(" & ");
        const { data, error } = await supabase
          .from("fragment")
          .select()
          .textSearch("question", `${searchTerms}`);
        // notify user if no results are found so they know it's working
        if (!data || data.length === 0) {
          setSearchError("No results found");
        }
        // remove the error message if the user clears the search
        if (search === "") {
          setSearchError(null);
        }
        setData(data);
        setIsSearching(false);
      } catch (error) {
        console.log(error);
      }
    }
    const dbSearchTimeout = setTimeout(searchDB, 500);
    return () => clearTimeout(dbSearchTimeout);
  }, [search]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData([]);
    setSearchError(null);
    setSearch(event.target.value);
  }

  return (
    <div className="max-w-3xl text-white md:p-20">
      <h1 className="mb-4">Search your knowledge base:</h1>

      <form>
        <Input
          type="text"
          value={search}
          onChange={async (event) => handleSearchChange(event)}
          className="mb-5 text-black"
          placeholder="Search..."
        />
      </form>
      {searchError && <p>{searchError}</p>}
      {searching && <p className="animate-pulse''">Searching...</p>}
      {data &&
        data.map((fragment) => (
          <FragmentCard fragment={fragment} key={fragment.id} />
        ))}
    </div>
  );
}
