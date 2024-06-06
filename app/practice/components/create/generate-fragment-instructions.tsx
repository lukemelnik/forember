import React from "react";

export default function GenerateFragmentInstructions() {
  return (
    <ul className="mb-4 space-y-3">
      <li>
        <p>Step 1: Enter your notes</p>
        <p className="italic">
          * Hot Tip * Include a title that references the source e.g. a book
          title & author, podcast host etc. to give each fragment more context.
        </p>
      </li>
      <li>Step 2: Generate fragments</li>
      <li>
        Step 3: Review the fragments, adding them to your library or editing
        them first. Delete any you don't want to keep.
      </li>
      <li>Step 4: Practice!</li>
    </ul>
  );
}
