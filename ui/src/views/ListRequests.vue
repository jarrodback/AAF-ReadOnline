<template>
    <div>
        <h1>Requests</h1>
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
                    <th>AudioBook</th>
                    <th>Requesting User</th>
                </tr>
            </thead>
            <tr
                v-for="(request, i) in requests"
                :key="i"
            >
                <td>{{ request.name }}</td>
                <td>{{ request.cost }}</td>
                <td>{{ request.author }}</td>
                <td>{{ request.datePublished }}</td>
                <td>{{ request.audiobook }}</td>
                <td>{{ request.requestingUser }}</td>
                <td><button v-on:click="edit(request._id)">Edit</button></td>
            </tr>
        </table>
    </div>
</template>

<script>
import { api } from "../helpers/helpers.js";
export default {
    name: "requests",
    data() {
        return {
            requests: [],
        };
    },
    async mounted() {
        this.requests = await api.getrequests();
    },
    methods: {
        edit: function (id) {
            console.log(id);
            this.$router.push({ name: `/requests/edit`, params: { id: id } });
        },
    },
};
</script>
