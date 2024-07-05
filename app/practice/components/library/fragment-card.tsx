"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { Fragment } from "../quiz/quiz";
import { Divide } from "lucide-react";
import DeleteButtonDialog from "./delete-button-dialog";

export default function FragmentCard({ fragment }: { fragment: Fragment }) {
  const [isEditing, setIsEditing] = React.useState(false);

  function handleEdit() {
    setIsEditing(!isEditing);
  }

  return (
    <div
      key={fragment.id}
      className="lg mb-4 rounded-lg border-2 border-zinc-300 p-4"
    >
      {!isEditing ? (
        <div>
          <p className="font-bold">Q: {fragment.question}</p>
          <p>A: {fragment.answer}</p>
        </div>
      ) : (
        <div>editing</div>
      )}

      <div className="mt-3 flex justify-between">
        <Button
          variant="default"
          className={`bg-zinc-300 text-black ${isEditing && "animate-pulse"}`}
          onClick={handleEdit}
        >
          {!isEditing ? "Edit" : "Save"}
        </Button>
        <DeleteButtonDialog fragment={fragment} />
      </div>
    </div>
  );
}
