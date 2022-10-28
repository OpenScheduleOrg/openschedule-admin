import axios from ".";

import {
  GetConsultas,
  CreateConsulta,
  UpdateConsulta,
  DeleteConsulta,
} from "@/data/interfaces/services";
import { APIResponse, AxiosAPIResponse } from "@/data/interfaces";
import { AxiosError } from "axios";
import { secondsToHorario } from "@/utils";

export const createConsulta: CreateConsulta = async (consulta) =>
  await axios
    .post("/consulta", consulta)
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Payload request invalid.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });

export const updateConsulta: UpdateConsulta = async (
  id,
  marcada,
  realizada,
  descricao
) =>
  await axios
    .put("/consulta/" + id, { marcada, realizada, descricao })
    .then((res: AxiosAPIResponse) => res.data)
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Payload request invalid.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });

export const getConsultas: GetConsultas = async (params, id = undefined) =>
  await axios
    .get("/consultas" + (id ? "/" + id : ""), { params })
    .then((res: AxiosAPIResponse) => {
      if (res.data.data.consultas) {
        const consultas = res.data.data.consultas;
        for (let i = 0; i < consultas.length; i++) {
          const marcada = new Date(consultas[i].marcada);
          consultas[i].marcada = marcada;
          consultas[i].his =
            marcada.getHours() * 3600 +
            marcada.getMinutes() * 60 +
            marcada.getSeconds();
          consultas[i].intervalo = {
            start: secondsToHorario(consultas[i].his),
            end: secondsToHorario(consultas[i].his + consultas[i].duracao),
          };
        }
      } else {
        res.data.data.consulta.marcada = new Date(
          res.data.data.consulta.marcada
        );
        res.data.data.consulta.his =
          res.data.data.consulta.marcada.getHours() * 3600 +
          res.data.data.consulta.marcada.getMinutes() * 60 +
          res.data.data.consulta.marcada.getSeconds();
        res.data.data.consulta.intervalo = {
          start: secondsToHorario(res.data.data.consulta.his),
          end: secondsToHorario(
            res.data.data.consulta.his + res.data.data.consulta.duracao
          ),
        };
      }

      return res.data;
    })
    .catch((e: AxiosError<APIResponse>) => {
      let msg = "Um erro inesperado ocorreu.";
      if (e.response?.data.status == "fail") {
        msg = "Request parametos incorreto.";
      }
      return Promise.reject({ msg, res: e.response?.data });
    });

export const deleteConsulta: DeleteConsulta = (id) =>
  axios.delete("/consulta/" + id);
