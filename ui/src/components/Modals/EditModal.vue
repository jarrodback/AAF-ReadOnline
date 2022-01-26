  <template>
    <div>
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
                        v-model="request.name"
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
                        v-model="request.cost"
                        :state="isCostValid"
                        @keypress="validateNumber"
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
                        v-model="request.author"
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
                        v-model="request.type"
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
                        v-model="request.reviewComments"
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
                        v-model="request.additionalInformation"
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
import { api, notify } from "../../helpers/helpers.js";
import { store } from "../../store";

/**
 * Component to show the edit modal.
 */
export default {
    name: "edit-modal",
    computed: {
        /**
         * Display options for book type.
         */
        options: function () {
            return ["Book", "Audiobook", "Magazine"];
        },

        /**
         * Check if name meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isNameValid() {
            if (this.request.name) {
                return this.validName();
            }
            return false;
        },

        /**
         * Check if author meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isAuthorValid() {
            if (this.request.author) {
                return this.validAuthor();
            }
            return false;
        },

        /**
         * Check if cost meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isCostValid() {
            if (this.request.cost) {
                return this.validCost();
            }
            return false;
        },

        /**
         * Check if additional information has been input.
         * @return {Boolean} Whether the condition is true.
         */
        isAdditionalInfoValid() {
            if (this.request.additionalInformation) {
                return this.validAdditionalInfo();
            }
            return false;
        },

        /**
         * Check if the form passes all validation.
         * @return {Boolean} Whether the condition is true.
         */
        isFormValid() {
            return this.isNameValid && this.isAuthorValid && this.isCostValid;
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
         * Show the modal on the page.
         */
        openEditModal(request) {
            this.request = { ...request };
            this.$refs["edit-modal"].show();
        },

        /**
         * On modal submit, check if validation passes.
         */
        handleOk(event) {
            if (this.isFormValid) {
                this.editRequest();
            } else {
                event.preventDefault();
            }
        },

        /**
         * Check if name follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validName() {
            return this.request.name.length > 0 ? true : false;
        },

        /**
         * Check if cost follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validCost() {
            return this.request.cost > -1 ? true : false;
        },

        /**
         * Check if author follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validAuthor() {
            return this.request.author.length > 0 ? true : false;
        },

        /**
         * Check if additional information follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validAdditionalInfo() {
            return this.request.additionalInformation.length > 0 ? true : false;
        },

        /**
         * Restrict input to 2 decimal places.
         *
         * @param {Event} event The key press event.
         */
        validateNumber(event) {
            if (
                this.request.cost != null &&
                this.request.cost.indexOf(".") > -1 &&
                this.request.cost.split(".")[1].length > 1
            ) {
                event.preventDefault();
            }
        },

        /**
         * Send a request to edit the Request.
         */
        editRequest() {
            let payload = { ...this.request };
            payload.reviewingUser = payload.previousReviewer;
            payload.status = "In Review";
            payload.history.push({
                time: Date.now(),
                status: "In Review",
                modifyingUser: store.getters.user.username,
                comments: this.request.additionalInformation,
            });

            api.updateRequest(payload)
                .then(() => {
                    notify(
                        this,
                        "Successfully edited the request.",
                        "darkenSuccess"
                    );

                    this.$emit("refreshRequests");
                })
                .catch(() => {
                    notify(
                        this,
                        "Failed to edit the request. Try again.",
                        "error"
                    );
                });
        },
    },
};
</script>



