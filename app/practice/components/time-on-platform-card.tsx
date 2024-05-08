import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Session } from "./learning-dashboard";
import { differenceInDays, format, isThisWeek, startOfDay } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { totalDaysOnPlatform } from "@/lib/date-calculations";

export default async function TimeOnPlatformCard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No user found");
  }

  const { totalDays, formattedJoinedDate } = totalDaysOnPlatform(
    user.created_at
  );

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>You've Been Learning For</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">{totalDays}</p>
      </CardContent>
      <CardFooter>
        <p>
          {totalDays === 1 ? "Day" : "Days"} Joined on {formattedJoinedDate}
        </p>
      </CardFooter>
    </Card>
  );
}
