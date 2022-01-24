<template>
    <div>
        <user-management
            ref=userManagement
            @editUser="editUser"
        >
        </user-management>

        <edit-user-modal
            ref=userModal
            @refreshUsers="refreshUsers"
        >
        </edit-user-modal>
    </div>
</template>

<script>
import UserManagement from "../../components/Admin/UserManagement.vue";
import EditUserModal from "../../components/Modals/EditUserModal.vue";

/**
 * View to control the user management page.
 */
export default {
    name: "manage-view",
    components: {
        "user-management": UserManagement,
        "edit-user-modal": EditUserModal,
    },

    methods: {
        /**
         * Send an event request to refresh the events.
         */
        refreshUsers() {
            this.$refs.userManagement.getUsers();
        },

        /**
         * Send an event request to open the user edit modal.
         *
         * @param {Object} user Pass the user to edit.
         */
        editUser(user) {
            this.$refs.userModal.openEditModal(user);
        },
    },
};
</script>
