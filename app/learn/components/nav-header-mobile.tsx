"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import signOut from "../actions/signOut";
import LogoIcon from "@/components/logo-svg";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import HamburgerIcon from "@/components/hamburger-icon";
import { useState } from "react";
import NavLinks from "./nav-links";

export default function NavHeaderMobile() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
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
        <div className="flex items-center gap-4 justify-between text-gray-300 flex-wrap">
          {/* <p className="">Signed in as {user?.email}</p>
        <form action={signOut}>
          <Button variant="outline" className="text-gray-950">
            Sign Out
          </Button>
        </form> */}

          <Button onClick={() => setShowMenu(!showMenu)}>
            <HamburgerIcon />
          </Button>
        </div>
      </div>
      {showMenu && (
        <div className="mb-5 mt-3">
          <Separator className="bg-white" />
          <div className="ml-5" onClick={() => setShowMenu(!showMenu)}>
            <NavLinks />
          </div>
        </div>
      )}
    </>
  );
}
