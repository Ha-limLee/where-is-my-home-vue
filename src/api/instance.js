import axios from 'axios';
import router from '@/router';

const axiosService = axios.create({ baseURL: "http://localhost:3000" });

axiosService.interceptors.request.use(
    function (config) {
        config.headers["access-token"] = sessionStorage.getItem("access-token");
        config.headers["refresh-token"] = sessionStorage.getItem("refresh-token");
        return config;
    },
    function (error) {
        console.log(error);
        return Promise.reject(error);
    }
);

axiosService.interceptors.response.use(
    async function (res) {
        // UNAUTHORIZED
        // access-token 만료
        if (res.data.statusCodeValue === 401) {
            const instance = axios.create({ baseURL: "http://localhost:3000" });
            instance.defaults.headers["access-token"] = sessionStorage.getItem("access-token");
            instance.defaults.headers["refresh-token"] = sessionStorage.getItem("refresh-token");
            try {
                const result = await instance.get("users/token/refresh");
                const accessToken = result.headers["access-token"];
                sessionStorage.setItem("access-token", accessToken);
                router.go(); // refresh
            } catch (err) {
                alert("다시 로그인 해주세요");
                router.push("/login");
            }
        }
        return res;
    },
    function (err) {
        console.log(err);
        return Promise.reject(err);
    }
)

export {axiosService};