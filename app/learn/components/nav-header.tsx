import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import signOut from "../actions/signOut";

export default async function NavHeader() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex gap-3 items-center">
      <p>Signed in as {user?.email}</p>
      <form action={signOut}>
        <Button className="bg-gray-950">Sign Out</Button>
      </form>
    </div>
  );
}
