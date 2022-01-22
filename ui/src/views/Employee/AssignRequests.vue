<template>
    <div>
        <assign-requests>
        </assign-requests>
    </div>
</template>

<script>
import AssignRequest from "../../components/Employee/AssignRequests.vue";

/**
 * View to control what the employee sees when assigning requests..
 */
export default {
    name: "requests",
    components: {
        "assign-requests": AssignRequest,
    },
};
</script>
