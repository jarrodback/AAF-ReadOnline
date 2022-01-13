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
    getRequest: handleError(async (id) => {
        const res = await axios.get(BASE_REQUESTS_URL + id);
        return res.data;
    }),

    getRequests: handleError(async () => {
        const res = await axios.get(BASE_REQUESTS_URL);
        return res.data;
    }),
    deleteRequest: handleError((id) => {
        const res = axios.delete(BASE_REQUESTS_URL + id);
        return res;
    }),
    createRequest: handleError(async (payload) => {
        // axios
        //     .post(BASE_REQUESTS_URL, payload)
        //     .then((data) => {
        //         return data;
        //     })
        //     .catch((err) => {
        //         console.error("Failed to create request: ", err.message);
        //     });

        const res = await axios.post(BASE_REQUESTS_URL, payload);
        return res.data;
    }),
    updateRequest: handleError(async (payload) => {
        const res = await axios.put(BASE_REQUESTS_URL + payload._id, payload);
        return res.data;
    }),

    getUser: handleError(async (id) => {
        const res = await axios.get(BASE_USERS_URL + id);
        return res.data;
    }),

    getUsers: handleError(async () => {
        const res = await axios.get(BASE_USERS_URL);
        return res.data;
    }),
    deleteUser: handleError((id) => {
        const res = axios.delete(BASE_USERS_URL + id);
        return res;
    }),
    createUser: handleError(async (payload) => {
        const res = await axios.post(BASE_USERS_URL, payload);
        return res.data;
    }),
    updateUser: handleError(async (payload) => {
        const res = await axios.put(BASE_USERS_URL + payload._id, payload);
        return res.data;
    }),
};
