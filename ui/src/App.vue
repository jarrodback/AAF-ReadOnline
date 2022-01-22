<template>
    <div id="app">
        <div>
            <nav-bar></nav-bar>
            <div class="column">
                <router-view />
            </div>
        </div>
    </div>
</template>
 
<script>
import Navigation from "./components/Generic/Navigiation.vue";

export default {
    name: "App",

    components: {
        "nav-bar": Navigation,
    },
};
</script>
 
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>