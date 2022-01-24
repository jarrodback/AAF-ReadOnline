<template>
    <div>
        <live-chat></live-chat>
    </div>
</template>

<script>
/**
 * View to control what the employee sees when assigning requests..
 */
import LiveChat from "../../components/Generic/LiveChat.vue";

export default {
    name: "requests",
    components: {
        "live-chat": LiveChat,
    },
};
</script>
