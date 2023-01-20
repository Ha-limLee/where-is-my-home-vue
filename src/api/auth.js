import { axiosService } from "./instance";

export default {
  joinUser(userData) {
    return axiosService.post("users/join", userData);
  },
  modifyUser(userData) {
    return axiosService.put("users/join", userData);
  },
  loginUser(userData) {
    return axiosService.post("users/login", userData);
  },
  logoutUser() {
    return axiosService.put(`users/logout`);
  },
  refreshToken() {
    return axiosService.get("users/token/refresh");
  },
  getUser() {
    return axiosService.get(`users/user/mypage`);
  },
  resignUser(userId) {
    return axiosService.delete(`users/${userId}`);
  },
  getUserList() {
    return axiosService.get("users/user-public");
  },
  checkPassword(password) {
    return axiosService.post("users/passwordCheck", password);
  }
};
