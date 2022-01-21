import axios from "axios";
// import Vue from "vue";
// import VueFlashMessage from "vue-flash-message";
// import "vue-flash-message/dist/vue-flash-message.min.css";

// Vue.use(VueFlashMessage, {
//     messageOptions: {
//         timeout: 3000,
//         pauseOnInteract: true,
//     },
// });

const BASE_REQUESTS_URL = "http://localhost:3050/readonline/requests/";
const BASE_USERS_URL = "http://localhost:3050/usermanagement/users/";
const BASE_AUTH_URL = "http://localhost:3050/auth/";
const BASE_NOTIFY_URL = "http://localhost:3050/notify/notifications/";

// const vm = new Vue();
const handleError =
    (fn) =>
    (...params) =>
        fn(...params).catch(() => {
            // vm.flash(
            //     `${error.response.status}: ${error.response.statusText}`,
            //     "error"
            // );
        });

export const api = {
    login: async (payload) => {
        return axios.post(BASE_AUTH_URL + "login", payload, {
            withCredentials: true,
        });
    },

    register: handleError(async (payload) => {
        const res = await axios.post(BASE_AUTH_URL + "register", payload, {
            withCredentials: true,
        });
        return res.data;
    }),

    getRequest: handleError(async (id) => {
        const res = await axios.get(BASE_REQUESTS_URL + id, {
            withCredentials: true,
        });
        return res.data;
    }),

    getRequests: handleError(async (query) => {
        var condition = "";
        if (query) {
            condition = query;
        }
        const res = await axios.get(BASE_REQUESTS_URL + condition, {
            withCredentials: true,
        });
        return res.data;
    }),

    getRequestsForUser: handleError(async (id) => {
        const res = await axios.get(BASE_REQUESTS_URL + "user/" + id, {
            withCredentials: true,
        });
        return res.data;
    }),

    deleteRequest: handleError((id) => {
        const res = axios.delete(BASE_REQUESTS_URL + id, {
            withCredentials: true,
        });
        return res;
    }),
    createRequest: handleError(async (payload) => {
        const res = await axios.post(BASE_REQUESTS_URL, payload, {
            withCredentials: true,
        });
        return res.data;
    }),
    updateRequest: handleError(async (payload) => {
        const res = await axios.put(BASE_REQUESTS_URL + payload._id, payload, {
            withCredentials: true,
        });
        return res.data;
    }),

    getUser: handleError(async (id) => {
        const res = await axios.get(BASE_USERS_URL + id, {
            withCredentials: true,
        });
        return res.data;
    }),

    getUsers: handleError(async () => {
        const res = await axios.get(BASE_USERS_URL, {
            withCredentials: true,
        });
        return res.data;
    }),
    deleteUser: handleError((id) => {
        const res = axios.delete(BASE_USERS_URL + id, {
            withCredentials: true,
        });
        return res;
    }),
    createUser: handleError(async (payload) => {
        const res = await axios.post(BASE_USERS_URL, payload, {
            withCredentials: true,
        });
        return res.data;
    }),
    updateUser: handleError(async (payload) => {
        const res = await axios.put(BASE_USERS_URL + payload._id, payload, {
            withCredentials: true,
        });
        return res.data;
    }),
    createNotification: handleError(async (payload) => {
        const res = await axios.post(BASE_NOTIFY_URL, payload, {
            withCredentials: true,
        });
        return res.data;
    }),
    getNotifications: handleError(async (query) => {
        var condition = "";
        if (query) {
            condition = query;
        }
        const res = await axios.get(BASE_NOTIFY_URL + condition, {
            withCredentials: true,
        });
        return res.data;
    }),
    deleteNotification: handleError((id) => {
        const res = axios.delete(BASE_NOTIFY_URL + id, {
            withCredentials: true,
        });
        return res;
    }),
};
