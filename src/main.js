import Vue from 'vue';
import NotFound from './components/NotFound.vue';
import Home from './components/Home.vue';
import Account from './components/Account.vue';

Vue.config.productionTip = false;
/* eslint-disable */
const routes = {
  '/': Home,
  '/account': Account,
};

(() => new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname,
  },
  computed: {
    ViewComponent() {
      return routes[this.currentRoute] || NotFound;
    },
  },
  render(h) { return h(this.ViewComponent); },
}))();

/* new Vue({
  render: h => h(Home),
}).$mount('#app');
*/
