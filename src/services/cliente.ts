import axios from ".";

import { CreateCliente } from "@/interfaces/services";
import { APIResponse, AxiosAPIResponse } from "@/interfaces";
import { AxiosError } from "axios";

export const createCliente: CreateCliente = async (cliente) =>
  axios
    .post("/cliente", cliente)
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Request parametos incorreto.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });
