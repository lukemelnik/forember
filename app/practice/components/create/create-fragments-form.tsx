import MagicWandIcon from "@/components/magic-wand-icon";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

export default function CreateFragmentsForm({
  fetchFragments,
  fetchError,
  loading,
}: {
  fetchFragments: (event: React.FormEvent<HTMLFormElement>) => void;
  fetchError: string | null;
  loading: boolean;
}) {
  const [notes, setNotes] = useState<string>("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        fetchFragments(event);
      }}
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
          Please split the note up into smaller pieces so they can be processed
          by the model.
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
  );
}
