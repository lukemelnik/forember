"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

export default function AIPage() {
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const notes = formData.get("notes") as string;
    const response = await fetch("/api/openai", {
      method: "POST",
      body: JSON.stringify({ notes }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setFragments(data);
    setLoading(false);
  }
  return (
    <div className="max-w-2xl">
      <h1 className="mb-3">Create Fragments using OpenAI</h1>
      <form
        onSubmit={handleSubmit}
        className={
          "min-w-2xl rounded flex flex-col items-left gap-2 max-w-2xl text-zinc-950 my-10" +
          (loading && " animate-pulse")
        }
      >
        <Label className="text-2xl font-bold text-zinc-300" htmlFor="notes">
          Enter Your Notes
        </Label>
        <Textarea
          disabled={loading}
          className="bg-black text-zinc-300 min-h-[200px]"
          id="notes"
          name="notes"
        />
        <Button disabled={loading} className="bg-zinc-300 mt-5" type="submit">
          {loading ? "Generating..." : "Generate Fragments"}
        </Button>
      </form>

      {fragments.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-5">
            <h2 className="text-2xl font-bold">
              {fragments.length} fragments created
            </h2>
            <Button variant="outline" className="bg-zinc-300 text-black">
              ADD ALL
            </Button>
          </div>
          <Carousel className="mt-4 border-2 border-zinc-300 rounded-xl p-5">
            <CarouselContent>
              {fragments.map((fragment) => (
                <CarouselItem key={fragment.question}>
                  <h2 className="font-bold">{fragment.question}</h2>
                  <p className="italic">{fragment.answer}</p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      className="bg-zinc-300 text-black mr-4"
                    >
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-zinc-300 text-black"
                    >
                      Delete
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-black" />
            <CarouselNext className="text-black" />
          </Carousel>
        </div>
      )}
    </div>
  );
}
