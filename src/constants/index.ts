const year = new Date().getFullYear();

export enum Period {
  Day = "day",
  Week = "week",
}

export const Periods: {[lang: string]: {[p in Period]: string}} = {
  "pt-BR": {
    [Period.Day]: "Dia",
    [Period.Week]: "Semana",
  },
};

export const Month = [
  ["Janeiro", "Jan."],
  ["Fevereiro", "Fev."],
  ["Março", "Mar."],
  ["Abril", "Abr."],
  ["Maio", "Mai."],
  ["Junho", "Jun."],
  ["Julho", "Jul."],
  ["Agosto", "Ago."],
  ["Setembro", "Set."],
  ["Outubro", "Out."],
  ["Novembro", "Nov."],
  ["Dezembro", "Dez."],
];

export const MonthSize = [
  31,
  (year % 400 == 0 || year % 100 != 0) && year % 4 == 0 ? 29 : 28,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];
