"use client";
import { useState } from "react";
import { Fragment } from "./quiz";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function FlashCard({
  fragment,
  handleClick,
}: {
  fragment: Fragment;
  handleClick: () => void;
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

  return (
    <div
      className="w-96 h-48 bg-yellow-500 rounded-xl relative flex justify-center items-center"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <Button
        className="absolute top-5 right-5 bg-black"
        variant="destructive"
        onClick={deleteFragment}
      >
        🗑️
      </Button>
      {!isFlipped ? (
        <p>{fragment.question}</p>
      ) : (
        <>
          <p>{fragment.answer}</p>{" "}
          <div className="absolute bottom-5 flex gap-5">
            <Button onClick={() => handleClick()} className="bg-green-600">
              I got it 😁
            </Button>
            <Button onClick={() => handleClick()} className="bg-red-600">
              I forgot 😭
            </Button>
          </div>{" "}
        </>
      )}
    </div>
  );
}
