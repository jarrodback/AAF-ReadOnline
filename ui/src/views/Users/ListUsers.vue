<template>
    <div>
        <h1>Users</h1>
        <button
            class="button-blue"
            v-on:click="createUser"
        >Create User</button>
        <table
            id="users"
            class="ui celled compact table"
        >
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Date Created</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tr
                v-for="(user, i) in users"
                :key="i"
            >
                <td>{{user.username}}</td>
                <td>{{user.email}}</td>
                <td>{{dateTruncated(user.dateCreated)}}</td>
                <td>{{user.role}}</td>
                <td><button
                        class="button-green"
                        v-on:click="edit(user)"
                    >Edit</button></td>
                <td><button
                        class="button-red"
                        v-on:click="deleteUser(user._id)"
                    >Delete User</button></td>
            </tr>
        </table>
    </div>
</template>

<script>
import { api } from "../../helpers/helpers.js";
export default {
    name: "users",
    computed: {},

    data() {
        return {
            users: [],
        };
    },

    async mounted() {
        this.users = this.getAllUsers();
    },

    methods: {
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },
        edit: function (request) {
            this.$router.push({
                name: `edit-user`,
                params: { request: request },
            });
        },
        createUser() {
            this.$router.push({ name: `new-user` });
        },
        deleteUser(id) {
            const result = api.deleteUser(id);
            result
                .then(() => {
                    this.getAllUsers();
                })
                .catch((err) => {
                    console.error("Unable to retrieve users: ", err);
                });
        },
        async getAllUsers() {
            this.users = [];
            this.users = await api.getUsers();
        },
    },
};
</script>
