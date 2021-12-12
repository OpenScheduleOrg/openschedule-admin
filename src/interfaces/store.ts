import { Consulta } from ".";

export interface SixWeeksDay {
  day: number;
  month: number;
  year: number;
  isToday?: boolean;
  isSelected?: boolean;
  outMonth?: boolean;
  isValidDay?: boolean;
  consultas: Consulta[];
  hs_free: [
    { hours: number; minutes: number; hhmm: string },
    { hours: number; minutes: number; hhmm: string }
  ][];
}

export interface AgendaParams {
  day?: string;
  month?: string;
  year?: string;
}
