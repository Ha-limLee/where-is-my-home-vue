import api from "@/api/index";
import router from "@/router/index";

const auth = {
  namespaced: true,
  state: {
    user: {
      userId: "",
      userName: "",
      userPassword: "",
      address: "",
      phoneNumber: "",
    },
    isLogin: false,
    isLoginError: false,
  },
  getters: {},
  mutations: {
    SET_USER(state, payload) {
      state.user = { ...payload };
    },
    SET_IS_LOGIN(state, payload) {
      state.isLogin = payload;
    },
    SET_IS_LOGIN_ERROR(state, payload) {
      state.isLoginError = payload;
    },
  },
  actions: {
    userConfirm({ commit }, user) {
      api.loginUser(user).then((res) => {
        if (res.data.message === "success") {
          const acToken = res.data["access-token"];
          const refToken = res.data["refresh-token"];
          commit("SET_IS_LOGIN", true);
          commit("SET_IS_LOGIN_ERROR", false);
          sessionStorage.setItem("access-token", acToken);
          sessionStorage.setItem("refresh-token", refToken);
        } else {
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_LOGIN_ERROR", true);
        }
      });
    },
    refresh({ commit }, user) {
      api
        .refreshToken(user)
        .then((res) => {
          if (res.data.message === "success") {
            const acToken = res.data["access-token"];
            sessionStorage.setItem("access-token", acToken);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            console.log("갱신 실패");
            commit("SET_IS_LOGIN", false);
            commit("SET_IS_LOGIN_ERROR", false);
            router.push("/login");
          }
        });
    },
    userLogout({ commit }, userId) {
      api.logoutUser(userId).then((res) => {
        if (res.data.message === "success") {
          commit("SET_IS_LOGIN", false);
          commit("SET_USER", {});
        } else {
          console.log("리프레시 토큰 제거 실패");
        }
      });
    },
  },
};

export default auth;
