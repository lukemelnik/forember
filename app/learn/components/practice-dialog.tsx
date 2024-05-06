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
import React, { useState } from "react";
import Quiz from "./quiz";
import { createClient } from "@/utils/supabase/client";

export default function PracticeDialog() {
  const [startTime, setStartTime] = useState<Date | null>(null);

  async function logSession(endTime: Date) {
    if (!startTime || !endTime) return;
    const session_duration = endTime.getTime() - startTime.getTime();
    if (session_duration < 1500) {
      console.log("session too short");
      return;
    }
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
        .insert({
          session_duration,
          user_id: user.id,
        });
    } catch (error) {
      console.error(error);
    }
    setStartTime(null);
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setStartTime(new Date());
        }
        if (!isOpen) {
          const endTime = new Date();
          logSession(endTime);
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="relative z-0 group max-w-max">
          <Button className="w-96 z-0 bg-zinc-100 text-black  group-hover:scale-105 duration-300 transition-all text-lg p-6">
            Start Learning
          </Button>
          <div className="absolute inset-0 bg-pink-500/70 -z-10  blur-lg scale-105 group-hover:bg-pink-500 group-hover:blur-xl duration-300 group-hover:scale-110"></div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Daily Practice</DialogTitle>
        </DialogHeader>
        <Quiz />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
