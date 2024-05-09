import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-4">
      <Link href="/login">
        <Button className="text-2xl text-black bg-zinc-300 p-7">Login</Button>
      </Link>
      <Link href="/practice">
        <Button className="text-2xl text-black bg-green-500 p-7">
          Start Learning
        </Button>
      </Link>
    </div>
  );
}
