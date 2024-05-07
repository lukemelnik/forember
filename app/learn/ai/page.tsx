"use client";
import MagicWandIcon from "@/components/magic-wand-icon";
import RocketIcon from "@/components/rocket-icon";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import EditableFragment from "../components/editable-fragment";
import { set } from "date-fns";

// generated fragments are given a simple temporary id for displaying to the user that will be replaced when its saved in the db
export type TemporaryFragment = {
  id: string;
  question: string;
  answer: string;
};

export default function AIPage() {
  const [fragments, setFragments] = useState<TemporaryFragment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFetchError(null);
    setFragments([]);
    const formData = new FormData(event.currentTarget);
    const notes = formData.get("notes") as string;

    if (!notes) {
      setFetchError("Failed to generate. Please enter some notes first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify({ notes }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.ok);
      if (!response.ok) {
        const errorData = await response.json();
        const error = errorData.error;
        throw new Error(
          error || "Failed to generate fragments. Please try again."
        );
      }
      const data = await response.json();
      setFragments(data);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError("An unknown error occured.");
      }
      setLoading(false);
      return;
    }
  }

  function removeFragment(id: string) {
    const updatedFragments = fragments.filter((f) => f.id !== id);
    setFragments(updatedFragments);
  }

  function saveFragment(fragment: TemporaryFragment) {
    const newFragments = fragments.map((f) =>
      f.id === fragment.id ? fragment : f
    );
    setFragments(newFragments);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-3">Generate Fragments with AI</h1>
      <ul className="">
        <li>
          Step 1: Enter your notes{" "}
          <span className="italic">
            *Hot Tip* Include a title that references the source e.g. a book
            title & author, podcast host/guest etc. to make each fragment more
            memorable.
          </span>
        </li>
        <li>Step 2: Generate fragments</li>
        <li>
          Step 3: You can edit the fragments you like, or add them directly to
          the library.
        </li>
        <li>Step 4: Practice!</li>
      </ul>

      <form
        onSubmit={handleSubmit}
        className={
          "min-w-2xl rounded flex flex-col items-left gap-2 max-w-2xl text-zinc-950 my-10"
        }
      >
        {/* made this label for screen readers only */}
        <Label
          className="text-2xl font-bold text-zinc-300 sr-only"
          htmlFor="notes"
        >
          Enter Your Notes
        </Label>
        <Textarea
          disabled={loading}
          className="bg-black text-zinc-300 min-h-[200px] mt-5 text-md p-5"
          id="notes"
          name="notes"
          placeholder="Enter your notes here and our AI will turn them into knowledge fragments."
        />
        <div className="relative z-0 group mt-5">
          <Button
            disabled={loading}
            className={
              `bg-zinc-300 py-6 w-full text-md` + (loading && " animate-pulse")
            }
            type="submit"
          >
            {loading ? "Generating..." : "Generate Fragments"}{" "}
            <span className="ml-2 group-hover:scale-105 group-hover:rotate-3 group-hover:translate-x-1 duration-300">
              <MagicWandIcon />
            </span>
          </Button>
          <div className="absolute inset-0 top-0 bg-pink-500/70 -z-10  blur-md group-hover:bg-pink-500 group-hover:blur-lg duration-300 group-hover:scale-105"></div>
        </div>
        ``
      </form>
      {fetchError && (
        <h2 className="bg-red-500 p-3 rounded-xl">{fetchError}</h2>
      )}

      {fragments && fragments.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-5">
            <h2 className="text-2xl font-bold">
              {fragments.length} fragments created
            </h2>
            {/* I've realized it's going to be way more complex to validate all of them at once while doing useful error handling & displaying for the user. Will have to suss this out after. */}
            {/* <Button variant="outline" className="bg-zinc-300 text-black">
              ADD ALL
            </Button> */}
          </div>
          <Carousel className="mt-4 border-2 border-zinc-300 rounded-xl p-5">
            <CarouselContent>
              {fragments.map((fragment) => (
                <CarouselItem key={fragment.question}>
                  <EditableFragment
                    fragment={fragment}
                    handleRemoveFragment={removeFragment}
                    handleSaveFragment={saveFragment}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-black" />
            <CarouselNext className="text-black" />
          </Carousel>
        </div>
      )}
    </div>
  );
}
