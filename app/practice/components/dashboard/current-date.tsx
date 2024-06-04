import React from "react";

export default function CurrentDate() {
  return <p className="mb-5 hidden sm:block">{new Date().toDateString()}</p>;
}
