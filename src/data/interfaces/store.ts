import { Consulta } from ".";

export type DayDetails = {
  start: { his: number; hours: number; minutes: number; hhmm: string };
  end: { his: number; hours: number; minutes: number; hhmm: string };
  selected?: boolean;
}[];

export interface SixWeeksDay {
  day: number;
  month: number;
  year: number;
  isToday?: boolean;
  isSelected?: boolean;
  outMonth?: boolean;
  isValidDay?: boolean;
  consultas: Consulta[];
  hs_free: DayDetails;
}

export interface AgendaParams {
  day?: string;
  month?: string;
  year?: string;
}
