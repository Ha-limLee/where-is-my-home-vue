import { axiosService } from './instance';

/**
 * @typedef {Object} Article
 * @property {number} articleNo
 * @property {number} articlePropId
 * @property {string} articlePropName
 * @property {number} hit
 * @property {string} registerTime
 * @property {string} subject
 * @property {string} userId
 * @property {string} userRole
 */

/**
 * @typedef {Object} ArticleData
 * @property {Article[]} articleList
 * @property {number} maxPage
 * @property {number} maxSize
 * @property {string} page
 * @property {string} size
 */

/**
 * @typedef {import("axios").AxiosResponse<ArticleData>} ArticleResponse
 */

export default {
    getArticleType() {
        return axiosService.get("board/article/type");
    },
    /**
     * @param {"question" | "notice" | "normal" | ""} type 
     * @returns {Promise<ArticleResponse>}
     */
    getArticle(type, page) {
        return axiosService.get(`board?type=${type}&page=${page}`);
    },
    /**
     * @param {"question" | "notice" | "normal" | ""} type 
     * @returns {Promise<ArticleResponse>}
     */
    getArticleNotNotice(type, page) {
        return axiosService.get(`board/not-notice?type=${type}&page=${page}`);
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
        console.log(form);
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