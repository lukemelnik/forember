import { addDays, differenceInDays, format, startOfDay } from "date-fns";

export function totalDaysOnPlatform(userCreatedDate: string) {
  // time has to be set to zero so it calculates using full days
  const currentDate = startOfDay(new Date());
  const joinedDate = startOfDay(new Date(userCreatedDate));
  const formattedJoinedDate = format(joinedDate, "MM/dd/yyyy");
  const totalDays = differenceInDays(currentDate, joinedDate) + 1;
  return { totalDays, formattedJoinedDate };
}

export function tomorrow() {
  const currentDate = new Date();
  const tomorrow = addDays(currentDate, 1);
  return tomorrow;
}
