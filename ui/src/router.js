import Vue from "vue";
import Router from "vue-router";
import { isAuthenticated, isAdmin, isLoggedOut } from "./middleware/auth";
import ListRequest from "./views/Requests/ListRequests.vue";
import Login from "./views/Auth/Login.vue";
import Register from "./views/Auth/Register.vue";
import NotFound from "./views/Error/NotFound.vue";
import Forbidden from "./views/Error/Forbidden.vue";
import AssignRequests from "./views/Employee/AssignRequests.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    linkActiveClass: "active",
    routes: [
        {
            path: "/login",
            name: "login-user",
            component: Login,
            beforeEnter: isLoggedOut,
        },
        {
            path: "/register",
            name: "register-user",
            component: Register,
            beforeEnter: isLoggedOut,
        },
        {
            path: "/requests/",
            name: "requests",
            component: ListRequest,
            beforeEnter: isAuthenticated,
        },
        {
            path: "/requests/assign/",
            name: "assign",
            component: AssignRequests,
            beforeEnter: isAdmin,
        },
        {
            path: "/forbidden",
            component: Forbidden,
        },
        {
            path: "/*",
            component: NotFound,
        },
    ],
});
