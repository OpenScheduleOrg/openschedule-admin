import { Module } from "vuex";
import { State as stateRoot } from "..";
import { Horario, Clinica } from "@/interfaces";
import { SET_CLINICA, SET_HORARIOS } from "./mutation-types";

export interface StateClinica extends Clinica {
  horarios: [Horario] | [];
}

const clinica: Module<StateClinica, stateRoot> = {
  namespaced: true,
  state: {
    id: 0,
    nome: "",
    endereco: "",
    telefone: "",
    horarios: [],
  },
  mutations: {
    [SET_CLINICA](state, clinica: Clinica) {
        state.id = clinica.id
        state.nome = clinica.nome
        state.endereco = clinica.endereco
        state.telefone = clinica.telefone
    },
    [SET_HORARIOS](state, horarios: [Horario]) {
      state.horarios = horarios;
    },
  },
};

export default clinica;
