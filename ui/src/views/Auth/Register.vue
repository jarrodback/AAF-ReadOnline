<template>
    <div>
        <h1>Register</h1>
        <register-form></register-form>
    </div>
</template>
 
<script>
import RegistrationForm from "../../components/Auth/RegistrationForm.vue";

/**
 * View to control what the user sees when registering in.
 */
export default {
    name: "register-user",
    components: {
        "register-form": RegistrationForm,
    },
};
</script>