import axios from ".";

import {
  GetConsulta,
  CreateConsulta,
  UpdateConsulta,
} from "@/interfaces/services";

export const createConsulta: CreateConsulta = async (consulta) =>
  await axios.post("/consulta", consulta);

export const updateConsulta: UpdateConsulta = async (
  id,
  marcada = null,
  realizada = null,
  descricao = null
) => await axios.put("/consulta" + id, { marcada, realizada, descricao });

export const getConsultas: GetConsulta = async (params, id) =>
  await axios.get("/consultas" + (id ? "/" + id : ""), { params });
