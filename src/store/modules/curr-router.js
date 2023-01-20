export default {
    namespaced: true,
    state: {
        path: "",
    },
    mutations: {
        SET_PATH(state, payload) {
            state.path = payload;
        },
    },
};