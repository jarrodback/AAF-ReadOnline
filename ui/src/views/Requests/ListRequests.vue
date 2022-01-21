<template>
    <div v-if="isUser">
        <create-modal
            @refreshRequests="refreshRequests"
            ref="createModal"
        ></create-modal>
        <edit-modal
            @refreshRequests="refreshRequests"
            ref="editModal"
        ></edit-modal>
        <view-requests
            @createRequest="createRequest"
            @editRequest="editRequest"
            ref="viewRequests"
        ></view-requests>
    </div>
    <div v-else>
        <employee-requests>
        </employee-requests>
    </div>
</template>

<script>
import ViewRequests from "../../components/ViewRequests.vue";
import CreateModal from "../../components/Modals/CreateModal.vue";
import EditModal from "../../components/Modals/EditModal.vue";
import EmployeeRequests from "../../components/EmployeeRequestTable.vue";
import { store } from "../../store";

export default {
    name: "requests",
    components: {
        "view-requests": ViewRequests,
        "create-modal": CreateModal,
        "edit-modal": EditModal,
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
        createRequest() {
            this.$refs.createModal.openCreateModal();
        },
        editRequest(request) {
            this.$refs.editModal.openEditModal(request);
        },
    },
};
</script>
