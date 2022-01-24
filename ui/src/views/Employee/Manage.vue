<template>
    <div>
        <manage-config>
        </manage-config>
    </div>
</template>

<script>
import Manage from "../../components/Admin/Manage.vue";

/**
 * View to control what the admin sees when viewing the manage page.
 */
export default {
    name: "manage-view",
    components: {
        "manage-config": Manage,
    },
};
</script>
