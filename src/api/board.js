import axios from 'axios';

const axiosService = axios.create();

export default {
    getArticleType() {
        return axiosService.get("board/article/type");
    },
    /**
     * @param {"question" | "notice" | "normal" | ""} type 
     */
    getArticle(type) {
        return axiosService.get(`board?type=${type}`);
    },
    /**
     * @param { {userId: string, subject: string, content: string} } form 
     */
    writeArticle(form) {
        return axiosService.post("board", form);
    }
};