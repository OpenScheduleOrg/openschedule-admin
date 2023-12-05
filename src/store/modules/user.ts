import { Module, Commit } from "vuex";
import { State as stateRoot } from "..";
import {
  END_LOADING,
  RESET_USERS_STATE,
  SET_USERS,
} from "./mutation-types";
import { UserModel } from "@/domain/models";
import { userService } from "@/domain/services";

export type StateUsers = {
  users: UserModel[];
  page: number;
  items_per_page: number;
  isLoading: boolean;
};

export const UsersModule: Module<StateUsers, stateRoot> = {
  namespaced: true,
  state: {
    users: [],
    page: 1,
    items_per_page: 20,
    isLoading: true,
  },
  mutations: {
    [END_LOADING](state) {
      state.isLoading = false;
    },
    [SET_USERS](state, users: UserModel[]) {
      state.users = users;
    },
    [RESET_USERS_STATE](state) {
      state.users = [];
      state.page = 1;
      state.isLoading = true;
    },
  },
  actions: {
    load({ commit }: { commit: Commit }) {
      commit(RESET_USERS_STATE);
      return userService.load().then((users) => {
        commit(END_LOADING);
        commit(SET_USERS, users);
      });
    },
  },
};
