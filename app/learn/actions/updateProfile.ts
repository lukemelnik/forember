"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 3 characters long" })
    .max(20, {
      message: "First name must be at most 20 characters long",
    }),
  last_name: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters long" })
    .max(20, { message: "Last name must be at most 20 characters long" }),
});

interface updateProfileFormState {
  errors: {
    first_name?: string[];
    last_name?: string[];
    _form?: string[];
  };
}

export async function updateProfile(
  formState: updateProfileFormState,
  Formdata: FormData
): Promise<updateProfileFormState> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // NEED TO VALIDATE SIGNED IN USER
  if (!user) {
    return {
      errors: { _form: ["You must be signed in to update your profile"] },
    };
  }

  const result = updateProfileSchema.safeParse({
    first_name: Formdata.get("first_name"),
    last_name: Formdata.get("last_name"),
  });

  // validation errors
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // try/catch for writing to the db in order to catch errors and add them to the same form

  try {
    const { error } = await supabase
      .from("profile")
      .update({
        first_name: result.data.first_name,
        last_name: result.data.last_name,
      })
      .eq("user_id", user.id);
    console.log("updated");
    if (error) {
      throw new Error("Could not update profile");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } };
    } else {
      return { errors: { _form: ["Uh oh, something went wrong"] } };
    }
  }
  revalidatePath("/learn/profile");
  // return an empty error object to keep everyone happy
  return { errors: {} };
}
