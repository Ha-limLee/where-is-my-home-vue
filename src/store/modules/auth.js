import { auth as api } from "@/api/index";
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
      role: "",
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
    async userLogin({ commit }, user) {
      try {
        const res = await api.loginUser(user);
        const accessToken = res.headers["access-token"];
        const refreshToken = res.headers["refresh-token"];
        /**
         * @type { {exp: number, id: string, role: string, sub: string, username: string} }
         */
        const decoded = jwt_decode(accessToken);
        commit("SET_IS_LOGIN", true);
        commit("SET_IS_LOGIN_ERROR", false);
        commit("SET_USER", {
          userId: decoded.id,
          userName: decoded.username,
          role: decoded.role,
        });
        sessionStorage.setItem("access-token", accessToken);
        sessionStorage.setItem("refresh-token", refreshToken);
        return true;
      } catch (e) {
        alert("아이디 또는 비밀번호가 다릅니다");
        commit("SET_IS_LOGIN", false);
        commit("SET_IS_LOGIN_ERROR", true);
        throw e;
      }
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
    async userLogout({ commit }, userId) {
      const { data } = await api.logoutUser(userId);

      commit("SET_IS_LOGIN", false);
      commit("SET_USER", {});
      sessionStorage.removeItem("access-token");
      sessionStorage.removeItem("refresh-token");

      if (data.message === "success")
        return true;
      console.log("리프레시 토큰 제거 실패");
      return false;
    },
    async userResign({ dispatch }, userId) {
      try {
        await dispatch("userLogout", userId);
        const res = await api.resignUser(userId);
        alert("회원탈퇴 완료");
        return res;
      } catch (e) {
        alert("회원탈퇴 실패");
        throw e;
      }
    }
  },
};

export default auth;
