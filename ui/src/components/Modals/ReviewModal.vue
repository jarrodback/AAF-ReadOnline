  <template>
    <div>
        <b-modal
            id="review-request-modal"
            title="More Information Required"
            ref="review-modal"
            @ok="handleOk"
            :okTitle="'Confirm'"
        >
            <b-form
                ref="reviewRequestForm"
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
                        v-model="request.reviewComments"
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
                        v-model="request.additionalInformation"
                        required
                        placeholder="Enter additional information..."
                        rows="3"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>

            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";
import { store } from "../../store";

/**
 * Component to show the modal to review a request before approval.
 */
export default {
    name: "review-modal",

    computed: {
        /**
         * Check if review comments have been input.
         * @returns {Boolean} True if comments have been input.
         */
        isCommentValid() {
            if (this.request.reviewComments) {
                return this.request.reviewComments.length > 0;
            }
            return false;
        },

        /**
         * Check if additional comments have been input.
         * @returns {Boolean} True if comments have been input.
         */
        additionalInformationGiven() {
            return this.request.additionalInformation;
        },
    },

    data() {
        return {
            // The mapped form data.
            request: {},
        };
    },

    methods: {
        /**
         * On modal submittion, check if inputs are valid.
         */
        handleOk(event) {
            if (this.isCommentValid) {
                this.needsMoreInformation();
            } else {
                event.preventDefault();
            }
        },

        /**
         * Show the modal.
         */
        openReviewModal(request) {
            this.request = { ...request };
            this.$refs["review-modal"].show();
        },

        /**
         * Update request to show more info is needed.
         */
        needsMoreInformation() {
            const payload = {
                _id: this.request._id,
                status: "Needs More Information",
                reviewingUser: "",
                previousReviewer: store.getters.user.username,
                reviewComments: this.request.reviewComments,
            };
            this.updateRequest(payload);
        },

        /**
         * Send a request to update the Request
         */
        updateRequest(payload) {
            api.updateRequest(payload)
                .then(() => {
                    // If successful, refresh the list of requests.
                    this.request = {};
                    this.$emit("refreshAssignedRequests");
                })
                .catch(() => {
                    notify(
                        this,
                        "Failed to update the request. Try again.",
                        "error"
                    );
                });
        },
    },
};
</script>


