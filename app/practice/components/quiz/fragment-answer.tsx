import React from "react";
import { Fragment } from "./quiz";

export default function FragmentAnswer({ fragment }: { fragment: Fragment }) {
  return (
    <div className="text-black">
      <h2 className="font-bold text-xl">A:</h2>
      <p className="">{fragment.answer}</p>{" "}
    </div>
  );
}
