"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import FragmentCard from "./_components/fragment-card";
import { createClient } from "@/utils/supabase/client";
import { set } from "date-fns";
import { Fragment } from "../components/quiz/quiz";
import { useQuizContext } from "@/app/contexts/QuizContext";
import { useSearchParam } from "react-use";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
  // this could likely be refactored to remove the search state
  const [search, setSearch] = useState<string | null>(null);
  const [data, setData] = useState<Fragment[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setIsSearching] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  // this state exists purely to trigger a refetch of the data when the user finishes editing a fragment -> the component re-renders, but it doesnt remount, which means the params useEffect wouldn't run. I couldn't make 'search' or 'data' a dependency, because then it would run too frequently and monopolize the input field
  const [wasEdited, setWasEdited] = useState(false);

  // when the use finishes editing a fragment, we want to refetch the data to update the UI, but also keep the search query, so I'm storing it in the URL and using router.push() to update the URL
  useEffect(() => {
    console.log("params useEffect ran!");
    if (searchParams.has("search")) {
      setSearch(searchParams.get("search"));
    }
  }, [wasEdited]);

  // useEffect to debounce the search and only send a db query after the user stops typing
  useEffect(() => {
    if (!search) return;

    setIsSearching(true);
    const supabase = createClient();
    async function searchDB() {
      try {
        const searchTerms = search?.split(" ").join(" & ");
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
        router.push(`?search=${search}`);
      } catch (error) {
        console.log(error);
      }
    }
    const dbSearchTimeout = setTimeout(searchDB, 500);
    return () => clearTimeout(dbSearchTimeout);
  }, [search]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData([]);
    router.push(`?search=${event.target.value}`);
    setSearchError(null);
    setSearch(event.target.value);
  }

  // see the note about about the wasEdited state, purely to trigger a refetch of the data after editing
  function clearSearchData() {
    setSearch(null);
    setData(null);
    setWasEdited(!wasEdited);
    router.refresh();
  }

  return (
    <div className="max-w-3xl text-white md:p-20">
      <h1 className="mb-4">Search your knowledge base:</h1>

      <Input
        type="text"
        value={search ? search : ""}
        onChange={async (event) => handleSearchChange(event)}
        className="mb-5 text-black"
        placeholder="Search..."
      />

      {searchError && <p>{searchError}</p>}
      {searching && <p className="animate-pulse">Searching...</p>}
      {data &&
        data.map((fragment) => (
          <FragmentCard
            fragment={fragment}
            key={fragment.id}
            clearSearchData={clearSearchData}
          />
        ))}
    </div>
  );
}
