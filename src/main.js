// require("dotenv").config();
import Vue from 'vue'

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import MarqueeText from 'vue-marquee-text-component';
import Vidle from 'v-idle';
import VueCookies from 'vue-cookies';

import store from "./store";
import App from "./App.vue";
// import stuff from "./config.json";

Vue.config.productionTip = false;
Vue.use(VueCookies, { expire: '30d' });
Vue.component('marquee-text', MarqueeText);
Vue.use(Vidle);

let options = { cors: ['*'] };
options.query = {};

if ("userid" in localStorage) {
  options.query.userid = localStorage.userid;
}
if ("seentut" in localStorage) {
  options.query.seentut = localStorage.seentut;
}

console.log(process.env);
const socket = io(process.env.VUE_APP_SERVER_LOC, options);
Vue.use(VueSocketIOExt, socket, { store });


Vue.directive('click-outside', {
  bind: function (element, binding, vnode) {
    element.clickOutsideEvent = function (event) {  //  check that click was outside the el and his children
      if (!(element === event.target || element.contains(event.target))) { // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', element.clickOutsideEvent)
  },
  unbind: function (element) {
    document.body.removeEventListener('click', element.clickOutsideEvent)
  }
});

new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')
