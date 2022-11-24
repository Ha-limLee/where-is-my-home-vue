import { board as boardApi } from "@/api";

export default {
    namespaced: true,
    state: {
        articleType: [],
    },
    mutations: {
        SET_ARTICLE_TYPE(state, payload) {
            state.articleType = [...payload];
        }
    },
    actions: {
        setArticleType({ commit }) {
            boardApi.getArticleType()
                .then(res => {
                    commit("SET_ARTICLE_TYPE", res.data);
                })
        }
    }
};