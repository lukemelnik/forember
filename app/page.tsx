import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return redirect("/login");
  }
  return (
    <>
      <nav className="p-5 px-10 flex justify-between items-center fixed top-0 left-0 right-0 border-b-2 border-zinc-700">
        <div className="flex items-center text-zinc-100">
          <Image
            src={"/assets/images/favicon.png"}
            alt={"logo"}
            width={55}
            height={55}
          />
          <h1>
            Re<sup>Collect</sup>
          </h1>
        </div>
        <div className="mr-4 flex gap-3 items-center">
          {user && <p>Logged in as {user.email}</p>}
          {user ? (
            <Link href="/practice">
              <Button className="text-xl text-black bg-zinc-300 p-5">
                Practice
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="text-xl text-black bg-zinc-300 p-5">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
      <main className="">
        <div className="absolute m-auto top-[300px] bg-gradient-to-r from-blue-700 to-blue-400 h-72 -rotate-12 w-[800px] rounded-full blur-[100px] opacity-20"></div>
        <section className="flex flex-col items-center justify-center min-h-screen">
          <div className="">
            <div className="text-[95px] flex flex-col items-center -space-y-10 font-bold -rotate-1">
              <p>Learn faster.</p>
              <p className="relative z-0 after:absolute after:bg-gradient-to-r after:from-pink-700 after:to-pink-500 after:-left-8 after:-right-8 after:h-24  after:-z-10 after:top-6 text-black bg-opacity-90">
                Remember more.
              </p>
            </div>
            <p className="text-xl max-w-2xl text-center m-auto">
              The world is moving at a blinding pace. Upskill quicker and
              enhance your creativity with the power of AI and spaced
              repetition.
            </p>
          </div>
          <Link href="/login" className="mt-5">
            <Button className="text-2xl text-black bg-zinc-300 p-7">
              Start Now
            </Button>
          </Link>
        </section>
      </main>
    </>
  );
}
