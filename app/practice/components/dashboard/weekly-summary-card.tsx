import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DailySession, Profile, Session } from "./learning-dashboard";
import { createClient } from "@/utils/supabase/client";
import { isPast, startOfDay } from "date-fns";

import RecallChart from "./recall-chart";
import { Separator } from "@/components/ui/separator";
import PracticeDialog from "../quiz/quiz-dialog";
import FragmentsReviewedChart from "./fragments-reviewed-chart";
import DashboardGreeting from "./dashboard-greeting";
import DashboardHeader from "./dashboard-header";

export default async function WeeklySummaryCard({
  profile,
  sessions,
}: {
  profile: Profile[];
  sessions: DailySession[];
}) {
  return (
    <Card className=" md:col-span-3">
      <CardHeader>
        <CardTitle>
          <DashboardHeader />

          <Separator className="bg-zinc-300 mt-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 && (
          <div className="lg:flex mb-10">
            <RecallChart sessions={sessions} />
            <FragmentsReviewedChart sessions={sessions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
