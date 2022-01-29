<template>
    <div>
        <div>
            <h1>Manage</h1>
        </div>
        <div class="center">
            <h2>Settings</h2>
            <b-form-group
                label="Configure Cost Threshold"
                label-for="cost-input"
                invalid-feedback="Cost cannot be below 100."
                class="threshold center"
            >
                <b-form-input
                    type="number"
                    v-model="config.costThreshold"
                    size="sm"
                    class="mr-sm-2 threshold"
                    placeholder="Enter the cost threshold..."
                    :state="checkThreshold"
                ></b-form-input>

            </b-form-group>
            <b-button
                class="threshold margin-bottom"
                variant="success"
                v-on:click="updateCostThreshold"
            >Save</b-button>
            <div>
                <h2>Statistics</h2>
                <p>The statistics of the status of the ongoing requests for Readbooks Online.</p>
                <div class="flex">

                    <div class="half">
                        <b-table
                            striped
                            :items="requestItems"
                            :fields="fields"
                            responsive="sm"
                        >
                        </b-table>
                    </div>
                    <div class="half bars">
                        <b-progress
                            :max="total"
                            show-progress
                            animated
                        >
                            <b-progress-bar
                                :value="total"
                                variant="info"
                            >
                                <span> Total: {{total}} </span>
                            </b-progress-bar>
                        </b-progress>
                        <b-progress
                            class="mt-2"
                            :max="total"
                            show-value
                        >

                            <b-progress-bar
                                :value="statusCounter['Pending Review']"
                                variant="warning"
                            >
                                <span> Pending Review: {{statusCounter['Pending Review']}} </span>
                            </b-progress-bar>

                            <b-progress-bar
                                :value="statusCounter['In Review']"
                                variant="success"
                            >
                                <span> In Review: {{statusCounter['In Review']}} </span>
                            </b-progress-bar>

                            <b-progress-bar
                                :value="statusCounter['Needs More Information']"
                                variant="danger"
                            >
                                <span> Needs More Information: {{statusCounter['Needs More Information']}} </span>
                            </b-progress-bar>

                            <b-progress-bar
                                :value="statusCounter['Approved']"
                                variant="dark"
                            >
                                <span> Approved: {{statusCounter['Approved']}} </span>
                            </b-progress-bar>

                            <b-progress-bar
                                :value="statusCounter['Needs Authorisation']"
                                variant="danger"
                            >
                                <span> Needs Authorisiation: {{statusCounter['Needs Authorisation']}} </span>
                            </b-progress-bar>

                            <b-progress-bar
                                :value="statusCounter['Declined']"
                                variant="warning"
                            >
                                <span> Declined: {{statusCounter['Declined']}} </span>
                            </b-progress-bar>

                            <b-progress-bar
                                :value="statusCounter['Purchased']"
                                variant="secondary"
                            >
                                <span> Purchased: {{statusCounter['Purchased']}} </span>
                            </b-progress-bar>

                        </b-progress>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";

/**
 * Component to show Employees the list of requests that need assigning.
 */
export default {
    name: "manage",

    /**
     * When component is mounted, get all config settings and requests.
     */
    async mounted() {
        this.getRequests();
        this.getConfigSettings();
    },

    data() {
        return {
            // Store requests from API.
            requests: [],

            // Store the amount of each status. [{status: amount}]
            statusCounter: {},

            // Store the config object.
            config: {},
        };
    },

    computed: {
        /**
         * Fields to show in the Assign Request table.
         */
        fields: function () {
            return [
                "Pending Review",
                "In Review",
                "Needs More Information",
                "Approved",
                "Needs Authorisation",
                "Declined",
                "Purchased",
            ];
        },

        /**
         * The items to show in the table.
         */
        requestItems: function () {
            return [
                {
                    "Pending Review": this.statusCounter["Pending Review"] ?? 0,
                    "In Review": this.statusCounter["In Review"] ?? 0,
                    "Needs More Information":
                        this.statusCounter["Needs More Information"] ?? 0,
                    Approved: this.statusCounter["Approved"] ?? 0,
                    "Needs Authorisation":
                        this.statusCounter["Needs Authorisation"] ?? 0,
                    Declined: this.statusCounter["Declined"] ?? 0,
                    Purchased: this.statusCounter["Purchased"] ?? 0,
                },
            ];
        },

        /**
         * Calculate the total amount of requests.
         */
        total: function () {
            if (this.statusCounter) {
                return (
                    (this.statusCounter["In Review"] ?? 0) +
                    (this.statusCounter["Pending Review"] ?? 0) +
                    (this.statusCounter["Needs More Information"] ?? 0) +
                    (this.statusCounter["Approved"] ?? 0) +
                    (this.statusCounter["Needs Authorisation"] ?? 0) +
                    (this.statusCounter["Declined"] ?? 0) +
                    (this.statusCounter["Purchased"] ?? 0)
                );
            } else {
                return 0;
            }
        },

        checkThreshold() {
            return this.config.costThreshold >= 100;
        },
    },

    methods: {
        /**
         * Send a request to the API to retrieve all requests that meet query param conditions.
         */
        async getRequests() {
            api.getRequests()
                .then((results) => {
                    let statusCounter = [];
                    // If successful, truncate the results and save them.
                    this.requests = results.data;
                    if (this.requests.length > 0) {
                        // Calculate the amount of each status.
                        for (var x = 0; x < this.requests.length; x++) {
                            if (!statusCounter[this.requests[x].status]) {
                                statusCounter[this.requests[x].status] = 1;
                            }
                            statusCounter[this.requests[x].status]++;
                        }

                        // Populate the counter object.
                        this.statusCounter = {
                            "Pending Review": statusCounter["Pending Review"],
                            "In Review": statusCounter["In Review"],
                            "Needs More Information":
                                statusCounter["Needs More Information"],
                            Approved: statusCounter["Approved"],
                            "Needs Authorisation":
                                statusCounter["Needs Authorisation"],
                            Declined: statusCounter["Declined"],
                            Purchased: statusCounter["Purchased"],
                        };
                    }
                })
                .catch(() => {
                    // No requests to show.
                    this.requests = [];
                });
        },

        /**
         * Send a request to the API to retrieve all config settings.
         */
        async getConfigSettings() {
            api.getConfigSettings().then((config) => {
                // Only ever 1 config object so we can safely grab index 0.
                this.config = config[0];
            });
        },

        updateCostThreshold() {
            const payload = {
                costThreshold: this.config.costThreshold,
            };

            this.updateConfigSettings(payload);
        },

        /**
         * Send a request to update the config.
         *
         * @param {Object} payload The data to update.
         */
        async updateConfigSettings(payload) {
            api.updateConfig(payload).then(() => {
                notify(
                    this,
                    "Successfully updated the config settings.",
                    "darkenSuccess"
                );
            });
        },
    },
};
</script>

<style>
/* .half {
    width: 50%;
    padding: 20px;
}
.flex {
    display: flex;
} */
.bars {
    margin: auto;
}
.threshold {
    padding: 5px;
}
.margin-bottom {
    margin-bottom: 10px;
}
</style>