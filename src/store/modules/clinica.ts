import { Module, Commit, Dispatch } from "vuex";
import { State as stateRoot } from "..";
import { Horario, Clinica } from "@/interfaces";
import { RESET_STATE, SET_CLINICA, SET_HORARIOS } from "./mutation-types";

import { getClinicas, getHorarios } from "@/services";

import { timeStringToS } from "@/utils";

export interface StateClinica extends Clinica {
  horarios?: [Horario];
}

const clinica: Module<StateClinica, stateRoot> = {
  namespaced: true,
  mutations: {
    [SET_CLINICA](state, clinica: Clinica) {
      state.id = clinica.id;
      state.nome = clinica.nome;
      state.endereco = clinica.endereco;
      state.telefone = clinica.telefone;
    },
    [SET_HORARIOS](state, horarios: [Horario]) {
      state.horarios = horarios;
    },
    [RESET_STATE](state) {
      delete state.id;
      delete state.nome;
      delete state.endereco;
      delete state.telefone;
      delete state.horarios;
    },
  },
  actions: {
    getClinica({
      commit,
      rootState,
      dispatch,
    }: {
      commit: Commit;
      rootState: stateRoot;
      dispatch: Dispatch;
    }) {
      return getClinicas(rootState.auth.user?.clinica_id)
        .then((res) => {
          commit(SET_CLINICA, res.data.data.clinica);
          return dispatch("getHorarios");
        })
        .catch((error) => {
          dispatch("resetState");
          return Promise.reject(error);
        });
    },
    getHorarios({ commit, state }: { commit: Commit; state: StateClinica }) {
      return getHorarios(state.id as number).then((res) => {
        const horarios = res.data.data.horarios;

        for (const h of horarios) {
          if (h.am_inicio) h.am_inicio = timeStringToS(h.am_inicio as string);
          if (h.am_fim) h.am_fim = timeStringToS(h.am_fim as string);
          if (h.pm_inicio) h.pm_inicio = timeStringToS(h.pm_inicio as string);
          if (h.pm_fim) h.pm_fim = timeStringToS(h.pm_fim as string);
          if (h.intervalo) h.intervalo = timeStringToS(h.intervalo as string);
        }
        commit(SET_HORARIOS, horarios);
      });
    },
    resetState({ commit }: { commit: Commit }) {
      commit(RESET_STATE);
    },
  },
};

export default clinica;
