export function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

export function getNextShowDate(interval: number) {
  const date = new Date();
  date.setDate(date.getDate() + interval);
  return date;
}
