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
          {user && <p className="hidden md:block">Logged in as {user.email}</p>}
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
      <main className="max-w-screen ">
        <div className="absolute m-auto top-[300px] bg-gradient-to-r from-blue-700 to-blue-400 h-72 -rotate-12 w-3/4 md:w-1/2 rounded-full blur-[100px] opacity-20"></div>
        <section className="flex flex-col items-center justify-center min-h-svh">
          <div className="">
            <div className="text-[44px] md:text-[75px] lg:text-[95px] flex flex-col items-center -space-y-3 md:-space-y-10 font-bold -rotate-1">
              <p className="opacity-90">Learn faster.</p>
              <p className="relative z-0 after:absolute after:bg-gradient-to-r after:from-pink-700 after:to-pink-500 md:after:h-20 lg:after:h-24 after:-z-10 md:after:top-5 lg:after:top-6 text-black bg-opacity-90 after:h-14 after:top-2 md:after:-left-6 md:after:-right-6 after:-right-3 after:-left-3">
                Remember more.
              </p>
            </div>
            <p className="max-w-[375px] text-lg md:text-xl md:max-w-2xl text-center m-auto mt-3 md:mt-1">
              The world is moving at a blinding pace. Upskill quicker and
              enhance your creativity with the power of AI and spaced
              repetition.
            </p>
          </div>
          <Link href="/login" className="mt-7">
            <Button className="text-lg md:text-2xl text-black bg-zinc-300 p-6 md:p-7 hover:bg-zinc-100 hover:scale-105 duration-300 transition-all ">
              Start Now
            </Button>
          </Link>
        </section>
      </main>
    </>
  );
}
