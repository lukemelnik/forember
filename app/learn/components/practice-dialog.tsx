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
import { set } from "date-fns";

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
        <Button variant="outline" className="text-zinc-900">
          Start Learning
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
