import { Module, Commit, Dispatch } from "vuex";
import { State as stateRoot } from "..";
import { Funcionario } from "@/data/interfaces";
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./mutation-types";

export interface StateAuth {
  status: boolean;
  user: Funcionario | null;
}

const auth: Module<StateAuth, stateRoot> = {
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
    loginFailure({ commit }: { commit: Commit }, error) {
      commit(LOGIN_FAILURE);
      console.log(error);
      return Promise.reject(error);
    },
    login({ commit, dispatch }: { commit: Commit; dispatch: Dispatch }) {
      commit(LOGIN_SUCCESS, {
        id: 1,
        nome: "Foo",
        sobrenome: "Bar",
        username: "foobar",
        email: "foobar@email.com",
        clinica_id: 1,
      });
      return dispatch("clinica/setClinica", null, {
        root: true,
      });
    },
    setLoged({
      dispatch,
      state,
    }: {
      commit: Commit;
      dispatch: Dispatch;
      state: StateAuth;
    }) {
      if (state.status) {
        return Promise.resolve();
      }
      return Promise.reject(dispatch("loginFailure", undefined));
    },
    logout({ commit }: { commit: Commit }) {
      commit(LOGOUT);
    },
  },
};

export default auth;
