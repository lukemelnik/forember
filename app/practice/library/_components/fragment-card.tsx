"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { Fragment } from "../../components/quiz/quiz";
import { Divide } from "lucide-react";
import DeleteButtonDialog from "./delete-button-dialog";
import FragmentEditForm from "./fragment-edit-form";

export default function FragmentCard({ fragment }: { fragment: Fragment }) {
  const [isEditing, setIsEditing] = React.useState(false);

  function handleEdit() {
    setIsEditing(!isEditing);
  }

  return (
    <div className="lg mb-4 rounded-lg border-2 border-zinc-300 p-4">
      {!isEditing ? (
        <div>
          <p className="mb-2 font-bold">Q: {fragment.question}</p>
          <p className="italic">A: {fragment.answer}</p>
          <div className="mt-3 flex justify-between">
            <Button
              variant="default"
              className={`bg-zinc-300 text-black ${isEditing && "animate-pulse"}`}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <DeleteButtonDialog fragment={fragment} />
          </div>
        </div>
      ) : (
        <FragmentEditForm fragment={fragment} handleEdit={handleEdit} />
      )}
    </div>
  );
}
