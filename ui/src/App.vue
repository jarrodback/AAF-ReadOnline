<template>
    <div id="app">
        <b-navbar
            class="header"
            type="dark"
            variant="dark"
        >
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse
                id="nav-collapse"
                is-nav
            >
                <b-nav-text>Readbooks Online</b-nav-text>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item
                        v-if="getLoggedIn"
                        v-on:click="goToRequestPage"
                        href="#"
                    >Requests</b-nav-item>

                    <b-nav-item
                        v-if="isEmployee"
                        v-on:click="goToEmployeePage"
                        href="#"
                    >Assign Requests</b-nav-item>

                    <b-nav-item
                        v-if="isAdmin"
                        v-on:click="goToAdminPage"
                        href="#"
                    >Authorise</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown v-if="getLoggedIn">
                        <template #button-content>
                            <b-icon
                                icon="bell-fill"
                                aria-label="Notifications"
                            ></b-icon>
                        </template>
                        <p v-if="!areNotifications">No notifcations to show</p>
                        <div
                            v-else
                            v-for="notification in notifications"
                            :key="notification[x]"
                        >
                            <div class="center">
                                <p>
                                    {{notification.message}}
                                    <b-icon
                                        class="pointer"
                                        icon="x"
                                        v-on:click="clear(notification._id)"
                                        aria-label="Clear Notification"
                                    ></b-icon>
                                </p>
                                <b-dropdown-divider></b-dropdown-divider>
                            </div>
                        </div>
                    </b-nav-item-dropdown>
                    <b-nav-item-dropdown
                        right
                        v-if="getLoggedIn"
                    >
                        <template #button-content>
                            <em>{{getUserName}} ({{getUserRole}})</em>
                        </template>
                        <b-dropdown-item v-on:click="signOut">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div>
            <div class="column">
                <router-view />
            </div>
        </div>
    </div>
</template>
 
<script>
import { store } from "./store";
import { api } from "./helpers/helpers.js";

export default {
    name: "App",

    async mounted() {
        if (this.getLoggedIn) {
            this.getAllNotifications();
        }
    },
    data() {
        return {
            notifications: [],
        };
    },
    computed: {
        getUserName() {
            return store.state.user.username;
        },
        getLoggedIn() {
            return store.state.loggedIn;
        },
        getUserRole() {
            return store.state.user.role;
        },
        isAdmin() {
            return this.getUserRole == "Admin";
        },
        isEmployee() {
            return (
                this.getUserRole == "Employee" || this.getUserRole == "Admin"
            );
        },
        isUser() {
            return this.getUserRole == "User";
        },
        areNotifications() {
            return this.notifications;
        },
    },
    methods: {
        signOut() {
            store.commit("setLoggedIn", false);
            store.commit("setUser", {});
            sessionStorage.clear();
            this.$router.push("/login").catch(() => {});
        },
        goToAdminPage() {
            this.$router.push("/requests/authorise").catch(() => {});
        },
        goToEmployeePage() {
            this.$router.push("/requests/assign").catch(() => {});
        },
        goToRequestPage() {
            this.$router.push("/requests").catch(() => {});
        },
        getAllNotifications() {
            const query = "?username=" + store.getters.user.username;
            api.getNotifications(query)
                .then((result) => {
                    this.notifications = result;
                })
                .catch((err) => {
                    console.error("Unable to get notifications: ", err);
                });
        },
        clear(id) {
            api.deleteNotification(id)
                .then(() => {
                    this.getAllNotifications();
                })
                .catch((err) => {
                    console.error("Unable to get notifications: ", err);
                });
        },
    },
};
</script>
 
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* margin-top: 60px; */
}
.header {
    margin-bottom: 15px;
}
.pointer {
    cursor: pointer;
}
</style>