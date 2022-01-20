<template>
    <div>
        <h1>Register</h1>
        <register-form></register-form>
    </div>
</template>
 
<script>
import RegistrationForm from "../../components/RegistrationForm.vue";

export default {
    name: "register-user",
    components: {
        "register-form": RegistrationForm,
    },
    methods: {},
};
</script>