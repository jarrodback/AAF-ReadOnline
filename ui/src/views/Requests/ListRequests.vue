<template>
    <div v-if="isUser">
        <create-modal @refreshRequests="refreshRequests"></create-modal>
        <view-requests ref="viewRequests"></view-requests>
    </div>
    <div v-else>
        <employee-requests>
        </employee-requests>
    </div>
</template>

<script>
import ViewRequests from "../../components/RequestTable.vue";
import CreateModal from "../../components/CreateModal.vue";
import EmployeeRequests from "../../components/EmployeeRequestTable.vue";
import { store } from "../../store";

export default {
    name: "requests",
    components: {
        "view-requests": ViewRequests,
        "create-modal": CreateModal,
        "employee-requests": EmployeeRequests,
    },
    computed: {
        isUser() {
            return store.getters.user.role == "User";
        },
    },
    methods: {
        refreshRequests() {
            this.$refs.viewRequests.getRequests();
        },
    },
};
</script>
