  <template>
    <div>
        <b-modal
            id="approve-request-modal"
            title="Aprove Request"
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

                <p>Note: If the cost is higher than the threshold the request will be sent for authorisation.</p>

            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";

/**
 * Component to show the approve modal.
 */
export default {
    name: "approve-modal",

    computed: {
        /**
         * Check the cost value is valid
         * @returns {Boolean} Whether the condition is true.
         */
        isCostValid() {
            return this.request.cost >= 0;
        },

        /**
         * Check the cost value below the set threshold.
         * @returns {Boolean} Whether the condition is true.
         */
        isCostBelowThreshold() {
            return this.request.cost <= 100;
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
         * On modal submit, check the inputs are valid.
         */
        handleOk(event) {
            if (this.isCostValid) {
                if (this.isCostBelowThreshold) {
                    //approve
                } else {
                    //authorise
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
            };
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
                        "Successfully approved request.",
                        "darkenSuccess"
                    );
                    this.request = {};
                    this.emit("refreshAssignedRequests");
                })
                .catch(() => {
                    notify(
                        this,
                        "An error occurred when approving the request. Try again.",
                        "error"
                    );
                });
        },
    },
};
</script>


