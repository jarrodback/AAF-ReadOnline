<template>
    <div>
        <h1>Login</h1>
        <user-login @createOrUpdate="createOrUpdate"></user-login>
    </div>
</template>
 
<script>
import { api } from "../../helpers/helpers";
import UserLogin from "../../components/UserLogin.vue";

export default {
    name: "login-user",
    components: {
        "user-login": UserLogin,
        UserLogin,
    },
    methods: {
        createOrUpdate: async function (user) {
            api.login(user).then((res) => {
                localStorage.setItem("token", res.token);
            });

            this.$router.push(`/users/`);
        },
    },
};
</script>