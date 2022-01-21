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
import { api } from "../helpers/helpers.js";
import { store } from "../store";

export default {
    name: "view-requests",
    async mounted() {
        this.getRequests();
    },
    computed: {
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

        requestItems: function () {
            return this.$data.requests;
        },

        areRequests() {
            return this.$data.requests && this.$data.requests.length > 0;
        },
    },

    data() {
        return {
            requests: [],
        };
    },

    methods: {
        // Truncate Date type to show only the date.
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },
        openCreateModal() {
            this.$emit("createRequest");
        },
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
        openEditModal(request) {
            this.$emit("editRequest", request);
        },
        canCancel(status) {
            return status == "Pending Review";
        },
        canEdit(status) {
            return status == "Needs More Information";
        },
    },
};
</script>

<style>
</style>


