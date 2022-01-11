<template>
 <div>
   <h1>Requests</h1>
   <table id="requests" class="ui celled compact table">
     <thead>
       <tr>
         <th> Name </th>
         <th> Cost </th>
         <th> Author </th>
         <th> Date Published </th>
         <th> AudioBook</th>
       </tr>
     </thead>
     <tr v-for="(request, i) in requests" :key="i">
       <td>{{ request.name }}</td>
       <td>{{ request.cost }}</td>
       <td>{{ request.author }} </td>
       <td>{{ request.datePublished }} </td>
       <td>{{ request.audiobook }}</td>
     </tr>
   </table>
 </div>
</template>
 
<script>
import { api } from '../helpers/helpers.js';
export default {
    name: 'requests',
    data() {
        return {
            requests: []
        };
    },
    async mounted() {
        this.requests = await api.getrequests();
        console.log("Fetch " + JSON.stringify(this.requests.data) );
    }
};
</script>