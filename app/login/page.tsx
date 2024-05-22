import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import Image from "next/image";
export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/practice");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/practice");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Please sign in.");
  };

  return (
    <>
      <div className="fixed bottom-0 p-5 border-t-[1px] border-zinc-700 w-full text-center">
        <p>
          You can give it a try with the test account using 'test@test.com' and
          'testing' as the password.
        </p>
      </div>
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 ">
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground border-white border-2 text-white hover:bg-btn-background-hover flex items-center group text-sm"
        >
          Back
        </Link>

        <form className="animate-in flex flex-col w-full justify-center gap-2 text-foreground text-zinc-300">
          <div className="flex items-center justify-center">
            <Image
              src={"/assets/images/favicon.png"}
              alt={"logo"}
              width={95}
              height={95}
            />
            <h1 className="text-white text-5xl pr-8 -ml-3">Forember</h1>
          </div>
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />

          <SubmitButton
            formAction={signIn}
            className="bg-pink-600 rounded-md px-4 py-2 text-foreground mb-2 hover:bg-pink-500"
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>
          <SubmitButton
            formAction={signUp}
            className="border border-foreground/20 rounded-md px-4 py-2 text-black bg-zinc-300 mb-2 hover:bg-zinc-200"
            pendingText="Signing Up..."
          >
            Sign Up
          </SubmitButton>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-white text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
