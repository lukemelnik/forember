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
import React, { useEffect, useState } from "react";
import Quiz from "./quiz";
import { createClient } from "@/utils/supabase/client";
import revalidatePracticePage from "../../actions/revalidate-practice-page";
import { logSession } from "../../actions/add-session";

export type TestScore = {
  right: number;
  wrong: number;
};

export default function PracticeDialog() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [testScore, setTestScore] = useState<TestScore>({ right: 0, wrong: 0 });
  const [open, setOpen] = useState(false);

  // the session status is controlled by the open state of the quiz dialog
  useEffect(() => {
    async function practiceDialogChange() {
      if (open) {
        setStartTime(new Date());
      } else {
        if (!startTime) return;
        await logSession(startTime, testScore);
        setTestScore({ right: 0, wrong: 0 });
        setStartTime(null);
        revalidatePracticePage();
      }
    }
    practiceDialogChange();
  }, [open]);

  function addRightAnswer() {
    setTestScore({ ...testScore, right: testScore.right + 1 });
  }

  function addWrongAnswer() {
    setTestScore({ ...testScore, wrong: testScore.wrong + 1 });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative z-0 group max-w-[300px]">
          <Button className="w-full z-0 bg-zinc-100 text-black  group-hover:scale-105 duration-300 transition-all text-lg p-6">
            Start Daily Quiz
          </Button>
          <div className="absolute inset-0 bg-pink-500/70 -z-10  blur-lg scale-105 group-hover:bg-pink-500 group-hover:blur-xl duration-300 group-hover:scale-110"></div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl bg-black border-zinc-500 px-10">
        <DialogHeader>
          <DialogTitle className="text-zinc-300">Daily Quiz</DialogTitle>
        </DialogHeader>
        <Quiz
          testScore={testScore}
          handleRightAnswer={addRightAnswer}
          handleWrongAnswer={addWrongAnswer}
        />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="bg-zinc-300">
              Quit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
