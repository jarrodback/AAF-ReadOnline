<template>
 <div id="app">
   <div>
     <router-link to="/requests" exact >
       List Requests
     </router-link>
     <router-link to="/requests/new" exact >
       New Request
    </router-link>
   </div>
   <div>
     <div class="column">
       <router-view />
     </div>
   </div>
 </div>
</template>
 
<script>
export default {
 name: 'App'
}
</script>
 
<style>
#app {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 text-align: center;
 color: #2c3e50;
 margin-top: 60px;
}
</style>