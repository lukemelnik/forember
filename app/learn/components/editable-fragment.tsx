"use client";

import React, { useState } from "react";
import { Fragment } from "../ai/page";
import { set } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditableFragmentProps = {
  fragment: Fragment;
  handleRemoveFragment: (id: string) => void;
  handleAddFragment: (id: string) => void;
  handleSaveFragment: (fragment: Fragment) => void;
};

export default function EditableFragment({
  fragment,
  handleRemoveFragment,
  handleAddFragment,
  handleSaveFragment,
}: EditableFragmentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFragment, setEditedFragment] = useState<Fragment>(fragment);

  return (
    <div>
      {isEditing ? (
        <div className="flex flex-col text-black">
          <div className="flex items-center justify-center p-2">
            <Label htmlFor="question" className="text-zinc-300">
              <span className="text-lg mr-2">Q:</span>
            </Label>
            <Input
              className={
                `bg-black text-zinc-300 rounded p-1 border-none text-md` +
                (isEditing && "")
              }
              type="text"
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
          <div className="flex items-center justify-center p-2">
            <Label htmlFor="question" className="text-zinc-300">
              <span className="text-lg mr-2">A:</span>
            </Label>
            <Input
              className={
                `bg-black text-zinc-300 rounded border-none mb-1 text-md p-1` +
                (isEditing && "")
              }
              type="text"
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
          onClick={handleAddFragment}
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
