import axios from "axios";

const axiosService = axios.create();

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
  getUser(userId) {
    return axiosService.get(`users/user/${userId}`);
  },
  resignUser(userId) {
    return axiosService.delete(`users/${userId}`);
  },
  getUserList() {
    return axiosService.get("users/user-public");
  },
};
