export const DEFAULT_TITLE = "Open Schedule";

export enum Period {
  Day = "day",
  Week = "week",
}

export const Periods: { [lang: string]: { [p in Period]: string } } = {
  "pt-BR": {
    [Period.Day]: "Dia",
    [Period.Week]: "Semana",
  },
};
export const MIN_INTERVAL = 15 * 60;

export const WeekDay = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export const WeekDayShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export const Month = [
  ["Janeiro", "Jan"],
  ["Fevereiro", "Fev"],
  ["Março", "Mar"],
  ["Abril", "Abr"],
  ["Maio", "Mai"],
  ["Junho", "Jun"],
  ["Julho", "Jul"],
  ["Agosto", "Ago"],
  ["Setembro", "Set"],
  ["Outubro", "Out"],
  ["Novembro", "Nov"],
  ["Dezembro", "Dez"],
];

export enum RECORD_TAB {
  appointment = 1,
  patient,
  history,
}
