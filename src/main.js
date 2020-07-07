import Vue from 'vue'
import App from './App.vue'

import {
  BBadge,
  BSpinner
} from 'bootstrap-vue';

Vue.component('b-badge', BBadge);
Vue.component('b-spinner', BSpinner);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
