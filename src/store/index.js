import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {}
  },
  getters: {},
  mutations: {
    setUser: function (state, payload) {
      state.user = { ...payload };
    }
  },
  actions: {},
  modules: {},
});
