"use client";

import { useFormState } from "react-dom";
import { createFragment } from "../actions/createFragment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "../actions/updateProfile";
import { set } from "zod";

export default function UpdateProfileForm() {
  const [formState, action] = useFormState(updateProfile, { errors: {} });
  const [firstRender, setFirstRender] = useState(true);

  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    if (Object.keys(formState.errors).length === 0) {
      toast("Profile update successful 🎉", { duration: 2000 });
      ref.current?.reset();
    } else {
      toast("Profile update unsuccessful 😢", {
        duration: 2000,
      });
    }
  }, [formState.errors]);

  return (
    <form
      ref={ref}
      className="min-w-2xl bg-gray-600 p-5 rounded flex flex-col items-left gap-2 max-w-2xl"
      action={async (formData) => {
        action(formData);
      }}
    >
      <Label htmlFor="first_name">First Name</Label>
      <Input id="first_name" name="first_name" />
      {formState.errors.first_name && (
        <p className="text-red-600">{formState.errors.first_name.join(" ,")}</p>
      )}
      <Label htmlFor="last_name">Last Name</Label>
      <Input id="last_name" name="last_name" />
      {formState.errors.last_name && (
        <p className="text-red-600">{formState.errors.last_name.join(" ,")}</p>
      )}
      <Button className="bg-gray-950 text-gray-300" type="submit">
        Update Profile
      </Button>
      {formState.errors._form && (
        <p className="text-red-700">{formState.errors._form.join(", ")}</p>
      )}
    </form>
  );
}
