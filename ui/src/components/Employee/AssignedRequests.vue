  <template>
    <div>
        <div>
            <h1>Review Requests</h1>
        </div>
        <div class="center">
            <p v-if="!areRequests">No requests were found to review. Please assign yourself more!</p>
            <b-table
                v-else
                striped
                :items="requestItems"
                :fields="fields"
            >
                <template #cell(actions)="data">
                    <b-link
                        v-if="isDeclined(data.item)"
                        v-on:click="cancel(data.item)"
                    >Cancel</b-link>
                    <b-link
                        v-if="isApproved(data.item)"
                        v-on:click="purchase(data.item)"
                    >Purchase</b-link>
                    <b-link
                        v-else-if="hasComments(data.item)"
                        v-on:click="openReviewModal(data.item)"
                    >View Response</b-link>
                    <b-link
                        v-else-if="inReview(data.item)"
                        v-on:click="openReviewModal(data.item)"
                    >Needs More Information</b-link>
                    <b-link
                        v-else-if="pendingReview(data.item)"
                        v-on:click="beginWorkOnRequest(data.item)"
                    >Begin Review</b-link>
                    <b-link
                        v-if="inReview(data.item)"
                        v-on:click="openApproveModal(data.item)"
                    >Approve</b-link>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";
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
                "status",
                "dateCreated",
                "Actions",
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
    },

    data() {
        return {
            // The list of requests to display.
            requests: [],
        };
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
            // Query the data on the API using query params. Returns all data with reviewing user equal to username.
            const query = "?reviewingUser=" + store.getters.user.username;

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
                        };
                        this.updateRequest(payload);
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
         */
        updateRequest(payload) {
            api.updateRequest(payload)
                .then(() => {
                    notify(
                        this,
                        "The request is now in review.",
                        "darkenSuccess"
                    );
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
                        this.cancelRequest(request).then(() => {
                            const payload = {
                                message:
                                    "Your request for " +
                                    request.name +
                                    " has been declined.",
                                username: request.requestingUser,
                            };
                            notify(
                                this,
                                "Succesfully cancelled the request.",
                                "darkenSuccess"
                            );
                            api.createNotification(payload);
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        /**
         * Send a request to cancel the Request.
         *
         * @param {String} id The request id to cancel.
         */
        cancelRequest(request) {
            api.deleteRequest(request._id)
                .then(() => {
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
                        this.cancelRequest(request._id).then(() => {
                            notify(
                                this,
                                "Succesfully purchased the request.",
                                "darkenSuccess"
                            );
                            const payload = {
                                message:
                                    "Your request for " +
                                    request.name +
                                    " has been approved and purchased.",
                                username: request.requestingUser,
                            };
                            api.createNotification(payload);
                        });
                    }
                })
                .catch((err) => {
                    // An error occurred
                    console.log(err);
                });
        },
    },
};
</script>
