  <template>
    <div>
        <div>
            <h1>My Requests</h1>
        </div>
        <div>
            <div class="center search">
                <b-button
                    class="createbutton"
                    v-on:click="openCreateModal"
                    variant="success"
                >Create</b-button>

                <b-form-input
                    v-if="areRequests"
                    size="sm"
                    class="mr-sm-2 input"
                    placeholder="Search for requests"
                    v-model="searchQuery"
                ></b-form-input>

                <b-form-checkbox
                    class="input"
                    id="view-completed"
                    v-model="viewCompleted"
                    name="checkbox-completed"
                >
                    View Completed Requests
                </b-form-checkbox>

            </div>
            <p
                class=""
                v-if="!areRequests"
            >No requests were found.</p>
        </div>
        <div>

        </div>
        <div class="overflow-auto center">
            <b-table
                v-if="areRequests"
                striped
                :items="filteredRequests"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :per-page="perPage"
                responsive="sm"
            >
                <template #cell(actions)="data">
                    <b-button
                        variant="info"
                        v-if="canEdit(data.item.status)"
                        @click="openEditModal(data.item)"
                    >Edit</b-button>
                    <b-button
                        variant="danger"
                        v-if="canCancel(data.item.status)"
                        @click="cancel(data.item)"
                    >Cancel</b-button>
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
                            <b-col v-if="isReviewer(data.item)">{{ data.item.previousReviewer }}</b-col>
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
                                    <div v-if="history.comments"><b>{{history.modifyingUser}} added comments:</b> {{history.comments}}</div>
                                </div>
                            </b-col>
                        </b-row>
                    </b-card>
                </template>

            </b-table>

            <div>
                <b-pagination
                    v-if="areRequests"
                    class="page"
                    :total-rows="requestItemsCount"
                    :per-page="perPage"
                    v-model="currentPage"
                    aria-controls="my-table"
                ></b-pagination>
                <p
                    class="mt-3"
                    v-if="areRequests"
                >Current Page: {{ currentPage }}</p>

                <div>
                    <b-form-group label="Show entries per page:">
                        <b-form-select
                            class="
                page
                reducedWidth"
                            v-model="perPage"
                            :options="options"
                        >
                        </b-form-select>
                    </b-form-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api, filterList, notify } from "../../helpers/helpers.js";
import { store } from "../../store";

/**
 * Component to show the user's requests.
 */
