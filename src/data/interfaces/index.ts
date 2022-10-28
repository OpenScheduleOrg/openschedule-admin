import { AxiosResponse } from "axios";
import { Consulta, Clinica, Cliente, Horario, Funcionario } from "./models";

export * from "./models";

export interface APIResponseSuccess {
  consulta: Consulta;
  clinica: Clinica;
  cliente: Cliente;
  horario: Horario;
  consultas: Consulta[];
  clientes: Cliente[];
  horarios: Horario[];
  funcionario: Funcionario;
  funcionarios: Funcionario[];
}

export interface APIResponseFail {
  payload: { [param: string]: string };
  detail: { [param: string]: string };
}

export type APIResponse = {
  status: "success" | "fail" | "error";
  message?: string;
  data: APIResponseSuccess & APIResponseFail;
  path?: string;
};

export type AxiosAPIResponse = AxiosResponse<APIResponse>;

export type DayTime = {
  his: number;
  hours: number;
  minutes: number;
  hhmm: string;
};
