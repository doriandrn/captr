// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './popup.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#captr',
  components: { App },
  render: h => h(App)
})
