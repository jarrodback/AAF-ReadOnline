<template>
    <div>
        <h1>New User</h1>
        <user-form @createOrUpdate="createOrUpdate"></user-form>
    </div>
</template>
 
<script>
import { api } from "../../helpers/helpers";
import userForm from "../../components/UserForm.vue";

export default {
    name: "new-user",
    components: {
        "user-form": userForm,
    },
    methods: {
        createOrUpdate: async function (user) {
            const res = await api.createUser(user);
            if (res.success === true) this.flash("request created", "success");
            this.$router.push(`/users/`);
        },
    },
};
</script>