export default {
    name: "view-requests",

    /**
     * On mount, get and show all requests.
     */
    async mounted() {
        this.getRequests();
    },
    computed: {
        /**
         * Specify the fields that should be shown on the table.
         *
         * @returns {[String]} The list of table headers.
         */
        fields: function () {
            return [
                "name",
                "author",
                "cost",
                "type",
                { key: "status", sortable: true },
                { key: "dateCreated", sortable: true },
                "Actions",
                "Details",
            ];
        },

        /**
         * Specify the data that should be used for the table.
         *
         * @returns {[Object]} The list of requests.
         */
        requestItems: function () {
            return this.$data.requests;
        },

        /**
         * Return the size of the requests.
         *
         * @returns {Number} The number of requests.
         */
        requestItemsCount: function () {
            return this.getCount();
        },

        /**
         * Return the total pages..
         *
         * @returns {Number} The number of pages.
         */
        totalPages: function () {
            return this.$data.totalPage * this.requestItemsCount;
        },

        /**
         * Filter the list of requests using the users search.
         * If view completed is ticked, show purchased/declined requests.
         */
        filteredRequests: function () {
            if (this.viewCompleted == true) {
                return filterList(this.searchQuery, this.requests);
            } else {
                return filterList(
                    this.searchQuery,
                    this.requests.filter((request) => {
                        return (
                            request.status !== "Purchased" &&
                            request.status !== "Declined"
                        );
                    })
                );
            }
        },

        /**
         * Check if there are requests to show.
         *
         * @returns {Boolean} True if there are requests.
         */
        areRequests() {
            return this.$data.requests && this.$data.requests.length > 0;
        },

        /**
         * Options for pagination settings.
         */
        options() {
            return [5, 10, 15];
        },
    },

    data() {
        return {
            // The list of requests to display.
            requests: [],

            // The query to search requests with.
            searchQuery: "",

            // True if user wants to see purchased/declined requests.
            viewCompleted: false,

            // Default field to sort by.
            sortBy: "dateCreated",

            // Sort by descending by default.
            sortDesc: false,

            // How many requests to display per page.
            perPage: 10,

            // Current page number.
            currentPage: 1,

            // The amount of pages.
            totalPage: 0,

            // The amount of items.
            count: 0,
        };
    },

    watch: {
        currentPage() {
            this.getRequests();
        },
        perPage() {
            this.getRequests();
        },
    },

    methods: {
        /**
         * Truncate date to remove time and timezone.
         *
         * @returns {Date} The truncated date.
         */
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },

        /**
         * Truncate time to remove time.
         *
         * @returns {Date} The truncated date.
         */
        timeTruncated: function (date) {
            return date.toString().split("G")[0];
        },

        /**
         * Send a request to retrieve all Requests.
         */
        async getRequests() {
            const offset = (this.currentPage - 1) * this.perPage;
            const query =
                "?requestingUser=" +
                store.getters.user.id +
                "&offset=" +
                offset +
                "&limit=" +
                this.perPage +
                "&reviewingUser=";
            api.getRequests(query)
                .then((results) => {
                    // Set page data.
                    this.requests = results.data;
                    this.totalPage = results.totalPages;
                    this.count = results.count;

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
         * Show the modal to create the request.
         */
        openCreateModal() {
            this.$emit("createRequest");
        },

        /**
         * Send a request to cancel the Request.
         *
         * @param {String} id The request id to cancel.
         */
        cancelRequest(id) {
            api.deleteRequest(id)
                .then(() => {
                    notify(
                        this,
                        "Successfully cancelled the request.",
                        "darkenSuccess"
                    );
                    this.getRequests();
                })
                .catch(() => {
                    notify(
                        this,
                        "Failed to cancel the request. Refresh and try again.",
                        "error"
                    );
                });
        },

        /**
         * Show modal to confirm if request should be cancelled.
         *
         * @param {Object} request The request to check.
         */
        cancel(request) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to cancel your request for " +
                        request.name +
                        "?",
                    {
                        title: "Cancel request",
                        okVariant: "danger",
                        okTitle: "Yes",
                        cancelTitle: "No",
                        hideHeaderClose: true,
                    }
                )
                .then((value) => {
                    if (value) {
                        this.cancelRequest(request._id);
                    }
                })
                .catch((err) => {
                    // An error occurred
                    console.log(err);
                });
        },

        /**
         * Show the modal to edit the request.
         *
         * @param {Object} request The request to edit.
         */
        openEditModal(request) {
            this.$emit("editRequest", request);
        },

        /**
         * Check if the request can be cancelled.
         *
         * @param {String} status The current status of the request.
         * @returns {Boolean} True if request can be cancelled.
         */
        canCancel(status) {
            return status == "Pending Review";
        },

        /**
         * Check if the request can be editted.
         *
         * @param {String} status The current status of the request.
         * @returns {Boolean} True if request can be editted.
         */
        canEdit(status) {
            return status == "Needs More Information";
        },

        /**
         * Check if there is a reviewer for the request.
         *
         * @param {Object} request The request to check.
         * @returns {Boolean} True if there are requests.
         */
        isReviewer(request) {
            return request.previousReviewer;
        },

        /**
         * Get the count of the list depending on if search query is active.
         */
        getCount() {
            if (this.searchQuery != "") {
                return this.filteredRequests.length;
            } else {
                return this.$data.count;
            }
        },
    },
};
</script>
