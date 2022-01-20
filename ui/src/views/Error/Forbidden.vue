<template>
    <center>
        <h1>403: You do not have permission to view this page</h1>
        <p>
            You will be redirect in 5 seconds...
        </p><br>
        <p>
            Click <b-link v-on:click="redirect">here</b-link> if you aren't redirected</p>
    </center>
</template>

<script>
export default {
    name: "NotFound",

    created() {
        setTimeout(() => this.redirect(), 5000);
    },

    methods: {
        redirect() {
            this.$router.back();
        },
    },
};
</script>

<style scoped>
center {
    margin: 15vw;
}
</style>
