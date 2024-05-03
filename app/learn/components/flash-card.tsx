"use client";
import { useState } from "react";
import { Fragment } from "./quiz";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { addDays } from "date-fns";
import TrashIcon from "@/components/trash-svg";
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
    const date = addDays(new Date(), 1);
    const supabase = createClient();
    const { error } = await supabase
      .from("fragment")
      .update({ interval: 1, next_show_date: date, last_shown_at: new Date() })
      .eq("id", id);
    if (error) {
      console.log(error);
    }
  }
  async function increaseInterval(fragment: Fragment) {
    const increasedInterval = fragment.interval + 1;
    const next_show_date = addDays(new Date(), increasedInterval);
    const supabase = createClient();
    const { error } = await supabase
      .from("fragment")
      .update({
        interval: fragment.interval + 1,
        next_show_date,
        last_shown_at: new Date(),
      })
      .eq("id", fragment.id);
    if (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="w-96 h-48 bg-zinc-200 rounded-xl relative flex justify-center items-center shadow-lg border-2 border-zinc-300"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="absolute top-5 right-3">
        <AlertDialog>
          <AlertDialogTrigger>
            <TrashIcon />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
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
        <p>{fragment.question}</p>
      ) : (
        <>
          <p>{fragment.answer}</p>{" "}
          <div className="absolute bottom-5 flex gap-5">
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
