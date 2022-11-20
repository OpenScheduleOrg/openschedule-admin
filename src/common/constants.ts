export const DEFAULT_TITLE = "ConsuChat";

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
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

export const WeekDayShort = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

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
