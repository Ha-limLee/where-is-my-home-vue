import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";
import board from './modules/board';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth, board
  },
  plugins: [
    createPersistedState({
      paths: ["auth", "board"],
      storage: sessionStorage
    }),
  ],
});
