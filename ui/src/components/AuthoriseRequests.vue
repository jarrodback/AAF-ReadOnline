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
import { api } from "../helpers/helpers.js";

export default {
    name: "authorise-requests",

    async mounted() {
        this.getRequests();
    },

    data() {
        return {
            requests: [],
        };
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
                "requestingUser",
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

    methods: {
        // Truncate Date type to show only the date.
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },

        async getRequests() {
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
                    // console.error("Failed to get requests: ", error);
                    // No requests found.
                });
        },

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
                    // An error occurred
                    console.log(err);
                });
        },

        declineRequest(request) {
            const payload = {
                _id: request._id,
                status: "Declined",
            };
            this.updateRequest(payload);
        },

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
                    // An error occurred
                    console.log(err);
                });
        },

        acceptRequest(request) {
            const payload = {
                _id: request._id,
                status: "Approved",
            };
            this.updateRequest(payload);
        },

        updateRequest(payload) {
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
