import { Module, Commit } from "vuex";
import { State as stateRoot } from "..";
import { Funcionario, Funcionario as User } from "@/interfaces";
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "../mutation-types";
import { login, getLoged, logout } from "@/services/auth";

export interface State {
  status: boolean;
  user: User | null;
}

const auth: Module<State, stateRoot> = {
  namespaced: true,
  state: {
    status: false,
    user: null,
  },
  mutations: {
    [LOGIN_SUCCESS](state, user: Funcionario) {
      state.status = true;
      state.user = user;
    },
    [LOGIN_FAILURE](state) {
      state.status = false;
      state.user = null;
    },
    [LOGOUT](state) {
      state.status = false;
      state.user = null;
    },
  },
  actions: {
    login({ commit }: { commit: Commit }, payload) {
      return login(payload.username, payload.password, payload.rememberMe)
        .then((res) => {
          commit(LOGIN_SUCCESS, res.data.data.funcionario);
          return res;
        })
        .catch((error) => {
          commit(LOGIN_FAILURE);
          return Promise.reject(error);
        });
    },
    getLoged({ commit }: { commit: Commit }) {
      return getLoged()
        .then((res) => {
          commit(LOGIN_SUCCESS, res.data.data.funcionario);
          return res;
        })
        .catch((error) => {
          commit(LOGIN_FAILURE);
          return Promise.reject(error);
        });
    },
    logout({ commit }: { commit: Commit }) {
      logout();
      commit(LOGOUT);
    },
  },
};

export default auth;
