<template>
    <div>
        <h1>Edit Request</h1>
        <request-form
            @createOrUpdate="createOrUpdate"
            :request="request"
        ></request-form>
    </div>
</template>
 
<script>
import requestForm from "../../components/RequestForm.vue";
import { api } from "../../helpers/helpers";

export default {
    name: "edit-request",
    components: {
        "request-form": requestForm,
    },
    props: ["request"],
    methods: {
        createOrUpdate: async function (request) {
            const res = await api.updateRequest(request);
            if (res.success === true) this.flash("request edited", "success");
            this.$router.push(`/requests/`);
        },
    },
};
</script>