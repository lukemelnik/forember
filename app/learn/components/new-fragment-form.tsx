"use client";

import { useFormState } from "react-dom";
import { createFragment } from "../actions/createFragment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function NewFragmentForm() {
  const [formState, action] = useFormState(createFragment, { errors: {} });
  // need state for first render so that the useEffect doesn't run on page load (otherwise toast fires automatically)
  const [firstRender, setFirstRender] = useState(true);

  const ref = useRef<HTMLFormElement>(null);

  // this useEffect ensures that the toast message is displayed when the form is submitted and the form is cleared. Has to be in a useEffect because otherwise a) the actions are carried out even if not successful and b) the formState.error is stale
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    if (Object.keys(formState.errors).length === 0) {
      toast("Fragment added successfully 🎉", { duration: 2000 });
      ref.current?.reset();
    } else {
      toast("Error adding the fragment 😢", {
        duration: 2000,
      });
    }
  }, [formState.errors]);

  return (
    <div className="p-5">
      <h1 className="mb-2">Make a flash card:</h1>
      <form
        ref={ref}
        className="min-w-2xl rounded flex flex-col items-left gap-2 max-w-2xl"
        action={async (formData) => {
          action(formData);
        }}
      >
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" />
        {formState.errors.question && (
          <p className="text-red-600">{formState.errors.question.join(" ,")}</p>
        )}
        <Label htmlFor="answer">Answer</Label>
        <Input id="answer" name="answer" />
        {formState.errors.answer && (
          <p className="text-red-600">{formState.errors.answer.join(" ,")}</p>
        )}
        <Button className="bg-gray-950 text-gray-300" type="submit">
          Create Fragment
        </Button>
        {formState.errors._form && (
          <p className="text-red-700">{formState.errors._form.join(", ")}</p>
        )}
      </form>
    </div>
  );
}
