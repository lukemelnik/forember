"use client";
import MagicWandIcon from "@/components/magic-wand-icon";
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
import { toast } from "sonner";
import revalidatePracticePage from "../actions/revalidate-practice-page";
import GenerateInstructionsButton from "../components/create/generate-instructions-button";
import GenerateLoadingSkeleton from "../components/create/generate-loading-skeleton";
import CarouselContainer from "../components/create/carousel-container";

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
  const [notes, setNotes] = useState<string>("");

  let fragmentCount = fragments.length;

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
          error || "Failed to generate fragments. Please try again.",
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
        { duration: 2000 },
      );
    }
    revalidatePracticePage();
  }

  function saveFragment(fragment: TemporaryFragment) {
    const newFragments = fragments.map((f) =>
      f.id === fragment.id ? fragment : f,
    );
    setFragments(newFragments);
  }

  return (
    <div className="max-w-2xl md:ml-20 md:mt-16">
      <h1 className="mb-3">Generate Fragments with AI</h1>
      <GenerateInstructionsButton />
      {loading && <GenerateLoadingSkeleton />}
      {fragments && fragments.length > 0 && (
        <CarouselContainer fragmentCount={fragmentCount}>
          <Carousel className="mt-4 w-[350px] rounded-xl border-2 border-zinc-300 p-5 md:w-full">
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
        </CarouselContainer>
      )}
      <form
        onSubmit={handleSubmit}
        className={
          "min-w-2xl items-left my-10 flex max-w-2xl flex-col gap-2 rounded text-zinc-950"
        }
      >
        {/* made this label for screen readers only */}
        <Label
          className="sr-only text-2xl font-bold text-zinc-300"
          htmlFor="notes"
        >
          Enter Your Notes
        </Label>

        <div className="group relative z-0 mt-1">
          <Button
            disabled={loading || notes?.length > 15000}
            className={
              `text-md w-full bg-zinc-300 py-6 hover:bg-zinc-100` +
              (loading && "animate-pulse")
            }
            type="submit"
          >
            {loading ? "Generating..." : "Generate Fragments"}{" "}
            <span className="ml-2 duration-300 group-hover:translate-x-1 group-hover:rotate-3 group-hover:scale-105">
              <MagicWandIcon />
            </span>
          </Button>

          {fetchError && (
            <h2 className="mt-4 rounded-xl bg-red-500 p-3">{fetchError}</h2>
          )}
        </div>
        {/* check that the number of tokens doesn't exceed 4000 for sending to the ai model. ~4 characters is a token so the number of characters can't exceed 16000, subtract 1000 for a safety factor */}
        {notes && notes.length <= 15000 && (
          <p className="mt-4 text-zinc-300">
            <strong>{notes?.length}/15000</strong> Characters
          </p>
        )}
        {notes && notes.length > 15000 && (
          <p className="mt-4 text-red-500">
            <strong>{notes?.length}/15000</strong> Character length exceeded.
            Please split the note up into smaller pieces so they can be
            processed by the model.
          </p>
        )}
        <Textarea
          disabled={loading}
          className="text-md mt-5 min-h-[800px] bg-black p-5 text-zinc-300"
          id="notes"
          name="notes"
          placeholder="Enter your notes here and our AI will turn them into knowledge fragments."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </div>
  );
}
