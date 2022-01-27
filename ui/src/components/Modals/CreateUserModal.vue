  <template>
    <div>
        <b-modal
            id="create-user-modal"
            title="Create User"
            ref="create-user-modal"
            @ok="handleOk"
            :okTitle="'Create'"
        >
            <b-form
                ref="createUserForm"
                @submit.stop.prevent="handleSubmit"
            >
                <b-form-group
                    label="Username"
                    label-for="username-input"
                    invalid-feedback="Username is required of at least 5 characters"
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
                    label="Password"
                    label-for="password-input"
                    invalid-feedback="Password with a minimum length of 8 is required"
                >
                    <b-form-input
                        type="password"
                        id="password-input"
                        v-model="user.password"
                        :state="isPasswordValid"
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
                        :state="isRoleValid"
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
 * Component to show the create user modal.
 */
export default {
    name: "create-modal",
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
         * Check if name meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isPasswordValid() {
            if (this.user.password) {
                return this.user.password.length > 8;
            }
            return false;
        },

        /**
         * Check if name meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isRoleValid() {
            if (this.user.role) {
                return true;
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
            return (
                this.isUsernameValid &&
                this.isEmailValid &&
                this.isPasswordValid &&
                this.isRoleValid
            );
        },

        /**
         * Check if user is an email.
         */
        isEmployee() {
            return this.user.role == "Employee";
        },
    },

    data() {
        return {
            // The mapped form data.
            user: {},

            // Check if authorisation permission.
            grantAuthorisation: false,
        };
    },

    methods: {
        /**
         * Show the modal on the page.
         */
        openCreateModal() {
            this.$refs["create-user-modal"].show();
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
         * Check if username follows validation rules.
         *
         * @returns {Boolean} Whether the condition is met
         */
        validUsername() {
            return this.user.username.length > 4 ? true : false;
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
         * Send a user to create the Users.
         */
        createRequest() {
            let payload = { ...this.user };
            this.user = {};
            api.createUser(payload)
                .then(() => {
                    notify(
                        this,
                        "Successfully created the user.",
                        "darkenSuccess"
                    );

                    this.$emit("refreshUsers");
                })
                .catch((error) => {
                    console.log(error);
                    notify(
                        this,
                        "Failed to create the user. Try again. Error: The username or email already exist.",
                        "error"
                    );
                });
        },
    },
};
</script>



