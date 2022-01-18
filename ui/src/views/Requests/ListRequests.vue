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
                    <th>Date Created</th>
                    <th>Type</th>
                    <th>Requesting User</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tr
                v-for="(request, i) in requests"
                :key="i"
            >
                <td>{{request.name}}</td>
                <td>{{request.cost}}</td>
                <td>{{request.author}}</td>
                <td>{{dateTruncated(request.dateCreated)}}</td>
                <td>{{request.type}}</td>
                <td>{{request.requestingUser}}</td>
                <td>{{request.status}}</td>
                <b-button
                    variant="primary"
                    v-b-modal.edit-request-modal
                >Edit</b-button>

                <b-button @click="cancel(request._id)">Cancel</b-button>

                <b-modal
                    id="edit-request-modal"
                    title="Edit Request"
                    ref="modal"
                >
                    <form
                        ref="form"
                        @submit.stop.prevent="handleSubmit"
                    >
                        <b-form-group
                            label="Name"
                            label-for="name-input"
                            invalid-feedback="Name is required"
                            :state="nameState"
                        >
                            <b-form-input
                                id="name-input"
                                v-model="name"
                                :state="nameState"
                                required
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            label="Cost"
                            label-for="cost-input"
                            invalid-feedback="Cost is required"
                            :state="costState"
                        >
                            <b-form-input
                                id="cost-input"
                                v-model="cost"
                                :state="costState"
                                required
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            label="Author"
                            label-for="author-input"
                            invalid-feedback="Author is required"
                            :state="authorState"
                        >
                            <b-form-input
                                id="author-input"
                                v-model="author"
                                :state="authorState"
                                required
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            label="Type"
                            label-for="type-input"
                            invalid-feedback="Type is required"
                            :state="typeState"
                        >
                            <b-form-select
                                id="type-input"
                                v-model="type"
                                :state="typeState"
                                required
                            >
                                <option>
                                    Book
                                </option>
                                <option>
                                    Audiobook
                                </option>
                            </b-form-select>
                        </b-form-group>

                    </form>
                </b-modal>
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
            // Declare list of requests to display.
            requests: [],
            selectedRequest: {
                name: "",
                author: "",
                cost: "",
                type: "",
            },
        };
    },

    // On mount, retrieve all requests.
    async mounted() {
        this.requests = this.getAllRequests();
    },

    methods: {
        // Call API to retrieve list of requests and save it to the request variable.
        async getAllRequests() {
            this.requests = [];
            this.requests = await api.getRequests();
        },

        // Truncate Date type to show only the date.
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },

        edit: function (request) {
            this.$router.push({
                name: `edit-request`,
                params: { request: request },
            });
        },
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity();
            this.nameState = valid;
            return valid;
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            // Trigger submit handler
            this.handleSubmit();
        },
        handleSubmit() {
            if (!this.checkFormValidity()) {
                return;
            }
        },
        cancel(id) {
            this.$bvModal
                .msgBoxConfirm("Are you sure you want to cancel this request?")
                .then((value) => {
                    if (value) {
                        this.cancelRequest(id);
                    }
                });
        },
        cancelRequest(id) {
            const result = api.deleteRequest(id);
            result
                .then(() => {
                    this.getAllRequests();
                })
                .catch((err) => {
                    console.error("Unable to retrieve requests: ", err.message);
                });
        },
    },
};
</script>
