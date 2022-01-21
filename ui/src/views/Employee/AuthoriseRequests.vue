<template>
    <div>
        <authorise-requests>
        </authorise-requests>
    </div>
</template>

<script>
import AuthoriseRequests from "../../components/AuthoriseRequests.vue";

export default {
    name: "requests",
    components: {
        "authorise-requests": AuthoriseRequests,
    },
};
</script>
