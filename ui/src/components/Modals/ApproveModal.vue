  <template>
    <div>
        <b-modal
            id="approve-request-modal"
            title="Approve Purchase Request"
            ref="approve-modal"
            @ok="handleOk"
            :okVariant="'success'"
            :okTitle="'Approve'"
        >
            <b-form
                ref="approveRequestForm"
                @submit.stop.prevent="handleSubmit"
            >
                <b-form-group
                    label="Calculate Offical Cost"
                    label-for="cost-input"
                    invalid-feedback="Cost is required"
                >
                    <b-form-input
                        type="number"
                        id="cost-input"
                        v-model="request.cost"
                        :state="isCostValid"
                    ></b-form-input>
                </b-form-group>

                <p
                    style="color:red"
                    v-if="!isCostBelowThreshold"
                >Note: Authorisation will be needed to confirm this purchase.</p>

            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";
import { store } from "../../store";

/**
 * Component to show the approve modal.
 */
export default {
    name: "approve-modal",

    async mounted() {
        this.getConfigSettings();
    },

    computed: {
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
         * Check the cost value below the set threshold.
         * @returns {Boolean} Whether the condition is true.
         */
        isCostBelowThreshold() {
            return this.request.cost <= this.costThreshold;
        },
    },

    data() {
        return {
            // The mapped form data.
            request: {},

            // The cost threshold to check against.
            costThreshold: "",
        };
    },

    methods: {
        /**
         * On modal submit, check the inputs are valid.
         */
        handleOk(event) {
            if (this.isCostValid) {
                if (this.isCostBelowThreshold) {
                    this.$emit("purchaseRequest", this.request);
                } else {
                    this.needsAuthorisation();
                }
            } else {
                event.preventDefault();
            }
        },

        /**
         * Show the modal.
         */
        openApproveModal(request) {
            this.request = { ...request };
            this.$refs["approve-modal"].show();
        },

        /**
         * If the cost is above threshold, ask for authorisation to proceed.
         */
        needsAuthorisation() {
            const payload = {
                _id: this.request._id,
                status: "Needs Authorisation",
                cost: this.request.cost,
                history: this.request.history,
            };
            payload.history.push({
                time: Date.now(),
                status: "Needs Authorisation",
                modifyingUser: store.getters.user.username,
            });

            this.updateRequest(payload);
        },

        /**
         * Send a request to update the Request with the new status and cost.
         */
        updateRequest(payload) {
            api.updateRequest(payload)
                .then(() => {
                    notify(
                        this,
                        "Approved request was sent for authorisation.",
                        "info"
                    );
                    this.request = {};
                    this.$emit("refreshAssignedRequests");
                })
                .catch(() => {
                    // Ignore
                });
        },

        /**
         * Check if cost follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validCost() {
            return this.request.cost > -1 ? true : false;
        },

        /**
         * Send a request to the API to retrieve all config settings.
         */
        async getConfigSettings() {
            api.getConfigSettings().then((config) => {
                // Only ever 1 config object so we can safely grab index 0.
                this.costThreshold = config[0].costThreshold;
            });
        },
    },
};
</script>


