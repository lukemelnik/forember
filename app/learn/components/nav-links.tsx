import Link from "next/link";
import React from "react";

export default function NavLinks() {
  return (
    <div className="pt-10 text-2xl">
      <ul>
        <li>
          <Link href="/learn">Learn</Link>
        </li>
        <li>
          <Link href="/learn/add">Add Knowledge</Link>
        </li>
        <li>
          <Link href="/learn/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/learn/profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
}
