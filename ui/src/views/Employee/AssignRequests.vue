<template>
    <div>
        <assign-requests>
        </assign-requests>
    </div>
</template>

<script>
import AssignRequest from "../../components/Employee/AssignRequests.vue";

export default {
    name: "requests",
    components: {
        "assign-requests": AssignRequest,
    },
};
</script>
