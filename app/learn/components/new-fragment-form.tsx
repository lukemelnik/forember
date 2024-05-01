"use client";

import { useFormState } from "react-dom";
import { z } from "zod";
import { createFragment } from "../actions/createFragment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewFragmentForm() {
  const [formState, action] = useFormState(createFragment, { errors: {} });
  return (
    <form className="min-w-2xl" action={action}>
      <Label htmlFor="question">Question</Label>
      <Input id="question" name="question" />
      {formState.errors.question && (
        <p>{formState.errors.question.join(" ,")}</p>
      )}
      <Label htmlFor="answer">Answer</Label>
      <Input id="answer" name="answer" />
      {formState.errors.answer && <p>{formState.errors.answer.join(" ,")}</p>}
      <Button type="submit">Create Fragment</Button>
      {formState.errors._form && (
        <p className="text-red-700">{formState.errors._form.join(", ")}</p>
      )}
    </form>
  );
}
