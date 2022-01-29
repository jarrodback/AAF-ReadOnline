  <template>
    <div>
        <div>
            <h1>Review Requests</h1>
        </div>
        <div class="center">

            <b-form-input
                v-if="areRequests"
                size="sm"
                class="mr-sm-2 input"
                placeholder="Search for requests"
                v-model="searchQuery"
            ></b-form-input>

            <p v-if="!areRequests">No requests were found to review. Please assign yourself more!</p>
            <b-table
                v-else
                striped
                :items="filteredRequests"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                responsive="sm"
                :per-page="perPage"
            >
                <template #cell(actions)="data">
                    <b-button-group>
                        <!-- <b-button
                            variant="danger"
                            v-if="isDeclined(data.item)"
                            v-on:click="cancel(data.item)"
                        >Cancel</b-button> -->
                        <b-button
                            variant="success"
                            v-if="isApproved(data.item)"
                            v-on:click="purchase(data.item)"
                        >Purchase</b-button>
                        <b-button
                            variant="info"
                            v-else-if="hasComments(data.item)"
                            v-on:click="openReviewModal(data.item)"
                        >View Response</b-button>
                        <b-button
                            v-bind:id="data.item.name"
                            variant="info"
                            v-else-if="inReview(data.item)"
                            v-on:click="openReviewModal(data.item)"
                        >Needs More Information</b-button>
                        <b-button
                            v-bind:id="data.item.name"
                            variant="info"
                            v-else-if="pendingReview(data.item)"
                            v-on:click="beginWorkOnRequest(data.item)"
                        >Review</b-button>
                        <b-button
                            v-bind:id="data.item.name"
                            variant="success"
                            v-if="inReview(data.item)"
                            v-on:click="openApproveModal(data.item)"
                        >Approve</b-button>
                    </b-button-group>

                </template>

                <template #cell(Details)="data">
                    <b-form-checkbox
                        v-model="data.detailsShowing"
                        @change="data.toggleDetails"
                    >
                        View History
                    </b-form-checkbox>

                    <b-link
                        v-if="!pendingReview(data.item)"
                        v-on:click="requestSupportChat(data.item)"
                    > Support chat</b-link>
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

                <div v-if="areRequests">
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
import { api, notify, filterList } from "../../helpers/helpers.js";
import { store } from "../../store";

/**
 * Component to show the list of assigned requests an Employee has.
 */
