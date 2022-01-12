<template>
    <div>
        <h1>New Request</h1>
        <request-form @createOrUpdate="createOrUpdate"></request-form>
    </div>
</template>
 
<script>
import { api } from "../helpers/helpers";
import requestForm from "../components/RequestForm.vue";

export default {
    name: "new-request",
    components: {
        "request-form": requestForm,
    },
    methods: {
        createOrUpdate: async function (request) {
            const res = await api.createrequest(request);
            if (res.success === true) this.flash("request created", "success");
            this.$router.push(`/requests/`);
        },
    },
};
</script>