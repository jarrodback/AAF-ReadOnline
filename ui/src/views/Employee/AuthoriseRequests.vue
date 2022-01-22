<template>
    <div>
        <authorise-requests>
        </authorise-requests>
    </div>
</template>

<script>
import AuthoriseRequests from "../../components/Admin/AuthoriseRequests.vue";

/**
 * View to control what the admin sees when authorising requests.
 */
export default {
    name: "requests",
    components: {
        "authorise-requests": AuthoriseRequests,
    },
};
</script>
