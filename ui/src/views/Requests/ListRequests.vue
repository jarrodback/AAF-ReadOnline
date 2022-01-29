<template>

    <div>
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
                @showChat="showChat"
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
                @showChat="showChat"
                ref="assignedRequests"
            ></assigned-requests>
        </div>

        <live-chat ref="liveChatComponent">
        </live-chat>
    </div>
</template>

<script>
import ViewRequests from "../../components/User/ViewRequests.vue";
import CreateModal from "../../components/Modals/CreateModal.vue";
import EditModal from "../../components/Modals/EditModal.vue";
import ApproveModal from "../../components/Modals/ApproveModal.vue";
import ReviewModal from "../../components/Modals/ReviewModal.vue";
import AssignedRequests from "../../components/Employee/AssignedRequests.vue";
import LiveChat from "../../components/Generic/LiveChat.vue";
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
        "live-chat": LiveChat,
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

        /**
         * Should the chat be shown.
         */
        showLiveChat() {
            return this.chat;
        },
    },

    data() {
        return {
            // Store whether chat should be saved.
            chat: false,
        };
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

        /**
         * Send an event to show the chat.
         */
        showChat(request) {
            this.chat = true;

            this.$refs.liveChatComponent.setupSocketConnection(request);
        },
    },
};
</script>
