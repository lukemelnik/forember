"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Quiz from "./quiz";
import QuizContextProvider, {
  useQuizContext,
} from "@/app/contexts/QuizContext";
import { getFragmentsClient } from "@/lib/get-fragments-client";
import { useEffect } from "react";

export default function QuizDialog() {
  const {
    state: { open, loading, edited, isEditing },
    dispatch,
  } = useQuizContext();

  // load data here because triggering a page revalidation doesn't cause client components to re-render. Refetch fragments on every dialog status change.
  useEffect(() => {
    async function getFragmnents() {
      let fragments = await getFragmentsClient();
      dispatch({ type: "data loaded", payload: fragments });
    }
    getFragmnents();
  }, [open, edited]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          dispatch({ type: "close dialog" });
        } else {
          dispatch({ type: "open dialog" });
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="group relative z-0 max-w-[300px]">
          <Button className="z-0 w-full bg-pink-600 p-6 text-lg text-black transition-all duration-300 group-hover:scale-105">
            Start Daily Quiz
          </Button>
          <div className="absolute inset-0 -z-10 hidden bg-pink-500/70 blur-lg duration-300 group-hover:block group-hover:bg-pink-500 group-hover:blur-xl"></div>
        </div>
      </DialogTrigger>
      <DialogContent className="border-zinc-500 bg-black px-10 sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-300">Daily Quiz</DialogTitle>
        </DialogHeader>
        {!loading && <Quiz />}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {!isEditing && (
              <Button type="button" variant="outline" className="bg-zinc-300">
                Quit
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
