"use client";
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
          <Link href="/learn/add">Add A Flashcard</Link>
        </li>
        <li>
          <Link href="/learn/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/learn/profile">Profile</Link>
        </li>
        <li>
          <Link href="/learn/faq">FAQ</Link>
        </li>
      </ul>
    </div>
  );
}
