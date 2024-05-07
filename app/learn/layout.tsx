import React from "react";
import NavHeader from "./components/nav-header";
import NavLinks from "./components/nav-links";
import NavHeaderMobile from "./components/nav-header-mobile";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="p-5 fixed top-0 inset-0 h-36 border-b-[1px] border-zinc-700 bg-black z-[9999]">
        <NavHeaderMobile />
      </nav>
      <div className="grid sm:grid-cols-1 md:grid-cols-4 w-full md:mt-32">
        <nav className="md:col-span-1 p-10 text-gray-300 border-r-[1px] border-zinc-700 hidden lg:block">
          <NavHeader />
          <NavLinks />
        </nav>

        <section className="sm:col-span-4 md:col-span-3 bg-black min-h-screen p-16 flex flex-col gap-5">
          {children}
        </section>
      </div>
    </>
  );
}
