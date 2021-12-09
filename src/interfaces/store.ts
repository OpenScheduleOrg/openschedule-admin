export interface SixWeeksDay {
  day: number;
  month: number;
  year: number;
  isToday?: boolean;
  isSelected?: boolean;
  outMonth?: boolean;
  isValidDay?: boolean;
  hs_occup: number;
  hs_free: number;
}

export interface AgendaParams {
  day?: string;
  month?: string;
  year?: string;
}
