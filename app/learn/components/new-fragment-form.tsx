"use client";

import { useFormState } from "react-dom";
import { createFragment } from "../actions/createFragment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { toast } from "sonner";

export default function NewFragmentForm() {
  const [formState, action] = useFormState(createFragment, { errors: {} });

  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      className="min-w-2xl bg-gray-600 p-5 rounded flex flex-col items-left gap-2 max-w-2xl"
      action={async (formData) => {
        action(formData);
        if (Object.keys(formState.errors).length === 0) {
          ref.current?.reset();
          toast("Fragment created successfully 🎉", {
            duration: 2000,
            description: "You'll start reviewing it tomorrow",
          });
        }
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
  );
}
