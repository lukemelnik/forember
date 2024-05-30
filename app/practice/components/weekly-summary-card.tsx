import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Profile, Session } from "./learning-dashboard";

export default function WeeklySummaryCard({
  profile,
  sessions,
}: {
  profile: Profile[];
  sessions: Session[];
}) {
  return (
    <Card className="h-96 w-full">
      <CardHeader>
        <CardTitle>Good Morning {profile && profile[0].first_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-black text-4xl">CONTENT</p>
      </CardContent>
      <CardFooter>
        <p>Footer</p>
      </CardFooter>
    </Card>
  );
}
