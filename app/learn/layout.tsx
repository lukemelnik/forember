import React from "react";
import NavHeader from "./components/nav-header";
import NavLinks from "./components/nav-links";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="grid grid-cols-4 w-full ">
        <nav className="col-span-1 p-10 text-gray-300">
          <NavHeader />
          <NavLinks />
        </nav>
        <section className="col-span-3 bg-zinc-900 min-h-screen p-10 flex flex-col gap-5">
          {children}
        </section>
      </div>
    </>
  );
}
