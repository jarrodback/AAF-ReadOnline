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
                        id="cost-input"
                        v-model="createModal.cost"
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
import { api } from "../../helpers/helpers.js";
import { store } from "../../store.js";

export default {
    name: "create-modal",

    computed: {
        options: function () {
            return ["Book", "Audiobook"];
        },

        isNameValid() {
            if (this.createModal.name) {
                return this.validName();
            }
            return false;
        },
        isAuthorValid() {
            if (this.createModal.author) {
                return this.validAuthor();
            }
            return false;
        },
        isCostValid() {
            if (this.createModal.cost) {
                return this.validCost();
            }
            return false;
        },
        isTypeValid() {
            if (this.createModal.type) {
                return this.validType();
            }
            return false;
        },
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
            createModal: {
                requestingUser: store.getters.user.username,
            },
        };
    },

    methods: {
        openCreateModal() {
            this.$refs["create-modal"].show();
        },

        handleOk(event) {
            if (this.isFormValid) {
                this.createRequest();
            } else {
                event.preventDefault();
            }
        },
        validName() {
            return this.createModal.name.length > 0 ? true : false;
        },
        validCost() {
            return this.createModal.cost > -1 ? true : false;
        },
        validAuthor() {
            return this.createModal.author.length > 0 ? true : false;
        },
        validType() {
            return (
                this.createModal.type == "Book" ||
                this.createModal.type == "Audiobook"
            );
        },
        createRequest() {
            api.createRequest(this.createModal)
                .then(() => {
                    this.$notify({
                        message: "Successfully created a request.",
                        type: "darkenSuccess",
                        top: true,
                        right: true,
                        showClose: true,
                    });
                    this.$emit("refreshRequests");
                })
                .catch(() => {
                    this.$notify({
                        message: "Failed to create a request. Try again.",
                        type: "error",
                        top: true,
                        right: true,
                        showClose: true,
                    });
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


