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
import { api } from "../helpers/helpers.js";
import { store } from "../store";

export default {
    name: "assign-requests",

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

        options: function () {
            return ["Book", "Audiobook"];
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
            const query = "?status=Pending Review&reviewingUser=";
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
                .catch((err) => {
                    // An error occurred
                    console.log(err);
                });
        },

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
