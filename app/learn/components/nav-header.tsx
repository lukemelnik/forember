import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import signOut from "../actions/signOut";
import LogoIcon from "@/components/ui/logo-svg";
import { Separator } from "@/components/ui/separator";

export default async function NavHeader() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <div className="flex gap-3 mb-3 items-center">
        <LogoIcon />
        <h1>Forember</h1>
      </div>
      <Separator className="bg-zinc-300 mb-3" />
      <div className="flex gap-3 items-center justify-between text-gray-300">
        <p>Signed in as {user?.email}</p>
        <form action={signOut}>
          <Button variant="outline" className="text-gray-950">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
