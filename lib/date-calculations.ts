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

export function getCurrentTime() {
  const date = new Date();
  let timeOfDay = "Morning";
  const hour = date.getHours();
  console.log("TIME: ", hour);
  if (hour >= 0 && hour < 12) {
    timeOfDay = "Morning";
  } else if (hour >= 12 && hour < 16) {
    timeOfDay = "Afternoon";
  } else if (hour >= 16) {
    timeOfDay = "Evening";
  }
  return timeOfDay;
}
