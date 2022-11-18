import axios from "axios";
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
  refreshToken(userData) {
    return axiosService.post("users/refresh", userData);
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
};
