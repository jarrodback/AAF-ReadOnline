import Vue from "vue";
import VueFlashMessage from "vue-flash-message";
import App from "./App.vue";
import router from "./router";
// import "./styling/style.css";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
Vue.use(VueFlashMessage);
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

new Vue({
    router,
    render: (h) => h(App),
    data: {
        user_id: "61dd56a297402ee89224efb2", //TODO: Update with real user_id retrieval once login system is done
    },
}).$mount("#app");
