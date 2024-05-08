"use client";
import RocketIcon from "@/components/rocket-icon";
import Link from "next/link";
import React from "react";

export default function NavLinks() {
  const navItemClasses =
    "relative after:absolute hover:after:bg-zinc-100 content-none after:left-0 after:w-[0%] hover:after:w-[100%] hover:after:top-7 hover:after:h-[2px] after:rounded hover:text-zinc-100 after:duration-500 transition-all";

  const natItems = [
    { name: "Learn", href: "/learn" },
    { name: "Use AI", href: "/learn/ai" },
    { name: "Add Fragment", href: "/learn/add" },
    { name: "Library", href: "/learn/library" },
    { name: "Profile", href: "/learn/profile" },
    { name: "FAQ", href: "/learn/faq" },
  ];

  return (
    <div className="pt-10 md:text-2xl text-4xl">
      <ul className="md:space-y-2 space-y-4">
        {natItems.map((item) => (
          <li className="flex gap-1 items-center group" key={item.name}>
            <Link className={navItemClasses} href={item.href}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
