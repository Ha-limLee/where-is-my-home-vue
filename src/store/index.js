import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";
import board from './modules/board';
import currRouter from './modules/curr-router';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth, board, 'curr-router': currRouter
  },
  plugins: [
    createPersistedState({
      paths: ["auth", "board", "curr-router"],
      storage: sessionStorage
    }),
  ],
});
