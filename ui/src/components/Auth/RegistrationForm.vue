  <template>
    <div class="center login-div">
        <b-form
            ref="loginRequestForm"
            @submit="onSubmit"
        >
            <b-form-group
                label="Email"
                label-for="email-input"
                invalid-feedback="Email is required"
            >
                <b-form-input
                    type="email"
                    id="email-input"
                    v-model="registerForm.email"
                    placeholder="Enter email"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label="Username"
                label-for="username-input"
                invalid-feedback="Username must be at least 5 characters"
            >
                <b-form-input
                    type="text"
                    id="username-input"
                    v-model="registerForm.username"
                    placeholder="Enter username"
                    :state="validateUsername"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label="Password"
                label-for="password-input"
                invalid-feedback="Password is required"
            >
                <b-form-input
                    type="password"
                    id="password-input"
                    v-model="registerForm.password"
                    placeholder="Enter password"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label="Confirm password"
                label-for="password-confirm-input"
                invalid-feedback="Password is required"
            >
                <b-form-input
                    type="password"
                    id="password-confirm-input"
                    v-model="registerForm.confirmPassword"
                    placeholder="Enter password"
                    required
                ></b-form-input>

                <div class="submit-space">
                    <b-button
                        type="submit"
                        variant="primary"
                    >Register</b-button>
                </div>
            </b-form-group>

        </b-form>
    </div>
</template>

<script>
import { notify, api } from "../../helpers/helpers.js";
/**
 * Component to display registration form. Sends API request to register supplied credentials.
 */
export default {
    name: "register-form",

    data() {
        return {
            registerForm: {
                // The mapped form data.
                username: "",
            },
        };
    },

    computed: {
        /**
         * Check the username is at least 5 characters.
         * @return {Boolean} Whether condition is true.
         */
        validateUsername() {
            return this.registerForm.username.length > 4;
        },
    },

    methods: {
        /**
         * On form submit, check if username is valid and then make call to register.
         */
        onSubmit(event) {
            event.preventDefault();

            if (this.validateUsername) {
                this.register();
            }
        },

        /**
         * Send request to register an account.
         */
        register() {
            api.register(this.registerForm)
                .then(() => {
                    // If successful, navigate back to login route.
                    notify(
                        this,
                        "You successfully created an account.",
                        "darkenSuccess"
                    );
                    this.$router.push("/login");
                })
                .catch(() => {
                    notify(
                        this,
                        "Something went wrong while creating an account. Try again.",
                        "error"
                    );
                });
        },
    },
};
</script>
<style>
.login-div {
    max-width: 500px;
    padding: 10px;
}
.submit-space {
    padding: 15px;
}
</style>


