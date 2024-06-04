"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { create } from "domain";
import React from "react";

export default function DatabaseSessionTest() {
  return (
    <Button
      onClick={async () => {
        const supabase = createClient();
        const { error: dbError } = await supabase
          .from("practice_session")
          .insert([
            {
              session_duration: 1000,
              user_id: "bc68ff58-d6d4-4e69-b8dd-78e76a6953c7",
              session_score: 100,
              right_answers: 10,
              total_questions: 10,
            },
          ]);
        if (dbError) {
          console.log("DATABASE ERROR!", dbError);
        }
      }}
    >
      ADD SESSION TEST
    </Button>
  );
}
