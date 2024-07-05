"use client";

import React from "react";
import { Fragment } from "../../components/quiz/quiz";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateFragment } from "../_actions/actions";
import { toast } from "sonner";
import { useQuizContext } from "@/app/contexts/QuizContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { clear } from "console";

const createFragmentSchema = z.object({
  question: z
    .string()
    .trim()
    .min(5, { message: "Question must be at least 5 characters long" })
    .max(500, {
      message: "Question must be at most 500 characters long",
    }),
  answer: z
    .string()
    .trim()
    .min(3, { message: "Answer must be at least 3 characters long" })
    .max(500, { message: "Answer must be at most 500 characters long" }),
});

export default function FragmentEditForm({
  fragment,
  handleEdit,
  variant,
  clearSearchData,
}: {
  fragment: Fragment;
  handleEdit: () => void;
  variant: "library" | "quiz";
  clearSearchData?: () => void;
}) {
  const { dispatch } = useQuizContext();
  const router = useRouter();

  const form = useForm<z.infer<typeof createFragmentSchema>>({
    resolver: zodResolver(createFragmentSchema),
    defaultValues: {
      question: fragment.question,
      answer: fragment.answer,
    },
  });

  async function onSubmit(values: z.infer<typeof createFragmentSchema>) {
    // convert the values from RHF -> server actions expect formData
    const formData = new FormData();
    formData.append("question", values.question);
    formData.append("answer", values.answer);
    formData.append("id", fragment.id);
    const result = await updateFragment(formData);
    if (!result.success) {
      toast(result.message, { duration: 2000 });
    }
    // only close the edit dialog if there are no errors
    //checking if handleEdit exists because the edit form is used elsewhere where handleEdit isn't required
    if (result.success && handleEdit) {
      toast(result.message, { duration: 2000 });
      handleEdit();
    }
    dispatch({ type: "set isEditing", payload: false });
    // for the library page, clear the search data to trigger a refetch of the data
    if (clearSearchData) {
      clearSearchData();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={variant === "quiz" ? "text-black" : "text-zinc-300"}
              >
                Question
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your question here..."
                  {...field}
                  className="text-md border-2 border-black text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={variant === "quiz" ? "text-black" : "text-zinc-300"}
              >
                Answer
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here..."
                  {...field}
                  className="text-md min-h-min border-2 border-black text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          {variant === "quiz" ? (
            <Button
              type="submit"
              className="bg-black text-zinc-300 hover:bg-zinc-800"
            >
              Save
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-zinc-300 text-black hover:bg-zinc-400"
            >
              Save
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            // also sets the isEditing stat to false to make the quiz quit button reappear
            onClick={() => {
              handleEdit();
              dispatch({ type: "set isEditing", payload: false });
            }}
            className={cn(
              "border-2 border-black bg-zinc-300 text-black hover:bg-zinc-400",
              variant === "library" &&
                "border-zinc-300 bg-black text-zinc-300 hover:bg-zinc-800",
            )}
          >
            Undo
          </Button>
        </div>
      </form>
    </Form>
  );
}
