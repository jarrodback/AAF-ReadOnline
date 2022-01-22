<template>
    <div>
        <div>
            <h1>Authorise Requests</h1>
        </div>
        <div class="center">
            <p v-if="!areRequests">No requests need authorising.</p>
            <b-table
                v-else
                striped
                :items="requestItems"
                :fields="fields"
            >
                <template #cell(actions)="data">
                    <b-link @click="accept(data.item)">Authorise</b-link>
                    <b-link @click="decline(data.item)">Decline</b-link>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";

/**
 * Component to show the requests to be authorised.
 */
export default {
    name: "authorise-requests",

    /**
     * On mount, get all requests.
     */
    async mounted() {
        this.getRequests();
    },

    data() {
        return {
            // The requests to show.
            requests: [],
        };
    },

    computed: {
        /**
         * The fields to show on the table.
         *
         * @returns {[String]} The table headers to show.
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
         * The data to show on the table.
         *
         * @returns {[Object]} The table data to show.
         */
        requestItems: function () {
            return this.$data.requests;
        },

        /**
         * Check if there are requests to show.
         *
         * @returns {Boolean} True if there are requests to show.
         */
        areRequests() {
            return this.$data.requests && this.$data.requests.length > 0;
        },
    },

    methods: {
        /**
         * Truncate the date to remove time and timezone.
         *
         * @returns {Date} The truncated data.
         */
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },

        /**
         * Send a request to retrieve all Requests.
         */
        async getRequests() {
            // The query to filter the results with.
            const query = "?status=Needs Authorisation";

            api.getRequests(query)
                .then((results) => {
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
                    // No requests found.
                });
        },

        /**
         * Show the modal to decline the request.
         *
         * @param {Object} request The request to decline.
         */
        decline(request) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to decline this request? The request's total cost is £" +
                        request.cost,
                    {
                        title: "Decline request",
                        okVariant: "danger",
                        okTitle: "Decline",
                        cancelTitle: "Cancel",
                        hideHeaderClose: true,
                    }
                )
                .then((value) => {
                    if (value) {
                        this.declineRequest(request);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        /**
         * Create payload to update request to declined.
         *
         * @param {Object} request The request to decline.
         */
        declineRequest(request) {
            const payload = {
                _id: request._id,
                status: "Declined",
            };

            notify(this, "Succesfully declined the request.", "darkenSuccess");
            this.updateRequest(payload);
        },

        /**
         * Show the modal to approve the request.
         *
         * @param {Object} request The request to approve.
         */
        accept(request) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to approve this request? The request's total cost is £" +
                        request.cost,
                    {
                        title: "Approve request",
                        okVariant: "success",
                        okTitle: "Approve",
                        cancelTitle: "No",
                        hideHeaderClose: true,
                    }
                )
                .then((value) => {
                    if (value) {
                        this.acceptRequest(request);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        /**
         * Create payload to update the request to approved.
         *
         * @param {Object} request The request to approve.
         */
        acceptRequest(request) {
            const payload = {
                _id: request._id,
                status: "Approved",
            };

            notify(this, "Succesfully approved the request.", "darkenSuccess");
            this.updateRequest(payload);
        },

        /**
         * Send a request to update the Request.
         *
         * @param {Object} payload The updated information to send.
         */
        updateRequest(payload) {
            api.updateRequest(payload)
                .then(() => {
                    this.getRequests();
                })
                .catch(() => {
                    notify(
                        this,
                        "An error occurred while updating the request. Try again.",
                        "error"
                    );
                });
        },
    },
};
</script>

<style></style>;
