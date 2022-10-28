import axios from ".";

import {
  CreateCliente,
  GetClientes,
  UpdateCliente,
} from "@/data/interfaces/services";
import { APIResponse, AxiosAPIResponse } from "@/data/interfaces";
import { AxiosError } from "axios";

export const createCliente: CreateCliente = async (cliente) =>
  axios
    .post("/cliente", cliente)
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Request com parametos incorreto.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });

export const updateCliente: UpdateCliente = async (id, cliente) =>
  axios
    .put("/cliente/" + id, cliente)
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Request com parametos incorreto.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });

export const getClientes: GetClientes = async (params, id = undefined) =>
  axios
    .get("/clientes" + (id ? "/" + id : ""), { params })
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Request com parametos incorreto.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });
