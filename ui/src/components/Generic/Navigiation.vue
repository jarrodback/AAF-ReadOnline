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

                    <b-nav-item-dropdown
                        v-if="isAuthorised"
                        id="admin-dropdown"
                        text="Admin"
                    >
                        <b-dropdown-item
                            v-if="isAuthorised"
                            v-on:click="goToAdminPage"
                            href="#"
                        >Authorise</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>

                        <b-dropdown-item
                            v-if="isAdmin"
                            v-on:click="goToManagePage"
                            href="#"
                        >Manage</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>

                        <b-dropdown-item
                            v-if="isAdmin"
                            v-on:click="goToUserManagementPage"
                            href="#"
                        >User Management</b-dropdown-item>
                    </b-nav-item-dropdown>

                </b-navbar-nav>

                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown v-if="getLoggedIn">
                        <template #button-content>
                            <b-icon
                                icon="bell-fill"
                                aria-label="Notifications"
                            >
                            </b-icon>
                            <b-badge
                                phill
                                v-if="areNotifications"
                                variant="danger"
                            >{{notifications.length}}</b-badge>
                        </template>

                        <p
                            style="padding:10px"
                            v-if="!areNotifications"
                        >No notifcations to show!</p>
                        <div
                            v-else
                            v-for="(notification, not) in notifications"
                            :key="not"
                        >
                            <b-badge variant="danger">NEW</b-badge>

                            <div class="notification-body">
                                <div class="notification-text">
                                    {{notification.message}}
                                </div>
                                <div class="icon h3">
                                    <b-icon
                                        id="notification-dismiss"
                                        class="pointer"
                                        icon="x"
                                        v-on:click="removeNotification(notification._id)"
                                        aria-label="Clear Notification"
                                    ></b-icon>
                                    <b-tooltip
                                        target="notification-dismiss"
                                        triggers="hover"
                                    >
                                        Dismiss notification
                                    </b-tooltip>

                                </div>

                            </div>

                            <b-dropdown-divider></b-dropdown-divider>

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
    </div>
</template>
 
<script>
import { store } from "../../store";
import { api } from "../../helpers/helpers.js";

/**
 * Component to show the navigation bar.
 */
export default {
    name: "navigation",

    /**
     * On mount, check if user is logged in and get all notifications.
     */
    async created() {
        if (this.getLoggedIn) {
            this.getAllNotifications();
        }
    },

    data() {
        return {
            // The list of notifications.
            notifications: [],
        };
    },

    watch: {
        /**
         * Get user notifications when they log in.
         */
        getLoggedIn: function () {
            if (this.getLoggedIn) {
                this.getAllNotifications();
            }
        },
    },

    computed: {
        /**
         * Get username from store.
         *
         * @returns {String} The username.
         */
        getUserName() {
            return store.getters.user.username;
        },

        /**
         * Get logged in state from store.
         *
         * @returns {Boolean} True if logged in.
         */
        getLoggedIn() {
            return store.getters.loggedIn;
        },

        /**
         * Get role from store.
         *
         * @returns {String} The role.
         */
        getUserRole() {
            return store.getters.user.role;
        },

        /**
         * Is user authorised?
         *
         * @returns {Boolean} True if authorised.
         */
        isAuthorised() {
            return (
                store.getters.user.role == "Admin" ||
                (store.getters.user.rights &&
                    store.getters.user.rights.includes("authorise"))
            );
        },

        /**
         * Check if user is an admin.
         *
         * @returns {Boolean} True if user is an admin.
         */
        isAdmin() {
            return this.getUserRole == "Admin";
        },

        /**
         * Check if user is an employee.
         *
         * @returns {Boolean} True if user is an employee.
         */
        isEmployee() {
            return (
                this.getUserRole == "Employee" || this.getUserRole == "Admin"
            );
        },

        /**
         * Check if user is a user.
         *
         * @returns {Boolean} True if user is a user.
         */
        isUser() {
            return this.getUserRole == "User";
        },

        /**
         * Check if there are notifications to view.
         *
         * @returns {Boolean} True if there are notifications to view.
         */
        areNotifications() {
            return this.notifications.length > 0;
        },
    },
    methods: {
        /**
         * Sign the user out.
         */
        signOut() {
            api.logout().then(() => {
                store.commit("setLoggedIn", false);
                store.commit("setUser", {});
                sessionStorage.clear();
                this.$router.push("/login").catch(() => {});
            });
        },

        /**
         * Navigate to the Authorise page.
         */
        goToAdminPage() {
            this.$router.push("/requests/authorise").catch(() => {});
        },

        /**
         * Navigate to the Assign page.
         */
        goToEmployeePage() {
            this.$router.push("/requests/assign").catch(() => {});
        },

        /**
         * Navigate to the My Requests page.
         */
        goToRequestPage() {
            this.$router.push("/requests").catch(() => {});
        },

        /**
         * Navigate to the Manage page.
         */
        goToManagePage() {
            this.$router.push("/manage").catch(() => {});
        },

        /**
         * Navigate to the User Management page.
         */
        goToUserManagementPage() {
            this.$router.push("/usermanagement").catch(() => {});
        },

        /**
         * Get all notifications for the user.
         */
        getAllNotifications() {
            const query = "?username=" + store.getters.user.id;
            api.getNotifications(query)
                .then((result) => {
                    this.notifications = result;
                })
                .catch(() => {
                    // No notifications to show.
                    this.notifications = [];
                });
        },

        /**
         * Clear and delete the selected notification.
         *
         * @param {String} id The id of the notifiation.
         */
        removeNotification(id) {
            api.deleteNotification(id)
                .then(() => {
                    this.getAllNotifications();
                })
                .catch((err) => {
                    console.error("Unable to delete notification: ", err);
                });
        },
    },
};
</script>
 
<style>
.header {
    margin-bottom: 15px;
}
.pointer {
    cursor: pointer;
}
</style>