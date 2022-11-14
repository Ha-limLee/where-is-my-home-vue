import Vue from "vue";
import Vuex from "vuex";
import api from "@/api/index";
import router from "@/router/index";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
  },
  plugins: [
    createPersistedState({
      paths: ["auth"],
    }),
  ],
});
