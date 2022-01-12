<template>
    <div>
        <h1>Edit Request for</h1>
        <request-form @update="update"></request-form>
        {{ this.$computed.age }}
        {{ this.$props.message }}
    </div>
</template>

<script>
import { api } from "../helpers/helpers";
import requestForm from "../components/RequestForm.vue";
import Vue from "vue";

export default Vue.extend({
    name: "new-request",
    components: {
        "request-form": requestForm,
    },
    data() {
        return {
            age: 1,
        };
    },
    //Pass into another component (paramters);
    props: { message: String },
    created() {
        //api call
        // if this.props.message == "", THEN SET.
    },
    computed: {
        getTest() {
            return "HELLOPROP";
        },
    },
    methods: {
        update: async function (request) {
            const res = await api.updateRequest(request);
            if (res.success === true) this.flash("request created", "success");
            this.$router.push(`/requests/`);
        },
    },
});
</script>
