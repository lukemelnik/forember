import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import signOut from "../actions/signOut";
import LogoIcon from "@/components/logo-svg";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default async function NavHeaderMobile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex justify-between">
      <div className="flex mb-3 items-center text-zinc-100">
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
      <div className="flex items-center gap-4 justify-between text-gray-300 flex-wrap">
        <p className="">Signed in as {user?.email}</p>
        <form action={signOut}>
          <Button variant="outline" className="text-gray-950">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
