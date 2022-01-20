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
                        v-if="isApproved(data.item)"
                        v-on:click="openCostModal(data.item)"
                    >Calculate Cost</b-link>
                    <b-link
                        v-else-if="!inReview(data.item)"
                        v-on:click="beginWorkOnRequest(data.item)"
                    >Begin Review</b-link>
                    <b-link
                        v-else-if="hasComments(data.item)"
                        v-on:click="openInfoModal(data.item)"
                    >View Response</b-link>
                    <b-link
                        v-else-if="inReview(data.item)"
                        v-on:click="openInfoModal(data.item)"
                    >Needs More Information</b-link>
                    <b-link
                        v-if="inReview(data.item)"
                        v-on:click="approveRequest(data.item)"
                    >Approve</b-link>
                </template>
            </b-table>
        </div>
        <b-modal
            id="info-request-modal"
            title="More Information Required"
            ref="info-modal"
            @ok="handleOk"
            :okTitle="'Confirm'"
        >
            <b-form
                ref="infoRequestForm"
                @submit.stop.prevent="handleSubmit"
            >
                <p>Are you sure you want to set this request to 'Needs More Information'?</p>
                <b-form-group
                    label="Review Comments"
                    label-for="comment-input"
                    invalid-feedback="Comments are required"
                >
                    <b-form-textarea
                        id="comment-input"
                        v-model="infoModal.reviewComments"
                        required
                        placeholder="Enter comments..."
                        rows="3"
                        max-rows="6"
                        :state="isCommentValid"
                    ></b-form-textarea>
                </b-form-group>

                <b-form-group
                    v-if="additionalInformationGiven"
                    label="Additional Information"
                    label-for="additional-comment-input"
                    invalid-feedback="Additional information is required"
                >
                    <b-form-textarea
                        v-if="additionalInformationGiven"
                        readonly
                        id="additional-input"
                        v-model="infoModal.additionalInformation"
                        required
                        placeholder="Enter additional information..."
                        rows="3"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>

            </b-form>
        </b-modal>

        <b-modal
            id="cost-request-modal"
            title="Calculate Cost"
            ref="cost-modal"
            @ok="handleOk"
            :okTitle="'Confirm'"
        >
            <b-form
                ref="costRequestForm"
                @submit.stop.prevent="handleSubmit"
            >
                <b-form-group
                    label="Cost"
                    label-for="cost-input"
                    invalid-feedback="Cost is required"
                >
                    <b-form-input
                        type="number"
                        id="cost-input"
                        v-model="cost"
                        :state="isCostValid"
                    ></b-form-input>
                </b-form-group>

            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { api } from "../helpers/helpers.js";
import { store } from "../store";

export default {
    name: "employee-requests",
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

        isCommentValid() {
            if (this.infoModal.reviewComments) {
                return this.infoModal.reviewComments.length > 0;
            }
            return false;
        },
        additionalInformationGiven() {
            return this.infoModal.additionalInformation;
        },
        isCostValid() {
            return this.cost > 0;
        },
    },

    data() {
        return {
            requests: [],
            infoModal: {},
            cost: "",
        };
    },

    methods: {
        // Truncate Date type to show only the date.
        dateTruncated: function (date) {
            return date.toString().split("T")[0];
        },

        async getRequests() {
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
        handleOk(event) {
            if (this.isCommentValid) {
                this.needsMoreInformation();
            } else {
                event.preventDefault();
            }
        },
        openInfoModal(request) {
            this.infoModal = { ...request };
            this.$refs["info-modal"].show();
        },
        openCostModal() {
            this.$refs["cost-modal"].show();
        },
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
                    // An error occurred
                    console.log(err);
                });
        },

        approveRequest(request) {
            this.$bvModal
                .msgBoxConfirm(
                    "Are you sure you want to approve the request?",
                    {
                        title: "Approve Request",
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
                            status: "Approved",
                        };
                        this.updateRequest(payload);
                    }
                })
                .catch((err) => {
                    // An error occurred
                    console.log(err);
                });
        },
        needsMoreInformation() {
            const payload = {
                _id: this.infoModal._id,
                status: "Needs More Information",
                reviewingUser: "",
                previousReviewer: store.getters.user.username,
                reviewComments: this.infoModal.reviewComments,
            };
            this.updateRequest(payload);
        },

        updateRequest(payload) {
            api.updateRequest(payload)
                .then(() => {
                    this.infoModal = {};
                    this.getRequests();
                })
                .catch((error) => {
                    console.log("Failed to update request: ", error);
                });
        },

        inReview(request) {
            return request.status == "In Review";
        },

        hasComments(request) {
            return request.additionalInformation;
        },

        isApproved(request) {
            return request.status == "Approved";
        },

        // additionalInformationGiven() {
        //     console.log(
        //         "Checking: ",
        //         this.infoModal.additionalInformation.length > 0
        //     );
        //     return this.infoModal.additionalInformation.length > 0;
        // },
    },
};
</script>


