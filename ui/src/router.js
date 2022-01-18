import Vue from "vue";
import Router from "vue-router";

import Main from "./components/Main.vue";
import NewRequest from "./views/Requests/NewRequest.vue";
import ListRequest from "./views/Requests/ListRequests.vue";
import EditRequest from "./views/Requests/EditRequests.vue";

import NewUser from "./views/Users/NewUser.vue";
import ListUser from "./views/Users/ListUsers.vue";
import Login from "./views/Auth/Login.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    linkActiveClass: "active",
    routes: [
        {
            path: "/",
            component: Main,
        },
        {
            path: "/requests/",
            name: "requests",
            component: ListRequest,
        },
        {
            path: "/requests/new/",
            name: "new-request",
            component: NewRequest,
        },
        {
            path: "/requests/edit/",
            name: "edit-request",
            component: EditRequest,
            props: true,
        },
        {
            path: "/users/",
            name: "users",
            component: ListUser,
        },
        {
            path: "/users/new",
            name: "new-user",
            component: NewUser,
        },
        {
            path: "/users/signin",
            name: "login-user",
            component: Login,
        },
    ],
});
