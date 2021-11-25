import axios from ".";

import { GetConsulta, CreateConsulta, UpdateConsulta} from "@/interfaces/services";

export const createConsulta: CreateConsulta = async (consulta)  =>
  await axios.post("/consulta", consulta);

export const updateConsulta: UpdateConsulta = async (
  id,
  marcada = null,
  realizada = null,
  descricao = null
) => await axios.put("/consulta/"+id, {marcada, realizada, descricao});

export const getConsultas: GetConsulta = async (
  id = "",
  clinicia_id = null,
  cliente_id = null,
  data_start = null,
  data_end = null
) =>
  await axios.get("/consultas/" + id, {
    params: {
      clinicia_id,
      cliente_id,
      data_start,
      data_end,
    },
  });
