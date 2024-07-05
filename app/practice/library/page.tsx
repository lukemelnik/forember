"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import FragmentCard from "./_components/fragment-card";
import { createClient } from "@/utils/supabase/client";

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [searchError, setSearchError] = useState(null);

  function debounce(callback: () => void, delay: number) {
    let timeoutId;

    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  }
  async function handleSearchChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSearchError(null);
    setData([]);
    console.log(event.target.value);
    const supabase = createClient();

    setSearch(event.target.value);

    async function searchDB() {
      try {
        const searchTerms = event.target.value.split(" ").join(" & ");
        const { data, error } = await supabase
          .from("fragment")
          .select()
          .textSearch("question", `${searchTerms}`);
        if (data.length === 0) {
          throw new Error("No results found");
        }
        setData(data);
      } catch (error) {
        console.log(error);
        setSearchError(error);
      }
    }
    const debouncedSearch = debounce(searchDB, 1000);
    debouncedSearch();
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
      {searchError && <p>{searchError.message}</p>}
      {data &&
        data.map((fragment) => (
          <FragmentCard fragment={fragment} key={fragment.id} />
        ))}
    </div>
  );
}
