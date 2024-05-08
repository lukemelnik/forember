"use client";
import RocketIcon from "@/components/rocket-icon";
import Link from "next/link";
import React from "react";

export default function NavLinks() {
  const navItemClasses =
    "relative after:absolute hover:after:bg-zinc-100 content-none after:left-0 after:w-[0%] hover:after:w-[100%] hover:after:top-9 hover:after:h-[3px] after:rounded hover:text-zinc-100 after:duration-500 transition-all";

  const natItems = [
    { name: "Practice", href: "/practice" },
    { name: "Create With AI", href: "/practice/ai" },
    { name: "Add Manually", href: "/practice/add" },
    { name: "Library", href: "/practice/library" },
    { name: "Profile", href: "/practice/profile" },
    { name: "FAQ", href: "/practice/faq" },
  ];

  return (
    <div className="pt-10  text-3xl">
      <ul className="space-y-4">
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