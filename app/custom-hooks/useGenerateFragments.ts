"use client";

import { useState } from "react";
import { TemporaryFragment } from "../practice/create/page";

async function useGenerateFragments(event: React.FormEvent<HTMLFormElement>) {
  const [fragments, setFragments] = useState<TemporaryFragment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

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
