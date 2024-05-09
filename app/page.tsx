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
      <nav className="p-5 px-10 flex justify-between fixed top-0 left-0 right-0 border-b-2 border-zinc-700">
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
        <div className="mr-4">
          {user ? (
            <Link href="/practice">
              <Button className="text-2xl text-black bg-green-500 p-7">
                Practice
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="text-2xl text-black bg-zinc-300 p-7">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
      <main className="mt-40">
        <section className="flex flex-col items-center ">
          <div className="text-[95px] text-center -space-y-12 font-bold">
            <p>Learn faster.</p>
            <p className="">Remember more.</p>
          </div>
          <p className="text-xl max-w-2xl text-center m-auto">
            The world is moving at a blinding pace. Upskill quicker and enhance
            your creativity with the power of learning science and AI.
          </p>
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
