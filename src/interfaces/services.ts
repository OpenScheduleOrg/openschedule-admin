import {
  APIResponse,
  Cliente,
  Consulta,
  Clinica,
  Funcionario,
  Horario,
} from ".";

/* 


*/
export type GetLoged = () => Promise<APIResponse>;

export type Login = (
  username: string,
  password: string,
  remember?: boolean
) => Promise<APIResponse>;

export type Logout = () => Promise<APIResponse>;

/* 


*/
export type CreateConsulta = (consulta: {
  marcada: Date | string;
  descricao?: string;
  realizada: boolean;
  cliente_id: number;
  clinica_id: number;
}) => Promise<APIResponse>;

export type UpdateConsulta = (
  id: number,
  marcada?: Date,
  realizada?: boolean | null,
  descricao?: string | null
) => Promise<APIResponse>;


export type GetConsultas = (
  params: {
    clinica_id?: number;
    cliente_id?: number;
    date_start?: Date | String;
    date_end?: Date | String;
  },
  id?: number
) => Promise<APIResponse>;

export type DeleteConsulta = (id: number) => Promise<APIResponse>;

/* 


*/
export type CreateCliente = (cliente: Cliente) => Promise<APIResponse>;

export type UpdateCliente = (
  id: number,
  cliente: Cliente
) => Promise<APIResponse>;

export type GetClientes = (
  params: { nome?: string; telefone?: string; cpf?: string; nascimento?: Date },
  id?: number
) => Promise<APIResponse>;
/* 


*/
export type CreateClinica = (clinica: Clinica) => Promise<APIResponse>;

export type UpdateClinica = (
  id: number,
  clinica: Clinica
) => Promise<APIResponse>;

export type GetClinicas = (
  params: { telfone?: string; nome?: string; endereco?: string },
  id?: number
) => Promise<APIResponse>;

/* 


*/
export type CreateFuncionario = (
  funcionario: Funcionario
) => Promise<APIResponse>;

export type UpdateFuncionario = (
  funcionario: Funcionario
) => Promise<APIResponse>;

export type GetFuncionarios = (
  params: { email?: string; username?: string; nome?: string },
  id?: number
) => Promise<APIResponse>;

/* 


*/
export type CreateHorario = (horario: Horario) => Promise<APIResponse>;

export type UpdateHorario = (
  id: number,
  horario: Horario
) => Promise<APIResponse>;

export type GetHorarios = (params: {
  clinica_id: number;
}) => Promise<APIResponse>;
