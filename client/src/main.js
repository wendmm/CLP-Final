import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import { sync } from "vuex-router-sync";

import vuetify from "./plugins/vuetify";
Vue.config.productionTip = false;

import VueApexCharts2 from "vue-apexcharts";
import VueBarcode from "vue-barcode";

Vue.component("apexchart", VueApexCharts2);
Vue.component("barcode", VueBarcode);

sync(store, router);

new Vue({
	el: "#app",
	router,
	store,
	vuetify,
	render: (h) => h(App),
});
