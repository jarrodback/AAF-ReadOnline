  <template>
    <div>
        <b-modal
            id="create-request-modal"
            title="Create Request"
            ref="create-modal"
            @ok="handleOk"
            :okVariant="'success'"
            :okTitle="'Create'"
        >
            <b-form
                ref="createRequestForm"
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
                        v-model="createModal.name"
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
                        step=".01"
                        id="cost-input"
                        v-model="createModal.cost"
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
                        v-model="createModal.author"
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
                        v-model="createModal.type"
                        :options="options"
                        :state="isTypeValid"
                    >
                    </b-form-select>
                </b-form-group>

            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";
import { store } from "../../store.js";

/**
 * Component to show the create modal.
 */
export default {
    name: "create-modal",

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
            if (this.createModal.name) {
                return this.validName();
            }
            return false;
        },

        /**
         * Check if author meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isAuthorValid() {
            if (this.createModal.author) {
                return this.validAuthor();
            }
            return false;
        },

        /**
         * Check if cost meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isCostValid() {
            if (this.createModal.cost) {
                return this.validCost();
            }
            return false;
        },

        /**
         * Check if type meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isTypeValid() {
            if (this.createModal.type) {
                return this.validType();
            }
            return false;
        },

        /**
         * Check if the form passes all validation.
         * @return {Boolean} Whether the condition is true.
         */
        isFormValid() {
            return (
                this.isNameValid &&
                this.isAuthorValid &&
                this.isCostValid &&
                this.isTypeValid
            );
        },
    },

    data() {
        return {
            // The mapped form data.
            createModal: {
                // Always set requesting user to be the username of the logged in user.
                requestingUser: store.getters.user.username,
            },
        };
    },

    methods: {
        /**
         * Show the modal on the page.
         */
        openCreateModal() {
            this.$refs["create-modal"].show();
        },

        /**
         * On modal submit, check if validation passes.
         */
        handleOk(event) {
            if (this.isFormValid) {
                this.createRequest();
            } else {
                event.preventDefault();
            }
        },

        /**
         * Check if name follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validName() {
            return this.createModal.name.length > 0 ? true : false;
        },

        /**
         * Check if cost follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validCost() {
            return this.createModal.cost > -1 ? true : false;
        },

        /**
         * Check if author follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validAuthor() {
            return this.createModal.author.length > 0 ? true : false;
        },

        /**
         * Check if type follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validType() {
            return (
                this.createModal.type == "Book" ||
                this.createModal.type == "Audiobook" ||
                this.createModal.type == "Magazine"
            );
        },

        /**
         * Restrict input to 2 decimal places.
         *
         * @param {Event} event The key press event.
         */
        validateNumber(event) {
            if (
                this.createModal.cost != null &&
                this.createModal.cost.indexOf(".") > -1 &&
                this.createModal.cost.split(".")[1].length > 1
            ) {
                event.preventDefault();
            }
        },

        /**
         * Send a request to create the Request.
         */
        createRequest() {
            this.createModal.history = [];
            this.createModal.history.push({
                time: Date.now(),
                status: "Pending Review",
                modifyingUser: store.getters.user.username,
            });

            api.createRequest(this.createModal)
                .then(() => {
                    // If successful, send an event to trigger the refresh of requests on other component.
                    notify(
                        this,
                        "Successfully created a request.",
                        "darkenSuccess"
                    );

                    this.$emit("refreshRequests");
                })
                .catch(() => {
                    notify(
                        this,
                        "Failed to create a request. Try again.",
                        "error"
                    );
                })
                .finally(() => {
                    this.createModal = {
                        requestingUser: store.getters.user.username,
                    };
                });
        },
    },
};
</script>


