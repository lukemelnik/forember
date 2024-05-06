"use client";

import React, { useState } from "react";
import { TemporaryFragment } from "../ai/page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import { addDays } from "date-fns";

type EditableFragmentProps = {
  fragment: TemporaryFragment;
  handleRemoveFragment: (id: string) => void;
  handleSaveFragment: (fragment: TemporaryFragment) => void;
};

type SubmissionErrors = {
  question?: string[];
  answer?: string[];
  _form?: string[];
};

type ErrorContainer = {
  errors: SubmissionErrors;
};

export const createFragmentSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Question must be at least 5 characters long" })
    .max(250, {
      message: "Question must be at most 250 characters long",
    }),
  answer: z
    .string()
    .min(3, { message: "Answer must be at least 3 characters long" })
    .max(250, { message: "Answer must be at most 250 characters long" }),
});

export default function EditableFragment({
  fragment,
  handleRemoveFragment,
  handleSaveFragment,
}: EditableFragmentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFragment, setEditedFragment] =
    useState<TemporaryFragment>(fragment);
  const [errors, setErrors] = useState<ErrorContainer>({ errors: {} });

  async function addFragment(fragment: TemporaryFragment) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setErrors({
        errors: { _form: ["You must be signed in to create a fragment"] },
      });
      return;
    }
    // strip the temporary id
    const { id, ...fragmentWithoutId } = fragment;
    const result = createFragmentSchema.safeParse({
      question: fragment.question,
      answer: fragment.answer,
    });

    // if errors set them to state and show in ui
    if (!result.success) {
      setErrors({
        errors: { ...errors, ...result.error.flatten().fieldErrors },
      });
      return;
    }

    const currentDate = new Date();
    const tomorrow = addDays(currentDate, 1);
    const { error } = await supabase.from("fragment").insert({
      question: result.data.question,
      answer: result.data.answer,
      user_id: user.id,
      next_show_date: tomorrow,
    });
    if (error) {
      throw new Error("Could not create fragment");
    }
    // remove from list
    console.log("you did it");
  }

  return (
    <div>
      {isEditing ? (
        <div className="flex flex-col text-black">
          <div className="flex items-left justify-center p-2">
            <Label htmlFor="question" className="text-zinc-300">
              <span className="text-lg mr-2">Q:</span>
            </Label>
            <Textarea
              className={
                `bg-black text-zinc-300 rounded p-1 border-none text-md text-wrap` +
                (isEditing && "")
              }
              name="question"
              value={editedFragment.question}
              onChange={(e) => {
                setEditedFragment({
                  ...editedFragment,
                  question: e.target.value,
                });
              }}
            />
          </div>
          <div className="flex items-left justify-center p-2">
            <Label htmlFor="question" className="text-zinc-300">
              <span className="text-lg mr-2">A:</span>
            </Label>
            <Textarea
              className={
                `bg-black text-zinc-300 rounded border-none mb-1 text-md p-1 text-wrap` +
                (isEditing && "")
              }
              name="answer"
              value={editedFragment.answer}
              onChange={(e) => {
                setEditedFragment({
                  ...editedFragment,
                  answer: e.target.value,
                });
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="font-bold">Q: {fragment.question}</p>
          <p className="italic">A: {fragment.answer}</p>
        </div>
      )}
      <div className="mt-2 flex gap-3 justify-between">
        <Button
          variant="outline"
          className="bg-zinc-300 text-black"
          onClick={() => {
            addFragment(fragment);
            // put check here that there are no errors
            handleRemoveFragment(fragment.id);
          }}
        >
          Add To Library
        </Button>
        <div>
          <Button
            variant="outline"
            className="bg-zinc-300 text-black mr-3"
            onClick={() => handleRemoveFragment(fragment.id)}
          >
            Delete
          </Button>
          <Button
            variant="outline"
            className={
              isEditing
                ? `border-2 bg-black border-zinc-300 text-zinc-300 animate-pulse`
                : `bg-zinc-300 text-black`
            }
            onClick={() => {
              // if not editing, start editing
              if (!isEditing) {
                setIsEditing(!isEditing);
                return;
              }
              // if editing, first save to the fragments array on the learn/ai page, then toggle editing off
              // could probably have saved all changes directly to the fragments array on that page but I feel like this is cleaner.
              handleSaveFragment(editedFragment);
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
