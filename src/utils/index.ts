import { Period } from "@/common/constants";
import { addDays } from "date-fns";

export function monthBetween(date: Date): Date {
  const month = date.getMonth();

  const week_start = addDays(date, -date.getDay());
  const week_end = addDays(date, 7 - date.getDay());
  if (week_start.getMonth() !== week_end.getMonth()) {
    if (week_start.getMonth() !== month) {
      return week_start;
    }
    return week_end;
  }
  return date;
}

export function setPeriod(p: Period): void {
  localStorage.setItem("period", p);
}

export function getPeriod(): Period {
  const period: Period =
    (localStorage.getItem("period") as Period | null) || Period.Week;
  return period;
}

export function timeStringToS(time_str: string): number {
  const [hh, mm, ss] = time_str.split(":");

  return Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
}

export function getUTCOffset(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() / 60;

  return (
    "GMT" +
    (offset < 0 ? "+" : "-") +
    (Math.abs(offset) > 9 ? Math.abs(offset) : "0" + Math.abs(offset))
  );
}
