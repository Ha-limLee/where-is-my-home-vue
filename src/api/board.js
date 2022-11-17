import axios from 'axios';

const axiosService = axios.create({ baseURL: "http://localhost:3000" });

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
    getArticleDetail(articleNo) {
        return axiosService.get(`board/${articleNo}`);
    },
    /**
     * @param { {userId: string, subject: string, content: string} } form 
     */
    writeArticle(form) {
        return axiosService.post("board", form);
    },
    editArticle(articleNo, form) {
        return axiosService.put(`board/${articleNo}`, form);
    },
    deleteArticle(articleNo) {
        return axiosService.delete(`board/${articleNo}`);
    },

    getComment(articleNo) {
        return axiosService.get(`comment/article/${articleNo}`);
    },
    writeComment(articleNo, form) {
        return axiosService.post(`comment/article/${articleNo}`, form);
    },
    editComment(commentId, form) {
        return axiosService.put(`comment/${commentId}`, form);
    },
    deleteComment(commentId) {
        return axiosService.delete(`comment/${commentId}`);
    }
};