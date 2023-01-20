import { axiosService } from "./instance";

export default {
    getNews(keyword) {
        return axiosService.get(`/naver/news/${keyword}`);
    }
};