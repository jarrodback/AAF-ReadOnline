import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./styling/style.css";

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
    data: {
        user_id: "61dd56a297402ee89224efb2", //TODO: Update with real user_id retrieval once login system is done
    },
}).$mount("#app");
