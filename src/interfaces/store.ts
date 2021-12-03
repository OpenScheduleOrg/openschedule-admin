export interface SixWeeksDay {
  day: number;
  month: number;
  year: number;
  isToday?: boolean;
  isSelected?: boolean;
  outMonth?: boolean;
}

export interface AgendaParams {
  day?: string;
  month?: string;
  year?: string;
}
