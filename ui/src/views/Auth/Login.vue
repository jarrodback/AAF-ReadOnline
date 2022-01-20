<template>
    <div>
        <h1>Login</h1>
        <login-form></login-form>
        <b-link v-on:click="register">Register</b-link>
    </div>
</template>
 
<script>
import LoginForm from "../../components/LoginForm.vue";

export default {
    name: "login-user",
    components: {
        "login-form": LoginForm,
    },
    methods: {
        register() {
            this.$router.push("/register");
        },
    },
};
</script>