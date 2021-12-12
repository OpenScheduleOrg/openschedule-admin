export const DEFAULT_TITLE = "ConsuChat";

export enum Period {
  Agenda = "agenda",
  Day = "day",
  Week = "week",
}

export const Periods: { [lang: string]: { [p in Period]: string } } = {
  "pt-BR": {
    [Period.Day]: "Dia",
    [Period.Week]: "Semana",
    [Period.Agenda]: "Consultas",
  },
};
export const MIN_INTERVAL = 15 * 60;

export const Week = [
  ["Domingo", "Dom"],
  ["Segunda-feira", "Seg"],
  ["Terça-feira", "Ter"],
  ["Quarta-feira", "Qua"],
  ["Quinta-feira", "Qui"],
  ["Sexta-feira", "Seg"],
  ["Sábado", "Sab"],
];

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
