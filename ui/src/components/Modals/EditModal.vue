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
import { api, notify } from "../../helpers/helpers.js";

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
            return ["Book", "Audiobook"];
        },

        /**
         * Check if name meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isNameValid() {
            if (this.editModal.name) {
                return this.validName();
            }
            return false;
        },

        /**
         * Check if author meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isAuthorValid() {
            if (this.editModal.author) {
                return this.validAuthor();
            }
            return false;
        },

        /**
         * Check if cost meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isCostValid() {
            if (this.editModal.cost) {
                return this.validCost();
            }
            return false;
        },

        /**
         * Check if additional information has been input.
         * @return {Boolean} Whether the condition is true.
         */
        isAdditionalInfoValid() {
            if (this.editModal.additionalInformation) {
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
            requests: [],
            editModal: {},
        };
    },

    methods: {
        /**
         * Show the modal on the page.
         */
        openEditModal(request) {
            this.editModal = { ...request };
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
            return this.editModal.name.length > 0 ? true : false;
        },

        /**
         * Check if cost follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validCost() {
            return this.editModal.cost > -1 ? true : false;
        },

        /**
         * Check if author follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validAuthor() {
            return this.editModal.author.length > 0 ? true : false;
        },

        /**
         * Check if additional information follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validAdditionalInfo() {
            return this.editModal.additionalInformation.length > 0
                ? true
                : false;
        },

        /**
         * Send a request to edit the Request.
         */
        editRequest() {
            let payload = { ...this.editModal };
            payload.reviewingUser = payload.previousReviewer;
            payload.status = "In Review";
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



