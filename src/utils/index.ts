import { Period } from "@/constants";
import { Consulta, DayTime, Horario } from "@/interfaces";

export function monthBetween(date: Date): Date {
  const month = date.getMonth();

  const week_start = date.addDays(-date.getDay());
  const week_end = date.addDays(7 - date.getDay());
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

export function sortHorarios(a: Horario, b: Horario): number {
  if (a.dia_semana < b.dia_semana) return -1;
  if (a.dia_semana > b.dia_semana) return 1;
  return 0;
}

export function sortConsultas(a: Consulta, b: Consulta): number {
  if (a.his < b.his) return -1;
  if (a.his > b.his) return 1;
  return 0;
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

export function secondsToHorario(s: number): DayTime {
  const s_to_minutes = s / 60;
  const minutes = s_to_minutes % 60;
  const hours = (s_to_minutes - minutes) / 60;

  const hhmm =
    (hours < 10 ? "0" : "") +
    String(hours) +
    ":" +
    (minutes < 10 ? "0" : "") +
    String(minutes);

  return { his: s, hours, minutes, hhmm };
}

export function formatCpf(cpf: string): string {
  return (
    cpf.slice(0, 3) +
    "." +
    cpf.slice(3, 6) +
    "." +
    cpf.slice(6, 9) +
    "-" +
    cpf.slice(9)
  );
}

export function formatTelefone(telefone: string): string {
  return (
    "(" +
    telefone.slice(0, 2) +
    ") 9 " +
    telefone.slice(2, 6) +
    "-" +
    telefone.slice(6)
  );
}
