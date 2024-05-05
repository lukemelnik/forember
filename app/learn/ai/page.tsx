import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function AIPage() {
  return (
    <div>
      <h1>Create Fragments using OpenAI</h1>
      <form
        action="/api/openai"
        method="POST"
        className="min-w-2xl rounded flex flex-col items-left gap-2 max-w-2xl text-zinc-950 mt-10"
      >
        <Label className="text-zinc-300" htmlFor="notes">
          Enter Your Notes
        </Label>
        <Textarea className="bg-black text-zinc-300" id="notes" name="notes" />
        <Button className="bg-zinc-300 mt-5" type="submit">
          Create Fragments
        </Button>
      </form>
    </div>
  );
}
