  <template>
    <div>
        <div>
            <h1>My Requests</h1>
        </div>
        <div class="center">
            <b-button
                class="createbutton"
                v-on:click="openCreateModal"
                variant="success"
            >Create</b-button>
            <p
                class=""
                v-if="!areRequests"
            >No requests were found.</p>
        </div>
        <div>

        </div>
        <div class="center">
            <b-table
                v-if="areRequests"
                striped
                :items="requestItems"
                :fields="fields"
            >
                <template #cell(actions)="data">
                    <b-link
                        v-if="canEdit(data.item.status)"
                        @click="openEditModal(data.item)"
                    >Edit</b-link>
                    <b-link
                        v-if="canCancel(data.item.status)"
                        @click="cancel(data.item)"
                    >Cancel</b-link>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
import { api } from "../../helpers/helpers.js";
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
            const query =
                "?requestingUser=" +
                store.getters.user.username +
                "&reviewingUser=";
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
                    this.$notify({
                        message: "Successfully cancelled the request.",
                        type: "darkenSuccess",
                        top: true,
                        right: true,
                        showClose: true,
                    });
                    this.getRequests();
                })
                .catch(() => {
                    this.$notify({
                        message: "Failed to cancel the request. Try again.",
                        type: "error",
                        top: true,
                        right: true,
                        showClose: true,
                    });
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
    },
};
</script>
