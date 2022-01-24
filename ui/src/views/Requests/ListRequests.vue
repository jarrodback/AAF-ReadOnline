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
            @purchaseRequest="purchaseRequest"
            ref="approveModal"
        ></approve-modal>

        <review-modal
            @refreshAssignedRequests="refreshAssignedRequests"
            ref="reviewModal"
        ></review-modal>

        <assigned-requests
            @approveRequest="approveRequest"
            @reviewRequest="reviewRequest"
            ref="assignedRequests"
        ></assigned-requests>
    </div>
</template>

<script>
import ViewRequests from "../../components/User/ViewRequests.vue";
import CreateModal from "../../components/Modals/CreateModal.vue";
import EditModal from "../../components/Modals/EditModal.vue";
import ApproveModal from "../../components/Modals/ApproveModal.vue";
import ReviewModal from "../../components/Modals/ReviewModal.vue";
import AssignedRequests from "../../components/Employee/AssignedRequests.vue";
import { store } from "../../store";

/**
 * View to control what a user views when viewing their requests.
 */
export default {
    name: "requests",

    components: {
        "view-requests": ViewRequests,
        "create-modal": CreateModal,
        "edit-modal": EditModal,
        "approve-modal": ApproveModal,
        "assigned-requests": AssignedRequests,
        "review-modal": ReviewModal,
    },

    computed: {
        /**
         * Check if the logged in user is a user.
         *
         * @returns {Boolean} True if the user is a user role.
         */
        isUser() {
            return store.getters.user.role == "User";
        },
    },

    methods: {
        /**
         * Send an event request to refresh the requests.
         */
        refreshRequests() {
            this.$refs.viewRequests.getRequests();
        },

        /**
         * Send an event request to refresh the requests for the assigned page.
         */
        refreshAssignedRequests() {
            this.$refs.assignedRequests.getRequests();
        },

        /**
         * Send an event request to open the create modal.
         */
        createRequest() {
            this.$refs.createModal.openCreateModal();
        },

        /**
         * Send an event request to open the edit modal.
         */
        editRequest(request) {
            this.$refs.editModal.openEditModal(request);
        },

        /**
         * Send an event request to open the approve modal.
         */
        approveRequest(request) {
            this.$refs.approveModal.openApproveModal(request);
        },

        /**
         * Send an event request to open the review modal.
         */
        reviewRequest(request) {
            this.$refs.reviewModal.openReviewModal(request);
        },

        /**
         * Send an event request to purchase the review.
         */
        purchaseRequest(request) {
            this.$refs.assignedRequests.purchaseRequest(request);
        },
    },
};
</script>
