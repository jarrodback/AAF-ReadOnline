import axios from "axios";
import Vue from "vue";
import VueFlashMessage from "vue-flash-message";
import "vue-flash-message/dist/vue-flash-message.min.css";

Vue.use(VueFlashMessage, {
    messageOptions: {
        timeout: 3000,
        pauseOnInteract: true,
    },
});

const BASE_REQUESTS_URL = "http://localhost:3050/readonline/requests/";
const BASE_USERS_URL = "http://localhost:3050/usermanagement/users/";
const BASE_AUTH_URL = "http://localhost:3050/auth/login/";

const vm = new Vue();
const handleError =
    (fn) =>
    (...params) =>
        fn(...params).catch((error) => {
            vm.flash(
                `${error.response.status}: ${error.response.statusText}`,
                "error"
            );
        });

export const api = {
    login: handleError(async (payload) => {
        const res = await axios.post(BASE_AUTH_URL, payload);
        return res.data;
    }),

    getRequest: handleError(async (id) => {
        const res = await axios.get(BASE_REQUESTS_URL + id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    }),

    getRequests: handleError(async () => {
        const res = await axios.get(BASE_REQUESTS_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    }),
    deleteRequest: handleError((id) => {
        const res = axios.delete(BASE_REQUESTS_URL + id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res;
    }),
    createRequest: handleError(async (payload) => {
        const res = await axios.post(BASE_REQUESTS_URL, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    }),
    updateRequest: handleError(async (payload) => {
        const res = await axios.put(BASE_REQUESTS_URL + payload._id, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    }),

    getUser: handleError(async (id) => {
        const res = await axios.get(BASE_USERS_URL + id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    }),

    getUsers: handleError(async () => {
        const res = await axios.get(BASE_USERS_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    }),
    deleteUser: handleError((id) => {
        const res = axios.delete(BASE_USERS_URL + id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res;
    }),
    createUser: handleError(async (payload) => {
        const res = await axios.post(BASE_USERS_URL, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    }),
    updateUser: handleError(async (payload) => {
        const res = await axios.put(BASE_USERS_URL + payload._id, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    }),
};
