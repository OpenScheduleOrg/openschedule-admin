import axios from ".";

import { GetHorarios } from "@/interfaces/services";


export const getHorarios: GetHorarios = async (clinica_id) =>
  axios.get("/horarios", { params: { clinica_id } });