export default {
    name: "employee-requests",

    /**
     * On mount, get and display all requests.
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
         * Check if there are requests to show.
         *
         * @returns {Boolean} True if there are requests.
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

        /**
         * Options for pagination settings.
         */
        options() {
            return [5, 10, 15];
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
    },

    data() {
        return {
            // The list of requests to display.
            requests: [],

            // Store the user's query.
            searchQuery: "",

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
         * Send a request to retrieve all Requests.
         */
        async getRequests() {
            const offset = (this.currentPage - 1) * this.perPage;

            // Query the data on the API using query params. Returns all data with reviewing user equal to username.
            const query =
                "?reviewingUser=" +
                store.getters.user.username +
                "&offset=" +
                offset +
                "&limit=" +
                this.perPage;

            api.getRequests(query)
                .then((results) => {
                    // Save page data
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
         * Show the modal to review the request.
         *
         * @param {Object} request The request to view.
         */
        openReviewModal(request) {
            this.$emit("reviewRequest", request);
        },

        /**
         * Begin reviewing a request. Show modal to validate action.
         *
         * @param {Object} request The request to begin reviewing.
         */
        beginWorkOnRequest(request) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to begin work on this request?",
                    {
                        title: "Begin work on Request",
                        okVariant: "success",
                        okTitle: "Yes",
                        cancelTitle: "No",
                        hideHeaderClose: true,
                    }
                )
                .then((value) => {
                    if (value) {
                        const payload = {
                            _id: request._id,
                            status: "In Review",
                            history: request.history,
                        };
                        payload.history.push({
                            time: Date.now(),
                            status: "In Review",
                            modifyingUser: store.getters.user.username,
                        });

                        this.updateRequest(
                            payload,
                            "The request is now in review."
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        /**
         * Show the modal to approve the request.
         *
         * @param {Object} request The request to approve.
         */
        openApproveModal(request) {
            this.$emit("approveRequest", request);
        },

        /**
         * Send a request to update the Request.
         *
         * @param {Object} payload The updated request.
         * @param {String} message The message to show.
         */
        updateRequest(payload, message) {
            api.updateRequest(payload)
                .then(() => {
                    notify(this, message, "darkenSuccess");
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

        /**
         * Check if a review is in review.
         *
         * @param {Object} request The request to check.
         * @returns {Boolean} True if request is in review.
         */
        inReview(request) {
            return (
                request.status !== "Pending Review" &&
                !this.isDeclined(request) &&
                request.status !== "Needs Authorisation" &&
                request.status !== "Approved"
            );
        },

        /**
         * Check if a review is pending review.
         *
         * @param {Object} request The request to check.
         * @returns {Boolean} True if request is pending review.
         */
        pendingReview(request) {
            return request.status == "Pending Review";
        },

        /**
         * Check if a review has recieved additional comments.
         *
         * @param {Object} request The request to check.
         * @returns {Boolean} True if request has additional information.
         */
        hasComments(request) {
            return (
                request.additionalInformation && request.status == "In Review"
            );
        },

        /**
         * Check if a review is approved .
         *
         * @param {Object} request The request to check.
         * @returns {Boolean} True if request is approved.
         */
        isApproved(request) {
            return request.status == "Approved";
        },

        /**
         * Check if a review is denied.
         *
         * @param {Object} request The request to check.
         * @returns {Boolean} True if request is denied.
         */
        isDeclined(request) {
            return request.status == "Declined";
        },

        /**
         * Show modal to confirm if request should be cancelled.
         *
         * @param {Object} request The request to check.
         */
        cancel(request) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to cancel the request for " +
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
                        this.cancelRequest(request);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        /**
         * Send a request to cancel the Request.
         *
         * @param {Object} request The request to cancel.
         */
        cancelRequest(request) {
            api.deleteRequest(request._id)
                .then(() => {
                    const payload = {
                        message:
                            "Your request for " +
                            request.name +
                            " has been declined.",
                        username: request.requestingUser,
                    };
                    notify(
                        this,
                        "The request has been cancelled.",
                        "darkenSuccess"
                    );
                    api.createNotification(payload);

                    this.getRequests();
                })
                .catch(() => {
                    notify(
                        this,
                        "An error occurred while cancelling the request. Try again.",
                        "error"
                    );
                });
        },

        /**
         * Show modal to check if request should be purchased.
         *
         * @param {Object} request The request to check.
         */
        purchase(request) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to purchase the request?",
                    {
                        title: "Purchase request",
                        okVariant: "success",
                        okTitle: "Yes",
                        cancelTitle: "No",
                        hideHeaderClose: true,
                    }
                )
                .then((value) => {
                    if (value) {
                        this.purchaseRequest(request);
                    }
                })
                .catch((err) => {
                    // An error occurred
                    console.log(err);
                });
        },

        /**
         * Create payload to set request to purchased.
         *
         * @param {Object} request The request to purchase.
         */
        purchaseRequest(request) {
            const payload = {
                _id: request._id,
                status: "Purchased",
                reviewingUser: "",
                history: request.history,
            };
            payload.history.push({
                time: Date.now(),
                status: "Purchased",
                modifyingUser: store.getters.user.username,
            });

            this.updateRequest(payload, "Successfully purchased request.");

            const notifyPayload = {
                message:
                    "Your request for " +
                    request.name +
                    " has been approved and purchased.",
                username: request.requestingUser,
            };
            api.createNotification(notifyPayload);
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
         * Truncate time to remove time.
         *
         * @returns {Date} The truncated date.
         */
        timeTruncated: function (date) {
            return date.toString().split("G")[0];
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

        /**
         * Start a support chat
         */
        requestSupportChat(request) {
            this.$emit("showChat", request);
        },
    },
};
</script>
