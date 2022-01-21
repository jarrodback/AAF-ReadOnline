<template>
    <div>
        <div>
            <h1>Assign Requests</h1>
        </div>
        <div class="center">
            <p v-if="!areRequests">No requests need allocating.</p>
            <b-table
                v-else
                striped
                :items="requestItems"
                :fields="fields"
            >
                <template #cell(actions)="data">
                    <b-link @click="assign(data.item)">Assign</b-link>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";
import { store } from "../../store";

/**
 * Component to show Employees the list of requests that need assigning.
 */
export default {
    name: "assign-requests",

    /**
     * When component is mounted, get all requests.
     */
    async mounted() {
        this.getRequests();
    },

    data() {
        return {
            // Store requests from API.
            requests: [],
        };
    },

    computed: {
        /**
         * Fields to show in the Assign Request table.
         */
        fields: function () {
            return [
                "name",
                "author",
                "cost",
                "type",
                "status",
                "dateCreated",
                "requestingUser",
                "Actions",
            ];
        },

        /**
         * The items to show in the table.
         */
        requestItems: function () {
            return this.$data.requests;
        },

        /**
         * If there are requests, show the table.
         */
        areRequests() {
            return this.$data.requests && this.$data.requests.length > 0;
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
         * Send a request to the API to retrieve all requets that meet query param conditions.
         */
        async getRequests() {
            const query = "?status=Pending Review&reviewingUser=";
            api.getRequests(query)
                .then((results) => {
                    // If successful, truncate the results and save them.
                    this.requests = results;
                    if (this.requests.length > 0) {
                        // Truncate the dates.
                        for (var x = 0; x < this.requests.length; x++) {
                            this.requests[x].dateCreated = this.dateTruncated(
                                this.requests[x].dateCreated
                            );
                        }
                    }
                })
                .catch(() => {
                    notify(
                        this,
                        "Failed to talk retrieve requests from server.",
                        "error"
                    );
                });
        },

        /**
         * Show the Assign modal.
         *
         * @param {Object} request The request object.
         */
        assign(request) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to assign this request to yourself?",
                    {
                        title: "Assign request",
                        okVariant: "success",
                        okTitle: "Yes",
                        cancelTitle: "No",
                        hideHeaderClose: true,
                    }
                )
                .then((value) => {
                    if (value) {
                        this.assignRequest(request).then(() => {
                            notify(
                                this,
                                "Successfully assigned request.",
                                "darkenSuccess"
                            );
                        });
                    }
                })
                .catch(() => {
                    notify(
                        this,
                        "An error occurred while assigning the request. Try again.",
                        "error"
                    );
                });
        },

        /**
         * Send a request to the API to change the reviewer on the request.
         *
         * @param {Object} request The request object.
         */
        assignRequest(request) {
            const payload = {
                _id: request._id,
                reviewingUser: store.getters.user.username,
            };
            api.updateRequest(payload)
                .then(() => {
                    this.getRequests();
                })
                .catch((error) => {
                    console.log("Failed to update request: ", error);
                });
        },
    },
};
</script>

<style></style>;
