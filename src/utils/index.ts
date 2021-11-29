import { Period } from "@/constants";

export function monthBetween(date: Date): null | number {
  const month = date.getMonth();

  const week_start = date.addDays(-date.getDay());
  const week_end = date.addDays(7 - date.getDay());
  if (week_start.getMonth() !== week_end.getMonth()) {
    if (week_start.getMonth() == date.getMonth())
      return month == 11 ? 0 : month + 1;
    return month == 0 ? 11 : month - 1;
  }

  return null;
}

export function setPeriod(p: Period): void {
  localStorage.setItem("period", p);
}

export function getPeriod(): Period {
  const period: Period =
    (localStorage.getItem("period") as Period | null) || Period.Week;
  return period;
}
