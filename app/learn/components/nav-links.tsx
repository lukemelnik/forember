"use client";
import RocketIcon from "@/components/rocket-svg";
import Link from "next/link";
import React from "react";

export default function NavLinks() {
  const navItemClasses =
    "relative after:absolute hover:after:bg-zinc-100 content-none after:left-0 after:w-[0%] hover:after:w-[100%] hover:after:top-7 hover:after:h-[2px] after:rounded hover:text-zinc-100 after:duration-500 transition-all";

  const natItems = [
    { name: "Learn", href: "/learn" },
    { name: "Add Fragment", href: "/learn/add" },
    { name: "Use AI", href: "/learn/ai" },
    { name: "Library", href: "/learn/library" },
    { name: "Profile", href: "/learn/profile" },
    { name: "FAQ", href: "/learn/faq" },
  ];

  return (
    <div className="pt-10 text-2xl">
      <ul className="space-y-2 ">
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
