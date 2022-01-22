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
/**
 * View to control if a user navigates to a route they do not have permission for.
 */
export default {
    name: "NotFound",

    /**
     * On navigation, redirect the user after 5 seconds.
     */
    created() {
        setTimeout(() => this.redirect(), 5000);
    },

    methods: {
        /**
         * Redirect the user to the previous page.
         */
        redirect() {
            this.$router.back();
        },
    },
};
</script>

<style>
center {
    margin: 15vw;
}
</style>
