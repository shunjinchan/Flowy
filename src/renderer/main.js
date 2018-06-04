import Vue from 'vue'
// import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRx from 'vue-rx'

import App from './App'
import router from './router'
import store from './store'
import shortcut from './modules/shortcut'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueRx)
Vue.use(ElementUI, { size: 'small' })
shortcut.register()
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
