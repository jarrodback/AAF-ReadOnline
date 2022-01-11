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
        console.log("Window work?", BASE_REQUESTS_URL);
        const res = await axios.get(BASE_REQUESTS_URL + id);
        return res.data;
    }),
    getrequests: handleError(async () => {
        const res = await axios.get(BASE_REQUESTS_URL);
        console.log("received data: " + JSON.stringify(res.data));
        return res.data;
    }),
    // deletepet: handleError(async id => {
    //     const res = await axios.delete(baseURL + id);
    //     return res.data;
    // }),
    createrequest: handleError(async (payload) => {
        console.log("creating requesat..");
        const res = await axios.post(BASE_REQUESTS_URL, payload);
        console.log("got request");
        return res.data;
    }),
    // updatepet: handleError(async payload => {
    //     const res = await axios.put(baseURL + payload._id, payload);
    //     return res.data;
    // })
};
