import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      userId: "",
      userName: "",
      userPassword: "",
      address: "",
      phoneNumber: "",
    }
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
