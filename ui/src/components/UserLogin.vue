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

            Email <input
                type="text"
                placeholder="Enter the User's name..."
                v-model="user.email"
            />
            <br />

            Password <input
                type="text"
                placeholder="Enter the User's email..."
                v-model="user.password"
            />
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
    name: "user-login",
    props: {
        user: {
            type: Object,
            required: false,
            default: () => {
                return {
                    email: "",
                    password: "",
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
            if (this.user.password === "" || this.user.email === "") {
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