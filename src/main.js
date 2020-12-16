import Vue from 'vue';
import App from './App.vue';

import vuetify from './plugins/vuetify';
import 'plugins/axios';

import router from 'routes';
import store from 'store';

import './filters';

Vue.config.productionTip = false

new Vue({ router, store, vuetify, render: h => h(App) }).$mount('#app');
