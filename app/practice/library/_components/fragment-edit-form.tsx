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

const createFragmentSchema = z.object({
  question: z
    .string()
    .trim()
    .min(5, { message: "Question must be at least 5 characters long" })
    .max(500, {
      message: "Question must be at most 250 characters long",
    }),
  answer: z
    .string()
    .trim()
    .min(3, { message: "Answer must be at least 3 characters long" })
    .max(500, { message: "Answer must be at most 250 characters long" }),
  id: z.string({ message: "ID must be a string" }),
});

export default function FragmentEditForm({
  fragment,
  handleEdit,
}: {
  fragment: Fragment;
  handleEdit: () => void;
}) {
  const form = useForm<z.infer<typeof createFragmentSchema>>({
    resolver: zodResolver(createFragmentSchema),
    defaultValues: {
      question: fragment.question,
      answer: fragment.answer,
    },
  });

  function onSubmit(values: z.infer<typeof createFragmentSchema>) {
    updateFragment(values, id);

    // only close the edit dialog if there are no errors
    const {
      formState: { errors },
    } = form;
    if (Object.keys(errors).length === 0) {
      handleEdit();
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
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your question here..."
                  {...field}
                  className="text-black"
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
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer here..."
                  {...field}
                  className="text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-zinc-300 text-black">
          Save
        </Button>
      </form>
    </Form>
  );
}
