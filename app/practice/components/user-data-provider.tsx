"use client";

import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import React, { createContext } from "react";

export const UserDataContext = createContext({ value: 1 });

export default async function UserDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = 42;
  return (
    <UserDataContext.Provider value={{ value }}>
      {children}
    </UserDataContext.Provider>
  );
}
