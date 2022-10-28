import { DayTime } from ".";

export interface Consulta {
  id?: number;
  clinica_id: number;
  cliente_id: number;
  marcada:  Date;
  duracao: number;
  his: number;
  intervalo?: { start: DayTime; end: DayTime };
  descricao: string;
  realizada: boolean;
  clinica_nome?: string;
  clinica_telefone?: string;
  clinica_cpf?: string;
  clinica_endereco?: string;
  cliente_nome?: string;
  clinica_tipo?: string;
}

export interface Clinica {
  id?: number;
  nome?: string;
  telefone?: string;
  endereco?: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  nascimento: Date | string | null;
}

export interface Horario {
  id?: number;
  clinica_id: number;
  am_inicio: string | number;
  am_fim?: string | number;
  almoco: boolean;
  pm_inicio?: string | number;
  pm_fim: string | number;
  intervalo: string | number;
  dia_semana: number;
}

export interface Funcionario {
  id?: number;
  nome: string;
  sobrenome: string;
  username: string;
  email: string;
  password: string;
  clinica_id: number;
}
