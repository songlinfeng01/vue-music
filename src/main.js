import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import Mintui from 'mint-ui'
import 'mint-ui/lib/style.css'
// import {Swipe, SwipeItem, Lazyload} from 'mint-ui'
// Vue.component(Swipe.name, Swipe)
// Vue.component(SwipeItem.name, SwipeItem)
// Vue.use(Lazyload)
Vue.use(Mintui)

fastclick.attach(document.body)

// Vue.config.productionTip = false
/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
