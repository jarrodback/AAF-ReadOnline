import Vue from "vue";
import Router from "vue-router";
import {
    isAuthenticated,
    isEmployee,
    isAdmin,
    isLoggedOut,
    isAuthorised,
} from "./middleware/auth";
import ListRequest from "./views/Requests/ListRequests.vue";
import Login from "./views/Auth/Login.vue";
import Register from "./views/Auth/Register.vue";
import NotFound from "./views/Error/NotFound.vue";
import Forbidden from "./views/Error/Forbidden.vue";
import AssignRequests from "./views/Employee/AssignRequests.vue";
import AuthoriseRequests from "./views/Employee/AuthoriseRequests.vue";
import Manage from "./views/Employee/Manage.vue";
import UserManagement from "./views/Employee/UserManagement.vue";
import LiveChat from "./views/LiveChat/LiveChat.vue";

// Pass the router into Vue to use.
Vue.use(Router);

/**
 * Define the router and the paths.
 */
export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    linkActiveClass: "active",
    routes: [
        // Redirect to login page, must not be logged in.
        {
            path: "/",
            name: "login-user",
            component: Login,
            beforeEnter: isLoggedOut,
        },
        // Path to login page, must not be logged in.
        {
            path: "/login",
            name: "login-user",
            component: Login,
            beforeEnter: isLoggedOut,
        },
        // Path to register page, must not be logged in.
        {
            path: "/register",
            name: "register-user",
            component: Register,
            beforeEnter: isLoggedOut,
        },
        // Path to view the requests. Must be authenticated.
        {
            path: "/requests/",
            name: "requests",
            component: ListRequest,
            beforeEnter: isAuthenticated,
        },
        // Path to view the requests to be assigned. Must be an employee.
        {
            path: "/requests/assign/",
            name: "assign",
            component: AssignRequests,
            beforeEnter: isEmployee,
        },
        // Path to view the requests to be authorised. Must be an admin.
        {
            path: "/requests/authorise/",
            name: "authorise",
            component: AuthoriseRequests,
            beforeEnter: isAuthorised,
        },
        // Path to manage readonline. Must be an admin.
        {
            path: "/manage/",
            name: "manage",
            component: Manage,
            beforeEnter: isAdmin,
        },
        // Path to view user management. Must be an admin.
        {
            path: "/usermanagement",
            name: "usermanagement",
            component: UserManagement,
            beforeEnter: isAdmin,
        },
        // Path to view user management. Must be an admin.
        {
            path: "/chat/",
            name: "chat",
            component: LiveChat,
            beforeEnter: isAuthenticated,
        },
        // If authentication fails, direct to Forbidden route.
        {
            path: "/forbidden",
            component: Forbidden,
        },
        // If a router not specified is entered, show not found page.
        {
            path: "/*",
            component: NotFound,
        },
    ],
});
