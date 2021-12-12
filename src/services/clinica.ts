import axios from ".";

import { GetClinicas } from "@/interfaces/services";
import { APIResponse, AxiosAPIResponse } from "@/interfaces";
import { AxiosError } from "axios";

export const getClinicas: GetClinicas = async (params, id = undefined) =>
  axios
    .get("/clinicas" + (id ? `/${id}` : ""), { params })
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Request parametos incorreto.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });
