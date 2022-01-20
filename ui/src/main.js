import Vue from "vue";
import VueFlashMessage from "vue-flash-message";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "vue-flash-message/dist/vue-flash-message.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueCompositionAPI from "@vue/composition-api";
import "@/assets/css/main.css";

Vue.use(VueCompositionAPI);
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
