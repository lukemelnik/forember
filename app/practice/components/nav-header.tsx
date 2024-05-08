import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import signOut from "../actions/signOut";
import LogoIcon from "@/components/logo-svg";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default async function NavHeader() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <div className="flex  mb-3 items-center text-zinc-100">
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
      <Separator className="bg-zinc-300 mb-6 h-[2px]" />
      <div className="flex gap-3 items-center justify-between text-gray-300 flex-wrap">
        <p className="w-1/2 min-w-min">Signed in as {user?.email}</p>
        <form action={signOut}>
          <Button variant="outline" className="text-gray-950">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}