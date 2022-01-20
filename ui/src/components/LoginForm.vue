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
                    placeholder="Enter name"
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
import { api } from "../helpers/helpers.js";
import { store } from "../store";
export default {
    name: "login-form",

    data() {
        return {
            loginForm: {},
        };
    },

    methods: {
        onSubmit(event) {
            event.preventDefault();
            api.login(this.loginForm)
                .then((value) => {
                    store.commit("setLoggedIn", true);
                    store.commit("setUser", {
                        id: value.id,
                        username: value.username,
                        role: value.role,
                    });

                    this.$router.push("requests");
                })
                .catch((error) => {
                    console.error("Failed to login: ", error);
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


