import { store } from "../store";
export const isAuthenticated = (to, from, next) => {
    if (store.state.loggedIn) {
        next();
    } else {
        next({ path: "/login" });
    }
};

export const isAdmin = (to, from, next) => {
    if (store.getters.user.role == "Admin") {
        next();
    } else {
        next({ path: "/forbidden" });
    }
};

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

export const isUser = (to, from, next) => {
    isAuthenticated(to, from, next);
    if (store.getters.user.role == "User") {
        next();
    } else {
        next({ path: "/forbidden" });
    }
};

export const isLoggedOut = (to, from, next) => {
    if (store.state.loggedIn) {
        next({ path: "/requests" });
    } else {
        next();
    }
};
