import { store } from "../store";

/**
 * Check if the user transitioning the route is logged in.
 */
export const isAuthenticated = (to, from, next) => {
    if (store.state.loggedIn) {
        next();
    } else {
        next({ path: "/login" });
    }
};

/**
 * Check if the user transitioning the route is an admin.
 */
export const isAdmin = (to, from, next) => {
    if (store.getters.user.role == "Admin") {
        next();
    } else {
        next({ path: "/forbidden" });
    }
};

/**
 * Check if the user transitioning the route is an admin.
 */
export const isAuthorised = (to, from, next) => {
    if (
        store.getters.user.role == "Admin" ||
        (store.getters.user.rights.length > 0 &&
            store.getters.user.rights.includes("authorise"))
    ) {
        next();
    } else {
        next({ path: "/forbidden" });
    }
};

/**
 * Check if the user transitioning the route is an employee.
 */
export const isEmployee = (to, from, next) => {
    if (
        store.getters.user.role == "Admin" ||
        store.getters.user.role == "Employee"
    ) {
        next();
    } else {
        next({ path: "/forbidden" });
    }
};

/**
 * Check if the user transitioning the route is a user.
 */
export const isUser = (to, from, next) => {
    isAuthenticated(to, from, next);
    if (store.getters.user.role == "User") {
        next();
    } else {
        next({ path: "/forbidden" });
    }
};

/**
 * Check if the user transitioning the route is logged in.
 */
export const isLoggedOut = (to, from, next) => {
    if (store.state.loggedIn) {
        next({ path: "/requests" });
    } else {
        next();
    }
};
