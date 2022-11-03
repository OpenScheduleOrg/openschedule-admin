import { Consulta } from ".";

export type DayDetail = {
  start: { his: number; hours: number; minutes: number; hhmm: string };
  end: { his: number; hours: number; minutes: number; hhmm: string };
  selected?: boolean;
};

export interface SixWeeksDay {
  day: number;
  month: number;
  year: number;
  isToday?: boolean;
  isSelected?: boolean;
  outMonth?: boolean;
  isValidDay?: boolean;
  consultas: Consulta[];
  hs_free: DayDetail[];
}

export interface AgendaParams {
  day?: string;
  month?: string;
  year?: string;
}
