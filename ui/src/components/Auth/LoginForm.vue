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
                    v-model="loginForm.email"
                    placeholder="Enter email"
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
                    v-model="loginForm.password"
                    placeholder="Enter password"
                    required
                ></b-form-input>
                <div class="submit-space">
                    <b-button
                        type="submit"
                        variant="primary"
                    >Login</b-button>
                </div>
            </b-form-group>

        </b-form>
    </div>
</template>

<script>
import { api, notify } from "../../helpers/helpers.js";
import { store } from "../../store";

/**
 * Component to display a login form. Sends a request to the API with credentials.
 */
export default {
    name: "login-form",

    data() {
        return {
            // The mapped form data.
            loginForm: {},
        };
    },

    methods: {
        /**
         * On submitting of the form, send login request to API.
         */
        onSubmit(event) {
            event.preventDefault();
            api.login(this.loginForm)
                .then((value) => {
                    // If successful, store returned user details and change route.
                    store.commit("setLoggedIn", true);
                    store.commit("setUser", {
                        id: value.data.id,
                        username: value.data.username,
                        role: value.data.role,
                        rights: value.data.rights,
                    });

                    this.$router.push("requests");
                })
                .catch(() => {
                    notify(
                        this,
                        "Your email or password is incorrect.",
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


