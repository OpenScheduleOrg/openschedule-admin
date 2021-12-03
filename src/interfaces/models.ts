export interface Consulta {
  id?: number;
  clinica_id: number;
  cliente_id: number;
  marcada: string | Date;
  descricao: string;
  realizada: boolean;
  clinica_nome?: string;
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
  nascimento: Date;
}

export interface Horario {
  id?: number;
  clinica_id:number;
  am_inicio: string | number;
  am_fim?: string | number;
  almoco: boolean;
  pm_inicio?: string | number;
  pm_fim: string | number;
  intervalo: string | number;
  dia_semana: number;
}

export interface Funcionario{
  id?: number;
  nome: string;
  sobrenome: string;
  username: string;
  email: string;
  password: string;
  clinica_id: number;
}
