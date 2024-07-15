"use client";

import React, { useEffect, useRef, useState } from "react";
import resetTestAccount from "../actions/reset-test-account";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import Link from "next/link";

export default function WelcomeMessage() {
  const [hideMessage, setHideMessage] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [formState, action] = useFormState(resetTestAccount, {
    success: false,
    message: "",
  });
  const [firstRender, setFirstRender] = useState(true);

  console.log(formState);
  // toast to let the user know the reset was successful
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    if (formState.message) {
      toast(formState.message, {
        duration: 4000,
      });
    }
  }, [formState]);

  // disabled the reset button while the reset is in progress
  function handleResetClick() {
    setTimeout(() => {
      setResetting(true);
    }, 50);
    setTimeout(() => {
      setResetting(false);
    }, 2000);
  }
  return (
    <>
      {hideMessage && (
        <Button
          onClick={() => setHideMessage(false)}
          className="mt-3 border-2 border-zinc-300 bg-black p-6 text-lg text-zinc-300 shadow-md hover:bg-zinc-800"
        >
          Show Reset Dialogue
        </Button>
      )}
      {!hideMessage && (
        <div className="relative max-w-3xl rounded-lg bg-zinc-100 p-5 text-black">
          <h1>Welcome! You're signed in with the test account.</h1>
          <ul className="list-disc p-5">
            <li>
              Clicking reset below will reinitialize the account data and
              pre-load a few javascript questions so you can try out the spaced
              repetition feature.
            </li>
            <li>
              Visit the{" "}
              <Link
                className="font-bold hover:underline"
                href="/practice/create"
              >
                Create Fragments
              </Link>{" "}
              page to add your own.
            </li>
            <li>
              Check out the{" "}
              <Link
                className="font-bold hover:underline"
                href="/practice/library"
              >
                Library
              </Link>{" "}
              page to search the knowledge base using full text search
            </li>
          </ul>
          <form
            action={async () => {
              action();
            }}
          >
            <Button
              className="mt-3 bg-black text-zinc-300 shadow-md hover:bg-zinc-800"
              disabled={resetting}
              onClick={handleResetClick}
            >
              Reset Test Account
            </Button>
          </form>
          <Button
            onClick={() => setHideMessage(true)}
            className="absolute bottom-5 right-5 mt-3 border-2 border-black shadow-md hover:bg-zinc-300"
          >
            Hide Message
          </Button>
        </div>
      )}
    </>
  );
}
