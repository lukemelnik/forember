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

export default async function TimeOnPlatformCard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No user found");
  }

  // have to set hours time to zero so it doesn't affect the calculation
  const currentDate = startOfDay(new Date());
  const joinedDate = startOfDay(new Date(user.created_at));
  const formattedJoinedDate = format(joinedDate, "MM/dd/yyyy");
  const totalDays = differenceInDays(currentDate, joinedDate) + 1;

  return (
    <Card className="max-w-md">
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
