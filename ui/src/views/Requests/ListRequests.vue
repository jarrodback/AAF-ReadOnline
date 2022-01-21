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
        <approve-modal
            @refreshAssignedRequests="refreshAssignedRequests"
            ref="approveModal"
        ></approve-modal>

        <edit-modal
            @refreshAssignedRequests="refreshAssignedRequests"
            ref="editAssignedModal"
        ></edit-modal>

        <assigned-requests
            @approveRequest="approveRequest"
            @editAssignedRequest="editAssignedRequest"
            ref="assignedRequests"
        ></assigned-requests>
    </div>
</template>

<script>
import ViewRequests from "../../components/ViewRequests.vue";
import CreateModal from "../../components/Modals/CreateModal.vue";
import EditModal from "../../components/Modals/EditModal.vue";
import ApproveModal from "../../components/Modals/ApproveModal.vue";
import AssignedRequests from "../../components/Employee/AssignedRequests.vue";
import { store } from "../../store";

export default {
    name: "requests",
    components: {
        "view-requests": ViewRequests,
        "create-modal": CreateModal,
        "edit-modal": EditModal,
        "approve-modal": ApproveModal,
        "assigned-requests": AssignedRequests,
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
        refreshAssignedRequests() {
            this.$refs.assignedRequests.getRequests();
        },
        createRequest() {
            this.$refs.createModal.openCreateModal();
        },
        editRequest(request) {
            this.$refs.editModal.openEditModal(request);
        },
        approveRequest(request) {
            this.$refs.approveModal.openApproveModal(request);
        },
        editAssignedRequest(request) {
            this.$refs.editAssignedModal.openEditModal(request);
        },
    },
};
</script>
