import React from "react";
import Image from "next/image";
import HomepageLogin from "./homepage-login";

export default function HomepageNav() {
  return (
    <nav className="p-3 md:p-5 px-10 flex justify-between items-center fixed top-0 left-0 right-0 border-b-2 border-zinc-700">
      <div className="flex items-center text-zinc-100">
        <Image
          src={"/assets/images/favicon.png"}
          alt={"logo"}
          width={55}
          height={55}
        />
        <h1>Forember</h1>
      </div>
      <HomepageLogin />
    </nav>
  );
}
