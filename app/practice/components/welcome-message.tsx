"use client";

import React, { useEffect, useRef, useState } from "react";
import resetTestAccount from "../actions/resetTestAccount";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { toast } from "sonner";

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
          className="bg-black border-2 border-zinc-300 text-zinc-300 shadow-md mt-3 hover:bg-zinc-800 text-lg p-6"
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
          <form
            action={async () => {
              action();
            }}
          >
            <Button
              className="bg-black text-zinc-300 shadow-md mt-3 hover:bg-zinc-800"
              disabled={resetting}
              onClick={handleResetClick}
            >
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
