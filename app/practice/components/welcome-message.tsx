"use client";

import React, { useState } from "react";
import resetTestAccount from "../actions/resetTestAccount";
import { Button } from "@/components/ui/button";

export default function WelcomeMessage() {
  const [hideMessage, setHideMessage] = useState(false);
  return (
    <>
      {hideMessage && (
        <Button
          onClick={() => setHideMessage(false)}
          className="bg-zinc-100 text-black shadow-md mt-3 hover:bg-zinc-300 text-md"
        >
          Show Reset Dialogue
        </Button>
      )}
      {!hideMessage && (
        <div className="text-black bg-zinc-100  max-w-3xl p-5 rounded-lg relative">
          <h1>Welcome! You're signed in with the test account.</h1>
          <p className="mt-3">
            Clicking reset below will reinitialize the account data and pre-load
            a few javascript questions so you can try out the spaced repetition
            dialog below.
          </p>
          <p className="mt-3">
            You can also visit the 'Create With AI' page to add your own.
          </p>
          <form action={resetTestAccount}>
            <Button className="bg-black text-zinc-300 shadow-md mt-3 hover:bg-zinc-800">
              Reset Test Account
            </Button>
          </form>
          <Button
            onClick={() => setHideMessage(true)}
            className="border-2 border-black shadow-md mt-3 hover:bg-zinc-300 absolute bottom-5 right-5"
          >
            Hide Message
          </Button>
        </div>
      )}
    </>
  );
}
