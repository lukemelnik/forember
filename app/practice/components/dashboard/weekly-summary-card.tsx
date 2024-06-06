import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DailySession, Profile, Session } from "./dashboard";
import { createClient } from "@/utils/supabase/client";
import { isPast, startOfDay } from "date-fns";

import RecallChart from "./recall-chart";
import { Separator } from "@/components/ui/separator";
import PracticeDialog from "../quiz/quiz-dialog";
import FragmentsReviewedChart from "./fragments-reviewed-chart";
import DashboardGreeting from "./weekly-summary-greeting";
import DashboardHeader from "./weekly-summary-header";
import WeeklySummaryHeader from "./weekly-summary-header";

export default async function WeeklySummaryCard({
  profile,
  sessions,
  timeframe,
}: {
  profile: Profile[];
  sessions: DailySession[];
  timeframe: number;
}) {
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>
          <WeeklySummaryHeader />
          <Separator className="mt-5 bg-zinc-300" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 && (
          <div className="mb-10 lg:flex">
            <RecallChart sessions={sessions} timeframe={timeframe} />
            <FragmentsReviewedChart sessions={sessions} timeframe={timeframe} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
