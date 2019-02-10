import '@babel/polyfill'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import Chat from 'vue-beautiful-chat'
import Notifications from 'vue-notification'
Vue.use(Chat);
Vue.use(Notifications)

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000'
}));

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
