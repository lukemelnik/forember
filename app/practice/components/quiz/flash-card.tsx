"use client";
import { useState } from "react";
import { Fragment } from "./quiz";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { addDays, set } from "date-fns";
import TrashIcon from "@/components/trash-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function FlashCard({
  fragment,
  handleClick,
  handleDelete,
  handleRightAnswer,
  handleWrongAnswer,
}: {
  fragment: Fragment;
  handleClick: () => void;
  handleDelete: (id: string) => void;
  handleRightAnswer: () => void;
  handleWrongAnswer: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  async function deleteFragment(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const supabase = createClient();
    const { error } = await supabase
      .from("fragment")
      .delete()
      .eq("id", fragment.id);
    // add toast

    if (error) {
      console.log(error);
    }
  }

  async function resetInterval(id: string) {
    handleWrongAnswer();
    const date = addDays(new Date(), 1);
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("fragment")
        .update({
          interval: 1,
          next_show_date: date,
          last_shown_at: new Date(),
        })
        .eq("id", id);
      setIsFlipped(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function increaseInterval(fragment: Fragment) {
    handleRightAnswer();
    const increasedInterval = fragment.interval + 1;
    let is_complete = false;
    // once a fragment has made it to an interval of two weeks, it is considered complete and won't be shown again in the quiz
    // this will become a user adjustable setting in the future (set it in the profile)
    if (increasedInterval > 14) {
      is_complete = true;
    }
    const next_show_date = addDays(new Date(), increasedInterval);
    const supabase = createClient();
    const { error } = await supabase
      .from("fragment")
      .update({
        interval: fragment.interval + 1,
        next_show_date,
        last_shown_at: new Date(),
        is_complete,
      })
      .eq("id", fragment.id);
    if (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`w-full h-72  rounded-xl  relative flex justify-center items-center shadow-lg   p-10 text-lg mx-auto from-zinc-100 to-zinc-300 ${isFlipped ? " bg-gradient-to-l" : "bg-gradient-to-r"}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="absolute top-5 right-3">
        <AlertDialog>
          <AlertDialogTrigger>
            <div className="text-red-600">
              <TrashIcon width="25" height="25" />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the fragment from the knowledge
                base.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-400"
                onClick={(event) => {
                  // deletes the fragment in the database
                  deleteFragment(event);
                  // deletes the fragment in the client state
                  handleDelete(fragment.id);
                }}
              >
                Delete Fragment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {!isFlipped ? (
        <div className="text-black">
          <h2 className="font-bold text-xl">Q:</h2>
          <p>{fragment.question}</p>
        </div>
      ) : (
        <>
          <div className="text-black">
            <h2 className="font-bold text-xl">A:</h2>
            <p className="">{fragment.answer}</p>{" "}
          </div>
          <div className="absolute bottom-5 flex gap-5 text-black">
            <Button
              onClick={() => {
                increaseInterval(fragment);
                handleClick();
              }}
              className="bg-green-500 hover:bg-green-400 group shadow-md hover:scale-105 duration-300 transition-all"
            >
              I got it{" "}
              <span className="ml-2 text-lg group-hover:rotate-12 duration-300">
                😁
              </span>
            </Button>
            <Button
              onClick={() => {
                resetInterval(fragment.id);
                handleClick();
              }}
              className="bg-red-500 hover:bg-red-400 group shadow-md hover:scale-105 duration-300 transition-all"
            >
              I forgot{" "}
              <span className="ml-2 text-lg group-hover:rotate-12 duration-300">
                😭
              </span>
            </Button>
          </div>{" "}
        </>
      )}
    </div>
  );
}
