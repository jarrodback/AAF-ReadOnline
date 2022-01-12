<template>
    <div>
        <h1>My Requests</h1>
        <table
            id="my_requests"
            class="ui celled compact table"
        >
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Cost</th>
                    <th>Author</th>
                    <th>Date Published</th>
                    <th>Type</th>
                    <th>Requesting User</th>
                </tr>
            </thead>
            <tr
                v-for="(request, i) in requests"
                :key="i"
            >
                <td>{{request.name}}</td>
                <td>{{request.cost}}</td>
                <td>{{request.author}}</td>
                <td>{{dateTruncated(request.datePublished)}}</td>
                <td>{{request.type}}</td>
                <td>{{request.requestingUser}}</td>
                <td><button
                        class="button-green"
                        v-on:click="edit(request)"
                    >Edit</button></td>
                <td><button
                        class="button-red"
                        v-on:click="cancelRequest(request._id)"
                    >Cancel Request</button></td>
            </tr>
        </table>
    </div>
</template>

<script>
import { api } from "../../helpers/helpers.js";
export default {
    name: "requests",
    computed: {},

    data() {
        return {
            requests: [],
        };
    },

    async mounted() {
        this.requests = this.getAllRequests();
    },

    methods: {
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },
        edit: function (request) {
            this.$router.push({
                name: `edit-request`,
                params: { request: request },
            });
        },
        cancelRequest(id) {
            const result = api.deleteRequest(id);
            result
                .then(() => {
                    this.getAllRequests();
                })
                .catch((err) => {
                    console.error("Unable to retrieve requests: ", err);
                });
        },
        async getAllRequests() {
            this.requests = [];
            this.requests = await api.getRequests();
        },
    },
};
</script>
