<template>
    <div>
        <h1>Login</h1>
        <login-form></login-form>
        <p>If you don't have an account you can create one here: <b-link v-on:click="register">Register</b-link>
        </p>
    </div>
</template>
 
<script>
import LoginForm from "../../components/Auth/LoginForm.vue";

/**
 * View to control what the user sees when logging.
 */
export default {
    name: "login-user",

    components: {
        "login-form": LoginForm,
    },

    methods: {
        /**
         * Navigate the user to the register route.
         */
        register() {
            this.$router.push("/register");
        },
    },
};
</script>