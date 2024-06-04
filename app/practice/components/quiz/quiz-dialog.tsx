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

export type TestScore = {
  right: number;
  wrong: number;
};

export default function PracticeDialog() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  // doing a bit of prop drilling right now to get this state & updating functions down into the flashcard, will update if it seems worth it.
  // for reference, the structure is like this: Practice Page -> PracticeDialog -> Quiz -> FlashCard
  // Sessions are being logged here in the practice dialog, I'm going to add the scores & number of questions to the session log.
  const [testScore, setTestScore] = useState<TestScore>({ right: 0, wrong: 0 });
  const [open, setOpen] = useState(false);

  console.log("OPEN STATE: ", open);

  // the session status is controlled by the open state of the quiz dialog
  useEffect(() => {
    async function practiceDialogChange() {
      if (open) {
        console.log("STARTING SESSION");
        setStartTime(new Date());
      } else {
        console.log("ENDING SESSION");
        console.log("START TIME: ", startTime);
        const endTime = new Date();
        await logSession(endTime);
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

  async function logSession(endTime: Date) {
    console.log("LOGGING SESSION");
    if (!startTime || !endTime) {
      console.log("no start or end time");
      return;
    }
    const total_questions = testScore.right + testScore.wrong;
    if (total_questions === 0) {
      console.log("no questions answered");
      return;
    }
    const session_score = Math.round(
      (testScore.right / (testScore.right + testScore.wrong)) * 100
    );

    const session_duration = endTime.getTime() - startTime.getTime();
    if (session_duration < 1500) {
      console.log("session too short");
      return;
    }
    console.log("TOTAL QUESTIONS: ", total_questions);
    console.log("RIGHT ANSWERS: ", testScore.right);
    console.log("SESSION SCORE: ", session_score);
    console.log("SESSION DURATION: ", session_duration);
    const supabase = createClient();
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No user found");
      }

      const { error: dbError } = await supabase
        .from("practice_session")
        .insert([
          {
            session_duration,
            user_id: user.id,
            session_score,
            right_answers: testScore.right,
            total_questions,
          },
        ]);
    } catch (error) {
      console.error(error);
    }
    // had to reset the score otherwise it logs the total daily numbers for every session vs. only what they did while the dialog was open
    setTestScore({ right: 0, wrong: 0 });
    setStartTime(null);
    console.log("SESSION LOGGED");
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
