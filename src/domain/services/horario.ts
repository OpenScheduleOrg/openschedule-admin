import axios from ".";

import { GetHorarios } from "@/data/interfaces/services";
import { APIResponse, AxiosAPIResponse } from "@/data/interfaces";
import { AxiosError } from "axios";

export const getHorarios: GetHorarios = async (params) =>
  axios
    .get("/horarios", { params })
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Request parametos incorreto.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });
