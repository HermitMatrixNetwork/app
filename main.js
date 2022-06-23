import App from './App'
import uView from '@/uni_modules/uview-ui'
import {
  secretjs
} from '@/utils/index.js'
import miniCache from '@/utils/appCache'

Vue.prototype.$secretjs = secretjs
Vue.use(uView)
Vue.use(miniCache)

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif