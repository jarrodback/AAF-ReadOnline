import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export const store = new Vuex.Store({
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
        }),
    ],
    state: {
        loggedIn: false,
        user: {
            id: null,
            username: null,
            role: "",
        },
    },
    mutations: {
        setLoggedIn(state, payload) {
            state.loggedIn = payload;
        },
        setUser(state, payload) {
            state.user = payload;
        },
        setId(state, payload) {
            state.user.id = payload;
        },
        setUsername(state, payload) {
            state.user.username = payload;
        },
        setRole(state, payload) {
            state.user.role = payload;
        },
    },

    getters: {
        user: (state) => {
            return state.user;
        },
    },
});
