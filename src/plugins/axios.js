import Vue from 'vue';
import VueAxios from 'vue-plugin-axios';
import axios from 'axios';
 
Vue.use(VueAxios, {
  axios, 
  config: {
    baseURL: 'http://localhost:3001/api/',
  }
});