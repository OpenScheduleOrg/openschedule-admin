import axios from ".";

import { Login, GetLoged, Logout } from "@/interfaces/services";
import { APIResponse, AxiosAPIResponse } from "@/interfaces";
import { AxiosError } from "axios";

export const getLoged: GetLoged = async () =>
  await axios
    .get("/auth/loged")
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Usuário não possui token.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });

export const login: Login = async (username, password, rememberMe = false) =>
  await axios
    .post("/auth/signin", { username, password, rememberMe })
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Usuário ou senha incorreto.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });

export const logout: Logout = async () =>
  await axios
    .delete("/auth/logout")
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      const msg = "Um erro inesperado ocorreu.";
      return Promise.reject({ msg, res: e.response?.data });
    });
