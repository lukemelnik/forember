"use client";

import { useState } from "react";
import { TemporaryFragment } from "../practice/create/page";
import revalidatePracticePage from "../practice/actions/revalidate-practice-page";
import { toast } from "sonner";

export function useGenerateFragments() {
  const [fragments, setFragments] = useState<TemporaryFragment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function fetchFragments(event: React.FormEvent<HTMLFormElement>) {
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
  return {
    fragments,
    setFragments,
    loading,
    setLoading,
    fetchError,
    setFetchError,
    fetchFragments,
    removeFragment,
    saveFragment,
  };
}
