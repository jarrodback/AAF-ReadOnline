<template>
    <div>
        <h1>New Request</h1>
        <request-form @createOrUpdate="createOrUpdate"></request-form>
        <flash-message></flash-message>
    </div>
</template>
 
<script>
import { api } from "../../helpers/helpers";
import requestForm from "../../components/RequestForm.vue";

export default {
    name: "new-request",
    components: {
        "request-form": requestForm,
    },
    methods: {
        createOrUpdate: async function (request) {
            api.createRequest(request)
                .then(() => {
                    console.log("flash?");
                    this.flash("request created", "success");
                    this.$router.push(`/requests/`);
                })
                .catch((err) => {
                    console.log("err?");

                    console.error("Failed to create request: ", err);
                });
        },
    },
};
</script>