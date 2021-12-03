import axios from ".";

import { GetClinicas } from "@/interfaces/services";

export const getClinicas: GetClinicas = async (id = "", clinica = undefined) =>
  axios.get("/clinicas/" + id, { params: clinica });
