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
  id: z.string({ message: "ID must be a string" }),
});

export default function FragmentEditForm({
  fragment,
  handleEdit,
}: {
  fragment: Fragment;
  handleEdit: () => void;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const form = useForm<z.infer<typeof createFragmentSchema>>({
    resolver: zodResolver(createFragmentSchema),
    defaultValues: {
      question: fragment.question,
      answer: fragment.answer,
    },
  });

  async function onSubmit(values: z.infer<typeof createFragmentSchema>) {
    console.log("SUBMITTING");
    const formData = new FormData();
    formData.append("question", values.question);
    formData.append("answer", values.answer);
    formData.append("id", fragment.id);
    const result = await updateFragment(formData);
    if (!result.success) {
      setServerError(result.message);
    }

    // only close the edit dialog if there are no errors
    if (result.success) {
      toast(result.message, { duration: 2000 });
      handleEdit();
    }
  }

  return (
    <Form {...form}>
      {serverError && <p>{serverError}</p>}
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
