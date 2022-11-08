import axios from 'axios';

const axiosService = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});

// 회원가입
function joinUser(userData) {
    return axiosService.post('users/join', userData);
}

// 회원정보 수정
function modifyUser(userData) {
    return axiosService.put('users/join', userData);
}

// 로그인
function loginUser(userData) {
    return axiosService.post('users/login', userData);
}

function getUser(userId) {
    return axiosService.get(`users/user/${userId}`);
}

function resignUser(userId) {
    return axiosService.delete(`users/${userId}`);
}

export { joinUser, modifyUser, loginUser, getUser, resignUser };