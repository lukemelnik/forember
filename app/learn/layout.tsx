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
      <nav className="p-5 fixed top-0 left-0 right-0 border-b-[1px] border-zinc-700 bg-black z-[50] sm:block xl:hidden ">
        <NavHeaderMobile />
      </nav>
      <div className="grid sm:grid-cols-1 xl:grid-cols-4 w-full mt-20 xl:mt-0">
        <nav className="md:col-span-1 p-10 text-gray-300 border-r-[1px] border-zinc-700 hidden xl:block">
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
