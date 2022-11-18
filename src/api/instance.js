import axios from 'axios';

const axiosService = axios.create({ baseURL: "http://localhost:3000" });

axiosService.interceptors.request.use(
    function (config) {
        config.headers["access-token"] = sessionStorage.getItem("access-token");
        config.headers["refresh-token"] = sessionStorage.getItem("refresh-token");
        return config;
    },
    function (error) {
        console.log(error);
        return Promise.refect(error);
    }
);

export {axiosService};