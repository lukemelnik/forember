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
import ArrowRightIcon from "@/components/arrow-right-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const [instructionShow, setInstructionShow] = useState(false);
  const [notes, setNotes] = useState<string>("");

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
    if (updatedFragments.length === 0) {
      toast(
        "You're all done, head over to the practice page to start learning!",
        { duration: 2000 }
      );
    }
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
      <Button
        variant="outline"
        className="border-2 border-zinc-300 text-zinc-300 bg-black mb-3 group"
        onClick={() => setInstructionShow(!instructionShow)}
      >
        {instructionShow ? "Hide Instructions" : "Show Instructions"}{" "}
        <span className={instructionShow ? "rotate-90" : ""}>
          <ArrowRightIcon />
        </span>
      </Button>
      {instructionShow && (
        <ul className=" space-y-3">
          <li>
            <p>Step 1: Enter your notes</p>
            <p className="italic">
              * Hot Tip * Include a title that references the source e.g. a book
              title & author, podcast host etc. to give each fragment more
              context.
            </p>
          </li>
          <li>Step 2: Generate fragments</li>
          <li>
            Step 3: You can edit the fragments you like, or add them directly to
            the library.
          </li>
          <li>Step 4: Practice!</li>
        </ul>
      )}

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
        {/* check that the number of tokens doesn't exceed 4000 for sending to the ai model. ~4 characters is a token so the number of characters can't exceed 16000, subtract 1000 for a safety factor */}
        {notes && notes.length <= 15000 && (
          <p className="text-zinc-300">
            <strong>{notes?.length}/15000</strong>Characters
          </p>
        )}
        {notes && notes.length > 15000 && (
          <p className="text-red-500">
            <strong>{notes?.length}/15000</strong> Character length exceeded.
            Please split the note up into smaller pieces so they can be
            processed by the model.
          </p>
        )}
        <Textarea
          disabled={loading}
          className="bg-black text-zinc-300 min-h-[200px] mt-5 text-md p-5"
          id="notes"
          name="notes"
          placeholder="Enter your notes here and our AI will turn them into knowledge fragments."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="relative z-0 group mt-5">
          <Button
            disabled={loading || notes?.length > 15000}
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
      {loading && (
        <div className="relative">
          <h2 className="text-2xl font-bold animate-pulse">
            Creating your fragments...
          </h2>
          <Skeleton className="rounded-full w-8 h-8 absolute -left-12 top-28"></Skeleton>
          <Skeleton className="rounded-full w-8 h-8 absolute -right-12 top-28"></Skeleton>
          <Skeleton className="mt-4 border-2 border-zinc-800 rounded-xl p-5 w-[350px] md:w-full bg-black">
            <Skeleton className="h-20"></Skeleton>
            <div className="flex justify-between mt-4">
              <Skeleton className="h-10 w-32"></Skeleton>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-20"></Skeleton>
                <Skeleton className="h-10 w-20"></Skeleton>
              </div>
            </div>
          </Skeleton>
        </div>
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
          <Carousel className="mt-4 border-2 border-zinc-300 rounded-xl p-5 w-[350px] md:w-full">
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
