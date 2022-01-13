<template>
    <div class="center-form">
        <form
            action="#"
            @submit.prevent="onSubmit"
        >
            <p
                v-if="errorsPresent"
                class="error"
            >Please fill out all fields!
            </p>

            Username <input
                type="text"
                placeholder="Enter the User's name..."
                v-model="user.username"
            />
            <br />

            Email <input
                type="text"
                placeholder="Enter the User's email..."
                v-model="user.email"
            />
            <br />

            <label for="type">Role</label>
            <select v-model="user.role">
                <option
                    id="User"
                    value="User"
                >User</option>
                <option
                    id="Employee"
                    value="Employee"
                >Employee</option>
                <option
                    id="Admin"
                    value="Admin"
                >Admin</option>
            </select>
            <br />
            <input
                type="submit"
                class="button-green"
                value="Submit"
            />
        </form>
    </div>
</template>
 
<script>
export default {
    name: "user-form",
    props: {
        user: {
            type: Object,
            required: false,
            default: () => {
                return {
                    username: "",
                    email: "",
                    role: "",
                };
            },
        },
    },
    data() {
        return {
            errorsPresent: false,
        };
    },
    methods: {
        onSubmit: function () {
            if (
                this.user.username === "" ||
                this.user.email === "" ||
                this.user.role === ""
            ) {
                this.errorsPresent = true;
            } else {
                this.$emit("createOrUpdate", this.user);
            }
        },
    },
};
</script>
 
<style scoped>
.error {
    color: red;
}
</style>