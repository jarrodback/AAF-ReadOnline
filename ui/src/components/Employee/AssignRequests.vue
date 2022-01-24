<template>
    <div>
        <div>
            <h1>Assign Requests</h1>
        </div>
        <div class="center">

            <b-form-input
                v-if="areRequests"
                size="sm"
                class="mr-sm-2 input"
                placeholder="Search for requests"
                v-model="searchQuery"
            ></b-form-input>

            <p v-if="!areRequests">No requests need allocating.</p>
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
                    <b-button
                        variant="info"
                        @click="assign(data.item)"
                    >Assign</b-button>
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
         * Fields to show in the Assign Request table.
         */
        fields: function () {
            return [
                "name",
                "author",
                "cost",
                "type",
                "status",
                { key: "status", sortable: true },
                { key: "dateCreated", sortable: true },
                "Actions",
                "Details",
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

        /**
         * Filter the list of requests using the users search.
         */
        filteredRequests: function () {
            return filterList(this.searchQuery, this.requests);
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
                    // No requests to show.
                    this.requests = [];
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
                        this.assignRequest(request);
                    }
                })
                .catch(() => {
                    // Ignore 404.
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
                history: request.history,
            };
            payload.history.push({
                time: Date.now(),
                status: "Assigned",
                modifyingUser: store.getters.user.username,
            });

            api.updateRequest(payload)
                .then(() => {
                    notify(
                        this,
                        "Successfully assigned request.",
                        "darkenSuccess"
                    );
                    this.getRequests();
                })
                .catch((error) => {
                    console.log("Failed to update request: ", error);
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
