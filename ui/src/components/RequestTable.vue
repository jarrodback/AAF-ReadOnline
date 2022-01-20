  <template>
    <div>
        <div>
            <h1>My Requests</h1>
        </div>
        <div class="center">
            <p v-if="!areRequests">No requests were found.</p>
            <b-table
                v-else
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
        <flash-message :position="'right top'"></flash-message>

        <b-modal
            id="edit-request-modal"
            title="Edit Request"
            ref="edit-modal"
            @ok="handleOk"
            :okTitle="'Edit'"
        >
            <b-form
                ref="editRequestForm"
                @submit.stop.prevent="handleSubmit"
            >
                <b-form-group
                    label="Name"
                    label-for="name-input"
                    invalid-feedback="Name is required"
                >
                    <b-form-input
                        type="text"
                        id="name-input"
                        required
                        v-model="editModal.name"
                        :state="isNameValid"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label="Cost"
                    label-for="cost-input"
                    invalid-feedback="Cost is required"
                >
                    <b-form-input
                        type="number"
                        id="cost-input"
                        v-model="editModal.cost"
                        :state="isCostValid"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label="Author"
                    label-for="author-input"
                    invalid-feedback="Author is required"
                >
                    <b-form-input
                        type="text"
                        id="author-input"
                        v-model="editModal.author"
                        :state="isAuthorValid"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label="Type"
                    label-for="type-input"
                    invalid-feedback="Type is required"
                >
                    <b-form-select
                        id="type-input"
                        v-model="editModal.type"
                        :options="options"
                    >
                    </b-form-select>
                </b-form-group>
                <b-form-group
                    label="Review Comments"
                    label-for="comment-input"
                    invalid-feedback="Comments are required"
                >
                    <b-form-textarea
                        readonly
                        id="comment-input"
                        v-model="editModal.reviewComments"
                        required
                        placeholder="Enter comments..."
                        rows="3"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>

                <b-form-group
                    label="Additional Information"
                    label-for="additional-comment-input"
                    invalid-feedback="Additional information is required"
                >
                    <b-form-textarea
                        id="additional-input"
                        v-model="editModal.additionalInformation"
                        required
                        placeholder="Enter additional information..."
                        rows="3"
                        max-rows="6"
                        :state="isAdditionalInfoValid"
                    ></b-form-textarea>
                </b-form-group>

            </b-form>
        </b-modal>
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

        options: function () {
            return ["Book", "Audiobook"];
        },

        areRequests() {
            return this.$data.requests && this.$data.requests.length > 0;
        },

        isNameValid() {
            if (this.editModal.name) {
                return this.validName();
            }
            return false;
        },

        isAuthorValid() {
            if (this.editModal.author) {
                return this.validAuthor();
            }
            return false;
        },

        isCostValid() {
            if (this.editModal.cost) {
                return this.validCost();
            }
            return false;
        },

        isAdditionalInfoValid() {
            if (this.editModal.additionalInformation) {
                return this.validAdditionalInfo();
            }
            return false;
        },

        isFormValid() {
            return this.isNameValid && this.isAuthorValid && this.isCostValid;
        },
    },

    data() {
        return {
            requests: [],
            editModal: {},
        };
    },

    methods: {
        // Truncate Date type to show only the date.
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
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

        editRequest() {
            let payload = { ...this.editModal };
            payload.reviewingUser = payload.previousReviewer;
            payload.status = "In Review";
            api.updateRequest(payload)
                .then(() => {
                    this.getRequests();
                })
                .catch((error) => {
                    console.error("Failed to update request: ", error);
                })
                .finally(() => {
                    this.editModal = {};
                });
        },
        cancelRequest(id) {
            api.deleteRequest(id)
                .then(() => {
                    this.getRequests();
                })
                .catch((error) => {
                    console.error("Failed to delete request: ", error);
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
                        // size: "sm",
                        // buttonSize: "lg",
                        okVariant: "danger",
                        okTitle: "Yes",
                        cancelTitle: "No",
                        // centered: true,
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
            this.editModal = { ...request };
            this.$refs["edit-modal"].show();
        },

        handleOk(event) {
            if (this.isFormValid) {
                this.editRequest();
            } else {
                event.preventDefault();
            }
        },
        validName() {
            return this.editModal.name.length > 0 ? true : false;
        },
        validCost() {
            return this.editModal.cost > -1 ? true : false;
        },
        validAuthor() {
            return this.editModal.author.length > 0 ? true : false;
        },
        validAdditionalInfo() {
            return this.editModal.additionalInformation.length > 0
                ? true
                : false;
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


