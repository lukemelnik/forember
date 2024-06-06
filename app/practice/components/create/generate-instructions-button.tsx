import ArrowRightIcon from "@/components/arrow-right-icon";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import GenerateFragmentInstructions from "./generate-fragment-instructions";

export default function GenerateInstructionsButton() {
  const [instructionShow, setInstructionShow] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        className="group mb-5 border-2 border-zinc-300 bg-black text-zinc-300"
        onClick={() => setInstructionShow(!instructionShow)}
      >
        {instructionShow ? "Hide Instructions" : "Show Instructions"}{" "}
        <span className={instructionShow ? "rotate-90" : ""}>
          <ArrowRightIcon />
        </span>
      </Button>
      {instructionShow && <GenerateFragmentInstructions />}
    </>
  );
}
