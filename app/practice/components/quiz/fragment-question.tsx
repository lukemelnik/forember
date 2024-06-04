import React from "react";
import { Fragment } from "./quiz";

export default function FragmentQuestion({ fragment }: { fragment: Fragment }) {
  return (
    <div className="text-black">
      <h2 className="font-bold text-xl">Q:</h2>
      <p>{fragment?.question}</p>
    </div>
  );
}
