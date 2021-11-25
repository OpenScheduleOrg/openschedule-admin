import {
  APIResponse,
  Cliente,
  Consulta,
  Clinica,
  Funcionario,
  Horario,
} from ".";

export type GetLoged  = () =>  Promise<APIResponse>

export type Login = (username: string, password: string, remember?: boolean) => Promise<APIResponse>

export type Logout = () => Promise<APIResponse>

export type CreateConsulta = (consulta: Consulta) => Promise<APIResponse>;

export type UpdateConsulta = (
  id: number,
  marcada: string | null,
  realizada: boolean | null,
  descricao: string | null
) => Promise<APIResponse>;

export type GetConsulta = (
  id?: number | "",
  clinicia_id?: number | null,
  cliente_id?: number | null,
  data_start?: Date | null,
  data_end?: Date | null
) => Promise<APIResponse>;

export type DeleteConsulta = (id:number) => Promise<APIResponse>;

export type CreateCliente = (cliente: Cliente) => Promise<APIResponse>;

export type UpdateCliente = (id: number, cliente: Cliente) => Promise<APIResponse>;

export type GetClientes = (
  id?: number | "",
  cliente?: Cliente,
  page?: number,
  perPage?: number
) => Promise<APIResponse>;

export type CreateClinica = (clinica: Clinica) => Promise<APIResponse>;

export type UpdateClinica = (id:number, clinica: Clinica) => Promise<APIResponse>;

export type GetClinicas = (
  id: number | "",
  clinica: Clinica
) => Promise<APIResponse>;

export type CreateFuncionario = (
  funcionario: Funcionario
) => Promise<APIResponse>;

export type UpdateFuncionario = (
  funcionario: Funcionario
) => Promise<APIResponse>;

export type GetFuncionarios = (
  id: number | "",
  funcionario: Funcionario
) => Promise<APIResponse>;




export type CreateHorario = (horario: Horario) => Promise<APIResponse>;

export type UpdateHorario = (id: number, horario: Horario) => Promise<APIResponse>;

export type GetHorarios = (
  id: number | "",
  horario: Horario
) => Promise<APIResponse>;
