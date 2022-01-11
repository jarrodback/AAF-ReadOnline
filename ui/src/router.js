import Vue from "vue";
import Router from "vue-router";
import NewRequest from "./views/NewRequest.vue";
import ListRequest from "./views/ListRequests.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    linkActiveClass: "active",
    routes: [
        {
            path: "/",
            redirect: "/requests/new",
        },
        {
            path: "/requests/",
            name: "requests",
            component: ListRequest,
        },
        {
            path: "/requests/new",
            name: "new-request",
            component: NewRequest,
        },
    ],
});
