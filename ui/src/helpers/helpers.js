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

const BASE_REQUESTS_URL = "http://localhost:3050/readonline/requests";

const vm = new Vue();
const handleError =
    (fn) =>
    (...params) =>
        fn(...params).catch((error) => {
            console.log("error caught");

            vm.flash(
                `${error.response.status}: ${error.response.statusText}`,
                "error"
            );
        });

export const api = {
    getrequest: handleError(async (id) => {
        const res = await axios.get(BASE_REQUESTS_URL + id);
        return res.data;
    }),
    getrequests: handleError(async () => {
        const res = await axios.get(BASE_REQUESTS_URL);
        return res.data;
    }),
    deletepet: handleError(async (id) => {
        const res = await axios.delete(BASE_REQUESTS_URL + id);
        return res.data;
    }),
    createrequest: handleError(async (payload) => {
        const res = await axios.post(BASE_REQUESTS_URL, payload);
        return res.data;
    }),
    updaterequest: handleError(async (payload) => {
        const res = await axios.put(BASE_REQUESTS_URL + payload._id, payload);
        return res.data;
    }),
};
