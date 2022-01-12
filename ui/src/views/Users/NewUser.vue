<template>
    <div>
        <h1>New User</h1>
        <request-form></request-form>
    </div>
</template>
 
<script>
import { api } from "../../helpers/helpers";
import requestForm from "../../components/RequestForm.vue";

export default {
    name: "new-user",
    components: {
        "request-form": requestForm,
    },
    methods: {
        createOrUpdate: async function (request) {
            const res = await api.createRequest(request);
            if (res.success === true) this.flash("request created", "success");
            this.$router.push(`/users/`);
        },
    },
};
</script>