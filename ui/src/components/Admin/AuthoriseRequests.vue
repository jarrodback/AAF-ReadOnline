<template>
    <div>
        <div>
            <h1>Authorise Requests</h1>
        </div>
        <div class="center">

            <b-form-input
                v-if="areRequests"
                size="sm"
                class="mr-sm-2 input"
                placeholder="Search for requests"
                v-model="searchQuery"
            ></b-form-input>

            <p v-if="!areRequests">No requests need authorising.</p>
            <b-table
                v-else
                striped
                :items="filteredRequests"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                responsive="sm"
            >
                <template #cell(actions)="data">
                    <b-button-group>
                        <b-button
                            variant="success"
                            @click="accept(data.item)"
                        >Authorise</b-button>
                        <b-button
                            variant="danger"
                            @click="decline(data.item)"
                        >Decline</b-button>
                    </b-button-group>
                </template>

                <template #cell(Details)="data">
                    <b-form-checkbox
                        v-model="data.detailsShowing"
                        @change="data.toggleDetails"
                    >
                        View History
                    </b-form-checkbox>
                </template>

                <template #row-details="data">
                    <b-card>
                        <b-row class="mb-2">
                            <b-col
                                sm="3"
                                class="text-sm-right"
                            ><b>Reviewer:</b>
                            </b-col>
                            <b-col v-if="isReviewer(data.item)">{{ data.item.reviewingUser }}</b-col>
                            <b-col v-else> N/A </b-col>
                        </b-row>

                        <b-row class="mb-2">
                            <b-col
                                sm="3"
                                class="text-sm-right"
                            ><b>History:</b></b-col>

                            <b-col>
                                <div
                                    v-for="(history, hist) in data.item.history"
                                    :key="hist"
                                >
                                    [ <b>{{timeTruncated(new Date(history.time))}}</b>]: {{history.modifyingUser}} set the request to {{history.status}}
                                    <br>
                                    <div v-if="history.comments"><b>Appended comments:</b> {{history.comments}}</div>
                                </div>
                            </b-col>
                        </b-row>
                    </b-card>
                </template>

            </b-table>
        </div>
    </div>
</template>

<script>
import { api, notify, filterList } from "../../helpers/helpers.js";
import { store } from "../../store";

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

            // Store the user's query.
            searchQuery: "",

            // Default field to sort by.
            sortBy: "dateCreated",

            // Sort by descending by default.
            sortDesc: false,
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
                { key: "status", sortable: true },
                { key: "dateCreated", sortable: true },
                "requestingUser",
                "Actions",
                "Details",
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

        /**
         * Filter the list of requests using the users search.
         */
        filteredRequests: function () {
            return filterList(this.searchQuery, this.requests);
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
                    this.requests = [];
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
                history: request.history,
            };
            payload.history.push({
                time: Date.now(),
                status: "Declined",
                modifyingUser: store.getters.user.username,
            });

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
                history: request.history,
            };
            payload.history.push({
                time: Date.now(),
                status: "Approved",
                modifyingUser: store.getters.user.username,
            });

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
                .catch((error) => {
                    console.error(error);
                });
        },

        /**
         * Check if there is a reviewer for the request.
         *
         * @param {Object} request The request to check.
         * @returns {Boolean} True if there are requests.
         */
        isReviewer(request) {
            return request.reviewingUser;
        },

        /**
         * Truncate time to remove time.
         *
         * @returns {Date} The truncated date.
         */
        timeTruncated: function (date) {
            return date.toString().split("G")[0];
        },
    },
};
</script>

<style></style>;
