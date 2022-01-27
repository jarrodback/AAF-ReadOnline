<template>
    <div>
        <div>
            <h1>User Management</h1>
        </div>
        <div class="center">
            <div class="search">
                <b-button
                    class="createbutton"
                    v-on:click="openCreateUserModal"
                    variant="success"
                >Create</b-button>

                <b-form-input
                    v-if="areUsers"
                    size="sm"
                    class="mr-sm-2 input"
                    placeholder="Search for a user"
                    v-model="searchQuery"
                ></b-form-input>
            </div>

            <p v-if="!areUsers">No users to show.</p>
            <b-table
                v-else
                striped
                :items="filteredUsers"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                responsive="sm"
            >
                <template #cell(actions)="data">
                    <b-button-group>
                        <b-button
                            variant="info"
                            @click="edit(data.item)"
                        >Edit</b-button>
                        <b-button
                            variant="danger"
                            @click="deleteUser(data.item)"
                        >Delete</b-button>
                    </b-button-group>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
import { api, filterUserList, notify } from "../../helpers/helpers.js";

/**
 * Component to show Employees the list of users that need assigning.
 */
export default {
    name: "user-management",

    /**
     * When component is mounted, get all users.
     */
    async mounted() {
        this.getUsers();
    },

    data() {
        return {
            // Store users from API.
            users: [],

            // Store the user's query.
            searchQuery: "",

            // Default field to sort by.
            sortBy: "role",

            // Sort by descending by default.
            sortDesc: false,
        };
    },

    computed: {
        /**
         * Fields to show in the user table.
         */
        fields: function () {
            return [
                "username",
                "email",
                { key: "role", sortable: true },
                { key: "dateCreated", sortable: true },
                "Actions",
            ];
        },

        /**
         * If there are users, show the table.
         */
        areUsers() {
            return this.$data.users && this.$data.users.length > 0;
        },

        /**
         * Filter the list of users using the users search.
         */
        filteredUsers: function () {
            return filterUserList(this.searchQuery, this.users);
        },
    },

    methods: {
        /**
         * Truncate date to remove time and timezone.
         */
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },

        /**
         * Send a user to the API to retrieve all users that meet query param conditions.
         */
        async getUsers() {
            api.getUsers()
                .then((results) => {
                    // If successful, truncate the results and save them.
                    this.users = results;
                    if (this.users.length > 0) {
                        // Truncate the dates.
                        for (var x = 0; x < this.users.length; x++) {
                            this.users[x].dateCreated = this.dateTruncated(
                                this.users[x].dateCreated
                            );
                        }
                    }
                })
                .catch(() => {
                    // No users to show.
                    this.users = [];
                });
        },

        /**
         * Show modal to confirm if user should be deleted.
         *
         * @param {Object} user The user to check.
         */
        deleteUser(user) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to delete the user " +
                        user.username +
                        "?",
                    {
                        title: "Delete user",
                        okVariant: "danger",
                        okTitle: "Yes",
                        cancelTitle: "No",
                        hideHeaderClose: true,
                    }
                )
                .then((value) => {
                    if (value) {
                        this.sendDeleteUser(user._id);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        /**
         * Send a request to delete the User.
         *
         * @param {String} id The user id to delete.
         */
        sendDeleteUser(id) {
            api.deleteUser(id)
                .then(() => {
                    notify(
                        this,
                        "Successfully deleted the user.",
                        "darkenSuccess"
                    );

                    this.getUsers();
                })
                .catch(() => {
                    notify(
                        this,
                        "Failed to delete the user. Refresh and try again.",
                        "error"
                    );
                });
        },

        /**
         * Trigger an event to open the edit user modal
         *
         * @param {Object} user The user to edit.
         */
        edit(user) {
            this.$emit("editUser", user);
        },

        /**
         * Show the modal to create the request.
         */
        openCreateUserModal() {
            this.$emit("createUser");
        },
    },
};
</script>