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
                        v-on:click="goToRequestPage"
                        href="#"
                    >Requests</b-nav-item>

                    <b-nav-item
                        v-if="isEmployee"
                        v-on:click="goToEmployeePage"
                        href="#"
                    >Assign Requests</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto">
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
export default {
    name: "App",
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
    },
    methods: {
        signOut() {
            store.commit("setLoggedIn", false);
            store.commit("setUser", {});
            sessionStorage.clear();
            this.$router.push("/login");
        },
        goToEmployeePage() {
            this.$router.push("/requests/assign");
        },
        goToRequestPage() {
            this.$router.push("/requests");
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
</style>