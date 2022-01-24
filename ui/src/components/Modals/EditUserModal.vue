  <template>
    <div>
        <b-modal
            id="edit-user-modal"
            title="Edit User"
            ref="edit-user-modal"
            @ok="handleOk"
            :okTitle="'Edit'"
        >
            <b-form
                ref="editUserForm"
                @submit.stop.prevent="handleSubmit"
            >
                <b-form-group
                    label="Username"
                    label-for="username-input"
                    invalid-feedback="Username is required"
                >
                    <b-form-input
                        type="text"
                        id="username-input"
                        required
                        v-model="user.username"
                        :state="isUsernameValid"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label="Email"
                    label-for="email-input"
                    invalid-feedback="Email is required"
                >
                    <b-form-input
                        type="email"
                        id="email-input"
                        v-model="user.email"
                        :state="isEmailValid"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label="Role"
                    label-for="role-input"
                    invalid-feedback="Role is required"
                >
                    <b-form-select
                        id="role-input"
                        v-model="user.role"
                        :options="options"
                    >
                    </b-form-select>
                </b-form-group>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";

/**
 * Component to show the edit user modal.
 */
export default {
    name: "edit-modal",
    computed: {
        /**
         * Display options for book type.
         */
        options: function () {
            return ["User", "Employee", "Admin"];
        },

        /**
         * Check if name meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isUsernameValid() {
            if (this.user.username) {
                return this.validUsername();
            }
            return false;
        },

        /**
         * Check if cost meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isEmailValid() {
            if (this.user.email) {
                if (this.validEmail(this.user.email) != null) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        },

        /**
         * Check if the form passes all validation.
         * @return {Boolean} Whether the condition is true.
         */
        isFormValid() {
            return this.isUsernameValid && this.isEmailValid;
        },
    },

    data() {
        return {
            // The mapped form data.
            user: {},
        };
    },

    methods: {
        /**
         * Show the modal on the page.
         */
        openEditModal(user) {
            this.user = { ...user };
            this.$refs["edit-user-modal"].show();
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
         * Check if username follows validation rules.
         *
         * @returns {Boolean} Whether the condition is met
         */
        validUsername() {
            return this.user.username.length > 0 ? true : false;
        },

        /**
         * Check if email follows validation rules.
         *
         * @returns {Boolean} Whether the condition is met
         */
        validEmail(email) {
            // Check for common email symbols, eg @ and .
            return email.toLowerCase().match(/^\S+@\S+\.\S+$/);
        },

        /**
         * Send a user to edit the Users.
         */
        editRequest() {
            let payload = { ...this.user };
            api.updateUser(payload)
                .then(() => {
                    notify(
                        this,
                        "Successfully edited the user.",
                        "darkenSuccess"
                    );

                    this.$emit("refreshUsers");
                })
                .catch(() => {
                    notify(
                        this,
                        "Failed to edit the user. Try again.",
                        "error"
                    );
                });
        },
    },
};
</script>



