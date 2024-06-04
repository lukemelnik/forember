import React from "react";
import NavHeader from "./components/nav-header";
import NavLinks from "./components/nav-links";
import NavHeaderMobile from "./components/nav-header-mobile";
import UserInfoAndSignOut from "./components/user-info-and-signout";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {/* mobile nav */}
      <nav className="p-5 fixed top-0 left-0 right-0 border-b-[1px] border-zinc-700 bg-black z-[50] sm:block xl:hidden ">
        <NavHeaderMobile>
          <UserInfoAndSignOut />
        </NavHeaderMobile>
      </nav>
      {/* desktop nav */}
      <div className="grid sm:grid-cols-1 xl:grid-cols-4 w-full mt-20 xl:mt-0 min-h-svh">
        <nav className="md:col-span-1 p-10 text-gray-300 border-r-[1px] border-zinc-700 hidden xl:block">
          <NavHeader />
          <NavLinks />
        </nav>

        <section className="sm:col-span-4 md:col-span-3 bg-black p-8 md:p-1 flex flex-col gap-5">
          {children}
        </section>
      </div>
    </>
  );
}
