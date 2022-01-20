<template>
    <div>
        <assign-requests>
        </assign-requests>
    </div>
</template>

<script>
import AssignRequest from "../../components/AssignRequests.vue";

export default {
    name: "requests",
    components: {
        "assign-requests": AssignRequest,
    },
    methods: {
        refreshRequests() {
            this.$refs.viewRequests.getRequests();
        },
    },
};
</script>
