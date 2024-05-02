"use client";
import { useState } from "react";
import { Fragment } from "./quiz";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function FlashCard({
  fragment,
  handleClick,
  handleDelete,
}: {
  fragment: Fragment;
  handleClick: () => void;
  handleDelete: (id: string) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  async function deleteFragment(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const supabase = createClient();
    const { error } = await supabase
      .from("fragment")
      .delete()
      .eq("id", fragment.id);
    console.log("Fragment deleted");

    if (error) {
      console.log(error);
    }
  }

  async function resetInterval(id: string) {
    // Reset the interval for the fragment
  }
  async function doubleInterval(id: string) {
    // double the existing interval
  }

  return (
    <div
      className="w-96 h-48 bg-yellow-500 rounded-xl relative flex justify-center items-center shadow-lg"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <Button
        className="absolute top-5 right-5 bg-black"
        variant="destructive"
        onClick={(event) => {
          // deletes the fragment in the database
          deleteFragment(event);
          // deletes the fragment in the client state
          handleDelete(fragment.id);
        }}
      >
        🗑️
      </Button>
      {!isFlipped ? (
        <p>{fragment.question}</p>
      ) : (
        <>
          <p>{fragment.answer}</p>{" "}
          <div className="absolute bottom-5 flex gap-5">
            <Button
              onClick={() => {
                handleClick();
                resetInterval(fragment.id);
              }}
              className="bg-green-600"
            >
              I got it 😁
            </Button>
            <Button
              onClick={() => {
                handleClick();
                doubleInterval(fragment.id);
              }}
              className="bg-red-600"
            >
              I forgot 😭
            </Button>
          </div>{" "}
        </>
      )}
    </div>
  );
}
