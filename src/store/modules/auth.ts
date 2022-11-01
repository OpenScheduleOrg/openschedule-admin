import { Module, Commit, Dispatch } from "vuex";
import { State as stateRoot } from "..";
import {
  SET_AUTH_STATE,
  RESET_AUTH_STATE,
  REFRESH_TOKEN,
} from "./mutation-types";
import { CurrentUser } from "@/domain/models";
import { AuthInfo } from "@/domain/models";
import { authService } from "@/domain/services";
import { LocalStorageManager } from "@/data/storage";
import { Credentials } from "@/domain/params";

export interface StateAuth {
  access_token?: string;
  current_user?: CurrentUser;
  exp: number;
}

const auth: Module<StateAuth, stateRoot> = {
  namespaced: true,
  state: { exp: 0 },
  mutations: {
    [SET_AUTH_STATE](state, auth_info: AuthInfo) {
      state.current_user = auth_info.current_user;
      state.access_token = auth_info.tokens.access_token;
      state.exp = auth_info.tokens.exp_access_token;
    },
    [REFRESH_TOKEN](state, auth_info: AuthInfo) {
      state.access_token = auth_info.tokens.access_token;
      state.exp = auth_info.tokens.exp_access_token;
    },
    [RESET_AUTH_STATE](state) {
      delete state.current_user;
      delete state.access_token;
      state.exp = 0;
    },
  },
  actions: {
    async login(
      { commit }: { commit: Commit; dispatch: Dispatch },
      credentials: Credentials
    ) {
      const auth_info = await authService.login(credentials);
      if (auth_info.tokens.session_token)
        LocalStorageManager.saveSessionToken(auth_info.tokens.session_token);

      commit(SET_AUTH_STATE, auth_info);
    },
    async restoreSession({ commit }: { commit: Commit; dispatch: Dispatch }) {
      const session_token = LocalStorageManager.getSessionToken();
      if (session_token) {
        const auth_info = await authService.restoreSession(session_token);
        if (auth_info.tokens.session_token)
          LocalStorageManager.saveSessionToken(auth_info.tokens.session_token);

        commit(SET_AUTH_STATE, auth_info);
        return Promise.resolve();
      }

      console.warn("Session token not found");
      return Promise.reject();
    },
    logout({ commit }: { commit: Commit }) {
      LocalStorageManager.removeSessionToken();
      commit(RESET_AUTH_STATE);
    },
    async getAccessToken({
      commit,
      state,
    }: {
      commit: Commit;
      state: StateAuth;
    }) {
      let access_token = state.access_token;
      const session_token = LocalStorageManager.getSessionToken();

      const exp = state.exp * 1000;
      if (exp - 600000 < Date.now()) {
        try {
          let auth_info;
          if (exp - 100000 < Date.now() && session_token) {
            auth_info = await authService.restoreSession(session_token);
          } else {
            auth_info = await authService.refreshToken(
              state.access_token as string
            );
          }

          commit(REFRESH_TOKEN, auth_info);
          access_token = auth_info.tokens.access_token;
        } catch (err) {
          console.warn("Could not get new token");
          console.error(err);
        }
      }

      return access_token;
    },
  },
};

export default auth;
