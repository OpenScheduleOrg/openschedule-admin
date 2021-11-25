import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import auth, { State as stateAuth } from "./modules/auth";

export interface State {
  auth: stateAuth;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  modules: {
    auth,
  },
  mutations: {},
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
